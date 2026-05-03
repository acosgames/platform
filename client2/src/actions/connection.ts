
// import { encode, decode, defaultDict } from 'acos-json-encoder';
// const { encode, decode, defaultDict } = require('acos-json-encoder');
// import ACOSEncoder from "acos-json-encoder"; // '../util/encoder';
// import ACOSDictionary from 'shared/model/acos-dictionary.json';
// ACOSEncoder.createDefaultDict(ACOSDictionary);

// const encode = ACOSEncoder.encode;
// const decode = ACOSEncoder.decode;
import { getUser } from "./person";

// import config from "../config";

// import delta from "acos-json-delta";
import {
    findGamePanelByIFrame,
    findGamePanelByRoom,
    getGamePanels,
    setRoomActive,
    updateGamePanel,
    updateRoomStatus,
} from "./room";
// import { findGameLeaderboard, findGameLeaderboardHighscore } from "./game";
// import { GET } from "./http";
import {
    // btChatToggle,
    btHistory,
    // btJoinQueues,
    btLatency,
    btOffsetTime,
    // btPlayerCount,
    btPlayerStats,
    // btQueues,
    // btServerOffset,
    btShowLoadingBox,
    btTimeleft,
    btTimeleftUpdated,
    btUser,
    // btWebsocket,
    // btWebsocketConnected,
} from "./buckets";
import { replaySendGameStart } from "./replay";
import { wsDecode, wsSend } from "./ws";
import { wsIncomingHandlers } from "./wsIncomingHandlers";
import { GameStatus, gs } from "@acosgames/framework";
import { merge } from "acos-json-encoder";


var messageQueue: { [key: string]: ACOSMessage[] } = {};

var timerHandle = 0;
export function timerLoop(cb?: () => void) {
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

        let gamestate = gs(gamepanel.gamestate);
        if(!gamestate) continue;

        // let timer = gamestate.timer;
        // if (!timer) {
        //     continue;
        // }

        let deadline = gamestate.startTime + gamestate.deadline;
        if (!deadline) continue;

        let eventMap = gamestate.eventsMap();
        if (
            eventMap.gameover ||
            eventMap.gamecancelled ||
            eventMap.gameerror
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

export function fastForwardMessages(room_slug: string) {
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

        let last = mq[mq.length - 1];

        // }

        iframe.current.contentWindow.postMessage(last, "*");
        console.log(last);

        delete messageQueue[room_slug];
    }

    // iframe.resize();
}

export function sendFrameMessage(msg: any) {
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

export function sendPauseMessage(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (gamepanel && gamepanel.iframe?.current) {
        gamepanel.iframe.current.contentWindow.postMessage({ type: "pause" }, "*");
    }
}

export function sendUnpauseMessage(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (gamepanel && gamepanel.iframe?.current) {
        gamepanel.iframe.current.contentWindow.postMessage({ type: "unpause" }, "*");
    }
}

export function sendLoadMessage(room_slug: string) {
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

export async function refreshGameState(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);

    let gamestate = gamepanel.gamestate;
    let user = await getUser();
    // if (iframe) {
    let local: any = {};
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

export function getFrameByEvent(event: MessageEvent) {
    return Array.from(document.getElementsByTagName("iframe")).filter((iframe) => {
        return iframe.contentWindow === event.source;
    })[0];
}



export async function recvFrameMessage(evt: MessageEvent<any>) {
    let action = evt.data;

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
            if (gamestatus && gamestatus != GameStatus.pregame) {
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

    if( action.type == 'gamesettings' ) {
            // let gamepanel = findGamePanelByRoom(room_slug);
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
    let byteLen = await wsSend({ type: "gameaction", payload: action });
    console.log("[Outgoing] Action:", "[" + byteLen + " bytes]", action);
    // }
}

export function updateBrowserTitle(title: string) {
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

export async function wsIncomingMessage(message: WSMessage) {
    let user = btUser.get();
    let history = btHistory.get();

    let buffer = message.data;
    let msg: ACOSMessage = wsDecode(buffer);
    if (!msg) {
        console.error("Error: Unable to decode buffer of size " + buffer.byteLength);
        return;
    }

    if (msg.type == 'gameupdate') {
        msg = msg.payload;
    }

    const incomingHandler = wsIncomingHandlers[msg.type];
    if (!incomingHandler) {
        console.log(
            "[Incoming] Unknown type: ",
            "[" + buffer.byteLength + " bytes]",
            JSON.parse(JSON.stringify(msg, null, 2))
        );
        return;
    }

    const handlerAction = await incomingHandler({
        msg,
        byteLength: buffer.byteLength,
        history: typeof history === "function" ? history : undefined,
        timerLoop,
    });

    if (handlerAction === "return") {
        return;
    }

    if (msg.payload) {
        // const payload = msg.payload as any;
        // let { gamestate, room } = msg.payload;
        let gamepanel = findGamePanelByRoom(msg?.room_slug || msg?.room?.room_slug || msg?.payload?.room?.room_slug || null);
        // let room = gamepanel?.room;
        // let gamestate = gamepanel?.gamestate; //JSON.parse(JSON.stringify(gamepanel?.gamestate));
        if (!gamepanel?.gamestate) return;

        // console.log("[Previous State]: ", gamestate);
        if (msg.type == "private") {
            updateRoomPrivateMessage(gamepanel, gamepanel?.gamestate, gamepanel?.room, msg.payload?.player, user);
            return;
        } else {
            msg.payload = updateRoomPublicMessage(gamepanel, gamepanel?.gamestate, msg.payload);
        }
    }

    const payload = msg.payload as any;

    if (payload?.players) {
        payload.local = payload.players.find((p: any) => p.shortid == user.shortid);
        // msg.local = payload.players[user.shortid];
        // if (msg.local) msg.local.shortid = user.shortid;
    } else {
        payload.local = { displayname: user.displayname, shortid: user.shortid };
    }

    let out = { local: msg.local, ...(payload || {}) };

    // console.timeEnd('ActionLoop');
    sendFrameMessage(out);

    postIncomingMessage(msg);

    updateRoomStatus(msg.room_slug || msg.room?.room_slug || null);
}

function updateRoomPublicMessage(gamepanel: any, gamestate: any, payload: any) {
    if (payload?.room?.timeend) {
        let latency = btLatency.get() || 0;
        let offsetTime = btOffsetTime.get() || 0;
        let extra = 30; //for time between WS and gameserver
        payload.room.timeend += -offsetTime - latency / 2 - extra;
    }

    if (payload?.action)
        payload.action = {};
    if (gamestate?.room?.events)
        gamestate.room.events = [];

    let payloadStr = JSON.stringify(payload);
    let deltaState = JSON.parse(payloadStr);
    let mergedState = JSON.parse(payloadStr);
    mergedState = merge(gamestate, mergedState);
    // msg.payload.delta = deltaState;

    mergedState.delta = deltaState;

    gamepanel.gamestate = structuredClone(mergedState);
    console.log("[FULL GAMESTATE]", mergedState);

    if (gamepanel.gamestate.players) {
        for (const id in gamepanel.gamestate.players) {
            gamepanel.gamestate.players[id].id = id;
            gamepanel.gamestate.players[
                id
            ].portrait = `https://assets.acos.games/images/portraits/assorted-${gamepanel?.gamestate?.players[id]?.portraitid || 1
            }-medium.webp`;
        }
    }

    updateGamePanel(gamepanel);

    return mergedState;
}

function updateRoomPrivateMessage(gamepanel: any, gamestate: any, room: any, payload: any, user: any) {
    let player = gamestate.players[user.shortid];
    player = merge(player, payload);

    // getRoom(msg.room_slug);
    //UPDATE PLAYER STATS FOR THIS GAME
    if (room?.mode == "rank" && payload?._played) {
        let player_stat = btPlayerStats.get((bucket: any) => bucket[room.game_slug]);
        // let player_stat = player_stats[room.game_slug]
        if (player_stat) {
            if (payload._win) player_stat.win = payload._win;
            if (payload._loss) player_stat.loss = payload._loss;
            if (payload._tie) player_stat.tie = payload._tie;
            if (payload._played) player_stat.played = payload._played;
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
}


async function postIncomingMessage(msg: ACOSMessage) {
    let gamepanel = findGamePanelByRoom(msg?.room_slug || msg?.room?.room_slug || msg?.payload?.room?.room_slug || null);
    let room = gamepanel.room;
    const payload = msg.payload as any;
    // let gamestate = gamepanel.gamestate;

    switch (msg.type) {
        case "gameover":
            let user = btUser.get();
            if (room.mode == "rank") {
                let player = payload.players[user.shortid];

                let player_stat = btPlayerStats.get((bucket: any) => bucket[room.game_slug]);
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
