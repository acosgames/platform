
// import { encode, decode, defaultDict } from 'acos-json-encoder';
// const { encode, decode, defaultDict } = require('acos-json-encoder');
// import ACOSEncoder from "acos-json-encoder"; // '../util/encoder';
// import ACOSDictionary from 'shared/model/acos-dictionary.json';
// ACOSEncoder.createDefaultDict(ACOSDictionary);

// const encode = ACOSEncoder.encode;
// const decode = ACOSEncoder.decode;
import { getUser, isUserLoggedIn, login } from "./person";

import config from "../config";

import delta from "acos-json-delta";
import {
    addRoom,
    addRooms,
    clearRoom,
    findGamePanelByIFrame,
    findGamePanelByRoom,
    getGamePanels,
    setLastJoinType,
    setRoomActive,
    setRoomForfeited,
    updateGamePanel,
    updateRoomStatus,
} from "./room";
import { addGameQueue, clearGameQueues, getJoinQueues, onQueueStats } from "./queue";
// import { findGameLeaderboard, findGameLeaderboardHighscore } from "./game";
import { addChatMessage } from "./chat";
import { GET } from "./http";
import {
    btChatToggle,
    btDuplicateTabs,
    btExperience,
    btGame,
    btHistory,
    btJoinQueues,
    btLatency,
    btOffsetTime,
    btPlayerCount,
    btPlayerStats,
    btQueues,
    btRankingUpdate,
    btServerOffset,
    btShowLoadingBox,
    btTimeleft,
    btTimeleftUpdated,
    btUser,
    btWebsocket,
    btWebsocketConnected,
} from "./buckets";
import { replaySendGameStart } from "./replay";
import { onPong, wsDecode, wsLeaveGame, wsLeaveQueue, wsSend } from "./ws";

var messageQueue = {};
var onResize = null;

var forcedLatency = Math.round(RandRange(50, 200));
// console.log("FORCED LATENCY: ", forcedLatency);
function RandRange(min, max) {
    return Math.random() * (max - min) + min;
}

var timerHandle = 0;
export function timerLoop(cb) {
    if (cb) cb();

    if (timerHandle) {
        clearTimeout(timerHandle);
        timerHandle = 0;
    }

    timerHandle = setTimeout(() => {
        timerLoop(cb);
    }, 30);

    let gamepanels = getGamePanels();

    //no panels, stop the timer
    if (gamepanels.length == 0) {
        clearTimeout(timerHandle);
        timerHandle = 0;
        return;
    }

    let timeleftUpdated = 0;

    for (let i = 0; i < gamepanels.length; i++) {
        let gamepanel = gamepanels[i];
        if (gamepanel.available || !gamepanel.gamestate || !gamepanel.loaded || !gamepanel.active)
            continue;

        let gamestate = gamepanel.gamestate || {};

        // let timer = gamestate.timer;
        // if (!timer) {
        //     continue;
        // }

        let deadline = gamestate?.room?.timeend;
        if (!deadline) continue;

        if (
            gamestate?.room?.events?.gameover ||
            gamestate?.room?.events?.gamecancelled ||
            gamestate?.room?.events?.gameerror
        )
            continue;

        let now = new Date().getTime();
        let elapsed = deadline - now;

        if (elapsed <= 0) {
            elapsed = 0;
        }

        btTimeleft.assign({ [gamepanel.id]: elapsed });
        timeleftUpdated = new Date().getTime();
    }

    if (timeleftUpdated > 0) btTimeleftUpdated.set(timeleftUpdated);
}

export function attachToFrame() {
    window.addEventListener("message", recvFrameMessage, false);
}

export function detachFromFrame() {
    window.removeEventListener("message", recvFrameMessage, false);
}

export function fastForwardMessages(room_slug) {
    // let room_slug = msg.room_slug;
    // let room_slug = getCurrentRoom();
    let gamepanel = findGamePanelByRoom(room_slug);
    let iframe = gamepanel.iframe;

    if (!iframe) return false;

    let gamestate = gamepanel.gamestate;
    if (!gamestate?.state) {
        //    iframe.resize();
        return false;
    }

    let mq = messageQueue[room_slug];
    if (mq && mq.length > 0) {
        console.log("Forwarding queued messages to iframe.");
        // for (var i = 0; i < mq.length; i++) {

        //     gamestate = delta.merge(gamestate, mq[i]);
        let last = mq[mq.length - 1];

        // }

        iframe.current.contentWindow.postMessage(last, "*");
        console.log(last);

        delete messageQueue[room_slug];
    }

    // iframe.resize();
}

export function sendFrameMessage(msg) {
    let room_slug = msg?.room?.room_slug;

    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel) return;

    let iframe = gamepanel.iframe;

    if (!iframe?.current) {
        if (!messageQueue[room_slug]) messageQueue[room_slug] = [];

        messageQueue[room_slug].push(msg);
        return;
    } else {
        try {
            iframe.current.contentWindow.postMessage(msg, "*");
        } catch (e) {
            console.log("Error iframe not working: ", e, gamepanel);
        }
    }
}

export function sendPauseMessage(room_slug) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (gamepanel && gamepanel.iframe?.current) {
        gamepanel.iframe.current.contentWindow.postMessage({ type: "pause" }, "*");
    }
}

export function sendUnpauseMessage(room_slug) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (gamepanel && gamepanel.iframe?.current) {
        gamepanel.iframe.current.contentWindow.postMessage({ type: "unpause" }, "*");
    }
}

export function sendLoadMessage(room_slug) {
    // onResize = runCallback;

    let gamepanel = findGamePanelByRoom(room_slug);
    if (gamepanel && !gamepanel.isReplay && gamepanel.iframe?.current) {
        gamepanel.iframe.current.contentWindow.postMessage(
            {
                type: "load",
                payload: {
                    css: gamepanel.room.css,
                    game_slug: gamepanel.room.game_slug,
                    version: gamepanel.room.version,
                },
            },
            "*"
        );
    }
    // let iframe = getIFrame(room_slug);
    // if (iframe)
    //     iframe.element.current.contentWindow.postMessage({ type: 'load', payload: { game_slug, version } }, '*');
}

export async function refreshGameState(room_slug) {
    let gamepanel = findGamePanelByRoom(room_slug);

    let gamestate = gamepanel.gamestate;
    let user = await getUser();
    let iframe = gamepanel.iframe;
    // if (iframe) {
    let local = {};
    if (gamestate?.players) {
        local = gamestate.players[user.shortid];
        if (local) local.shortid = user.shortid;
    } else {
        local = { displayname: user.displayname, shortid: user.shortid };
    }

    let out = { local, ...gamestate };

    // console.timeEnd('ActionLoop');
    sendFrameMessage(out);
    // }
}

export function getFrameByEvent(event) {
    return Array.from(document.getElementsByTagName("iframe")).filter((iframe) => {
        return iframe.contentWindow === event.source;
    })[0];
}



export async function recvFrameMessage(evt) {
    let action = evt.data;
    let origin = evt.origin;
    let source = evt.source;

    let iframe = getFrameByEvent(evt);

    if (!action.type) return;

    let gamepanel = findGamePanelByIFrame(iframe);
    if (!gamepanel) return;
    // console.log('[iframe]: ', action);

    let room_slug = gamepanel.room.room_slug;
    let gamestate = gamepanel.gamestate;

    if (!gamepanel || !gamepanel.active) return;

    if (action.type == "ready") {
        if (gamepanel.room.isReplay && !gamepanel.room.replayStarted) {
            // replaySendGameStart(room_slug);
        } else {
            fastForwardMessages(room_slug);
            refreshGameState(room_slug);

            let gamestatus = gamestate?.room?.status;
            if (gamestatus && gamestatus != "pregame") {
                return;
            }
        }
    }

    //game loaded
    if (action.type == "loaded") {
        setTimeout(() => {
            gamepanel.loaded = true;
            updateRoomStatus(room_slug);
            updateGamePanel(gamepanel);

            btShowLoadingBox.assign({ [gamepanel.id]: false });
            if (gamepanel.room.isReplay) {
                // setTimeout(() => {
                replaySendGameStart(room_slug);
                // }, 1000)
            }
        }, 300);
        return;
    }

    if (gamepanel.room.isReplay) return;

    // let msg = data.payload;
    // if (msg.indexOf("Hello") > -1) {
    //     this.send('connected', 'Welcome to 5SG!');
    // }

    // if (ws) {
    // console.time('ActionLoop');

    action.room_slug = room_slug;
    // if (gamestate && gamestate.timer)
    //     action.timeseq = gamestate.timer.sequence || 0;
    // else action.timeseq = 0;
    // if (action.payload && action.payload.cell) {
    //     action.payload.cell = 100;
    // }
    let byteLen = await wsSend(action);
    console.log("[Outgoing] Action:", "[" + byteLen + " bytes]", action);
    // }
}



function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



async function wsIncomingMessageFAKE(message) {
    setTimeout(() => {
        wsIncomingMessage(message);
    }, forcedLatency);
}

export function updateBrowserTitle(title) {
    document.title = title;

    let oldFavicon = document.querySelector("link[rel=icon]");
    var link = document.createElement("link");
    link.id = "favicon";
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = "/play-favicon.ico";
    if (oldFavicon) {
        document.head.removeChild(oldFavicon);
    }
    document.head.appendChild(link);
}

export function revertBrowserTitle() {
    document.title = "ACOS Online";

    let oldFavicon = document.querySelector("link[rel=icon]");
    var link = document.createElement("link");
    link.id = "favicon";
    link.type = "image/x-icon";
    link.rel = "icon";
    link.href = "/favicon.ico";
    if (oldFavicon) {
        document.head.removeChild(oldFavicon);
    }
    document.head.appendChild(link);
}

export async function wsIncomingMessage(message) {
    let user = btUser.get();
    let history = btHistory.get();

    let buffer = await message.data;
    let msg = wsDecode(buffer);
    if (!msg) {
        console.error("Error: Unable to decode buffer of size " + buffer.byteLength);
        return;
    }

    switch (msg.type) {
        case "chat":
            console.log("[ChatMessage]:", msg);
            addChatMessage(msg);
            return;
        case "xp":
            console.log("[XP]:", msg);
            btExperience.set(msg.payload);
            let level = msg.payload.level + msg.payload.points / 1000;
            btUser.assign({ level });
            return;
        case "achievements":
            console.log("[Achievements]:", msg);

            let achievements = msg.payload;
            let game_slug = msg.game_slug;

            let game = btGame.get();
            if (game.game_slug == game_slug) {
                for (let a of game.achievements) {
                    if (a.achievement_slug in achievements) {
                        Object.assign(a, achievements[a.achievement_slug]);
                    }
                }
            }

            btGame.assign({ achievements: game.achievements });

            // btExperience.set(msg.payload);
            // let level = msg.payload.level + msg.payload.points / 1000;
            // btUser.assign({ level });
            return;
        case "rankings":
            console.log("[rankings]:", msg);
            btRankingUpdate.set(msg.payload);
        case "queueStats":
            console.log("[queueStats]:", "[" + buffer.byteLength + " bytes]", msg);
            onQueueStats(msg);
            return;
        case "pong":
            onPong(msg);
            return;
        case "addedQueue":
            console.log(
                "[Incoming] queue:",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            addGameQueue(msg.payload.queues);

            return;
        case "removedQueue":
            console.log(
                "[Incoming] queue:",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            await wsLeaveQueue();

            return;
        case "ready":
            console.log("iframe is ready!");
            return;
        case "noshow":
            console.log(
                "[Incoming] No SHOW!",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "notexist":
            let currentPath = window.location.href;
            let currentParts = currentPath.split("/g/");
            if (currentParts.length > 1) {
                let gamemode = currentParts[1].split("/");
                let game_slug = gamemode[0];

                history("/g/" + game_slug);
            }

            clearRoom(msg.room_slug);

            return;

        case "inrooms":
            console.log(
                "[Incoming] InRooms:",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            if (msg.payload && Array.isArray(msg.payload) && msg.payload.length > 0) {
                if (!msg.payload || msg.payload.length == 0) {
                    console.log("No rooms found.");
                    return;
                }

                let multiplayerRoom = msg.payload.find((roomInfo) => roomInfo.room.maxplayers > 1);

                if (multiplayerRoom) {
                    addRooms([multiplayerRoom]);
                    msg.payload.forEach((roomInfo) => {
                        if (roomInfo == multiplayerRoom) return;
                        setRoomForfeited(roomInfo.room.room_slug);
                        wsLeaveGame(roomInfo.room.room_slug);
                    });

                    msg.payload = multiplayerRoom.gamestate;
                    msg.room_slug = multiplayerRoom.room?.room_slug;
                    clearGameQueues();
                } else {
                    addRooms(msg.payload);
                }

                setLastJoinType("");
                timerLoop();

                return;
            }
            break;
        case "joined":
            console.log(
                "[Incoming] Joined:",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            // setCurrentRoom(msg.room.room_slug);

            gtag("event", "joined", { game_slug: msg.room.game_slug });

            addRoom(msg);

            if (msg.room.maxplayers > 1) clearGameQueues();

            setLastJoinType("");

            // gamestate = msg.payload || {};

            timerLoop();

            // let experimental = msg.room.mode == 'experimental' ? '/experimental' : '';
            // let urlPath = '/g/' + msg.room.game_slug + experimental + '/' + msg.room.room_slug;
            // if (window.location.href.indexOf(urlPath) == -1)
            //     history.push(urlPath);
            break;
        case "join":
            console.log(
                "[Incoming] Player joined the game!",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "kicked":
            console.log(
                "[Incoming] You were kicked from game!",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "gameover":
            console.log(
                "[Incoming] Game Over!",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "gamecancelled":
            console.log(
                "[Incoming] Game Cancelled!",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "gameerror":
            console.log(
                "[Incoming] Game Error!",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "private":
            console.log(
                "[Incoming] Private State:",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "update":
            console.log(
                "[Incoming] Update:",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "leave":
            console.log(
                "[Incoming] Player Left:",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            break;
        case "error":
            console.log(
                "[Incoming] ERROR::",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            clearGameQueues();
            setLastJoinType("");
            break;
        case "duplicatetabs":
            console.log(
                "[Incoming] ERROR :: Duplicate Tabs:: ",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            btDuplicateTabs.set(true);
            return;
        default:
            console.log(
                "[Incoming] Unknown type: ",
                "[" + buffer.byteLength + " bytes]",
                JSON.parse(JSON.stringify(msg, null, 2))
            );
            return;
    }

    if (msg.payload) {
        let gamepanel = findGamePanelByRoom(msg.room_slug || msg.room.room_slug);
        let room = gamepanel?.room;
        let gamestate = gamepanel?.gamestate; //JSON.parse(JSON.stringify(gamepanel?.gamestate));
        if (!gamestate) return;

        // console.log("[Previous State]: ", gamestate);
        if (msg.type == "private") {
            let player = gamestate.players[user.shortid];
            player = delta.merge(player, msg.payload);

            // getRoom(msg.room_slug);
            //UPDATE PLAYER STATS FOR THIS GAME
            if (room?.mode == "rank" && msg?.payload?._played) {
                let player_stat = btPlayerStats.get((bucket) => bucket[room.game_slug]);
                // let player_stat = player_stats[room.game_slug]
                if (player_stat) {
                    if (msg.payload._win) player_stat.win = msg.payload._win;
                    if (msg.payload._loss) player_stat.loss = msg.payload._loss;
                    if (msg.payload._tie) player_stat.tie = msg.payload._tie;
                    if (msg.payload._played) player_stat.played = msg.payload._played;
                    // if (msg.payload.rating)
                    //     player_stat.rating = player.rating;
                    // if (player.ratingTxt)
                    //     player_stat.ratingTxt = player.ratingTxt;
                }
                btPlayerStats.assign({ [room.game_slug]: player_stat });
            }

            gamestate.players[user.shortid] = player;
            // gamestate.deltaPrivate = msg.payload;
            updateGamePanel(gamepanel);
            return;
        } else {
            if (msg.payload?.room?.timeend) {
                let latency = btLatency.get() || 0;
                let offsetTime = btOffsetTime.get() || 0;
                let extra = 30; //for time between WS and gameserver
                msg.payload.room.timeend += -offsetTime - latency / 2 - extra;
            }

            gamestate.action = {};
            gamestate.room.events = {};

            let deltaState = JSON.parse(JSON.stringify(msg.payload));
            let mergedState = JSON.parse(JSON.stringify(msg.payload));
            mergedState = delta.merge(gamestate, mergedState);
            // msg.payload.delta = deltaState;

            mergedState.delta = deltaState;

            gamepanel.gamestate = structuredClone(mergedState);
            console.log("[FULL GAMESTATE]", mergedState);

            if (gamepanel.gamestate.players) {
                for (const id in gamepanel.gamestate.players) {
                    gamepanel.gamestate.players[id].id = id;
                    gamepanel.gamestate.players[
                        id
                    ].portrait = `https://assets.acos.games/images/portraits/assorted-${
                        gamepanel?.gamestate?.players[id]?.portraitid || 1
                    }-medium.webp`;
                }
            }

            updateGamePanel(gamepanel);

            msg.payload = mergedState;
        }
    }

    if (msg.payload && msg.payload.players) {
        msg.local = msg.payload.players[user.shortid];
        if (msg.local) msg.local.shortid = user.shortid;
    } else {
        msg.local = { displayname: user.displayname, shortid: user.shortid };
    }

    let out = { local: msg.local, ...msg.payload };

    // console.timeEnd('ActionLoop');
    sendFrameMessage(out);

    postIncomingMessage(msg);

    updateRoomStatus(msg.room_slug || msg.room.room_slug);
}

async function postIncomingMessage(msg) {
    let gamepanel = findGamePanelByRoom(msg.room_slug || msg.room.room_slug);
    let room = gamepanel.room;
    // let gamestate = gamepanel.gamestate;

    switch (msg.type) {
        case "gameover":
            let user = btUser.get();
            if (room.mode == "rank") {
                let player = msg.payload.players[user.shortid];

                let player_stat = btPlayerStats.get((bucket) => bucket[room.game_slug]);
                // let player_stat = player_stats[room.game_slug] || {};
                if (player_stat) {
                    if (player.rating) player_stat.rating = player.rating;
                    //if (player.ratingTxt)
                    //    player_stat.ratingTxt = player.ratingTxt;
                    // player_stats[room.game_slug] = player_stat;
                }
                btPlayerStats.assign({ [room.game_slug]: player_stat });

                // if (room?.maxplayers > 1)
                //     findGameLeaderboard(room.game_slug);

                // if (room?.lbscore || room?.maxplayers == 1) {
                //     findGameLeaderboardHighscore(room.game_slug);
                // }
            }
            break;
        case "gamecancelled":
            break;
        case "gameerror":
            break;
        case "noshow":
            break;
        case "notexist":
            break;
        case "error":
            break;
        case "kicked":
            break;
        default:
            return;
    }

    setRoomActive(room.room_slug, false);
    //sendPauseMessage(room.room_slug);
    revertBrowserTitle();
    // clearRoom(msg.room_slug);
    // delete rooms[msg.room_slug];
    // disconnect()
}
