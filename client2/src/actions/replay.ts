import { btReplay, btReplays } from "./buckets";
import { GET } from "./http";
import { addRoom, findGamePanelByRoom, updateGamePanel, updateRoomStatus } from "./room";
import config from "../config";

// import delta from "acos-json-delta";
import { merge } from "acos-json-encoder";

export async function findGameReplays(game_slug:string) {
    try {
        let response = await GET("/api/v1/game/replays/" + game_slug);
        let replays = response.data;
        if (!replays || replays.length == 0) return;

        for (const replay of replays) {
            replay.game_slug = game_slug;
        }

        btReplays.assign({ [game_slug]: replays });

        if (replays && replays.length > 0) {
            await downloadGameReplay(replays[0]);
        }
    } catch (e) {
        console.error(e);
    }
}


export function decodeReplay(data: any) {
    // let buffer = base64ToBytesArr(data);

    console.log("[REPLAY] data size = ", data.length);
    // console.log('[REPLAY] buffer size = ', buffer.length);
    // let msg = decode(buffer);
    let msg = data;

    if (msg.length > 0) {
        msg[0].payload = merge({}, msg[0].payload);
        msg[0].payload = merge({}, msg[0].payload);
    }

    console.log("[REPLAY] json size", JSON.stringify(msg).length);
    return msg;
}


// export function downloadReplay(game_slug) {
//     return new Promise(async (rs, rj) => {
//         try {
//             let url = `${config.https.cdn}g/test-game-3/replays/7/rank/1661646594335.json`;

//             let response = await GET(url);
//             let jsonStr = response.data;

//             rs(jsonStr);

//             // fetch(url)
//             //     .then(response => {
//             //         if (!response.ok) {
//             //             console.error("Failed to download JSON replay");
//             //         }
//             //         return response.json();
//             //     })
//             //     .then(data => {
//             //         rs(data);
//             //     })
//             //     .catch(err => {
//             //         rj(err);
//             //     })
//         } catch (e) {
//             rj(e);
//         }
//     });
// }


export async function downloadGameReplay(replay: any) {
    if (!replay || !replay.version || !replay.mode) return null;

    //add json ext if missing
    // if (replay.filename.indexOf(".json") == -1) replay.filename += ".json";

    let url = `${config.https.cdn}g/${replay.game_slug}/replays/${replay.room_slug}.json`;

    let response = await GET(url);

    let history = response.data;

    if (history) {
        history = decodeReplay(history);
    }

    if (history[0] && history[0].version && history[0].gameid) {
        replay = Object.assign(replay, history[0]);
        // history.shift();
    }

    replay.replayId = `${replay.room_slug}`;
    // replay.room_slug = "REPLAY/" + replay.room_slug + "/" + replay.game_slug;
    replay.isReplay = true;
    // replay.timerSequence = 0;

    // replay.version = 21;

    console.log(history);

    let msg = {
        room: replay,
        payload: history,
    };

    let gamepanel = addRoom(msg);
    console.log("[downloadGameReplay] ", gamepanel);

    btReplay.assign({ [replay.game_slug]: gamepanel });

    return gamepanel;
}

// function base64ToBytesArr(str: string) {
//     const abc = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"]; // base64 alphabet
//     let result = [];

//     for (let i = 0; i < str.length / 4; i++) {
//         let chunk = [...str.slice(4 * i, 4 * i + 4)];
//         let bin:string = chunk.map((x) => abc.indexOf(x).toString(2).padStart(6, 0)).join("");
//         let bytes = bin?.match(/.{1,8}/g)?.map((x) => +("0b" + x));
//         if( bytes )
//         result.push(...bytes.slice(0, 3 - (str[4 * i + 2] == "=") - (str[4 * i + 3] == "=")));
//     }
//     return result;
// }




export function replayPrevIndex(room_slug:string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room) return;

    let jumpIndex = gamepanel.room.replayIndex - 1;

    //if we are currently in gameover state, jump back 2 times
    // if (gamepanel.room.replayIndex == gamepanel.gamestate.length - 1)
    //     jumpIndex -= 1;

    replayJumpToIndex(room_slug, jumpIndex);
}

export function replayTimerTriggerNext(room_slug:string, delay:number) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room) return;

    if (gamepanel.room.replayTimerHandle) {
        clearTimeout(gamepanel.room.replayTimerHandle);
    }

    gamepanel.room.replayTimerHandle = setTimeout(() => {
        replayNextIndex(room_slug);
    }, delay);
}

export function replayNextIndex(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    let iframe = gamepanel.iframe;

    if (!iframe) return false;

    let history = gamepanel.room.history;
    if (!(history || history.length == 0)) {
        //    iframe.resize();
        return false;
    }

    let nextId = gamepanel.room.replayIndex + 1;
    if (nextId >= history.length) return false;

    let merged = gamepanel.gamestate;
    let copy = JSON.parse(JSON.stringify(history[nextId].payload));

    if (merged?.room?.events) {
        merged.room.events = [];
    }
    merge(merged, copy);

    merged.room_slug = history[0].room_slug;

    // merged = { room_slug: history[nextId].room_slug, ...merged };

    if (merged?.room?.timesec) {
        if (history.length > nextId + 1) {
            let nextHistory = history[nextId + 1];
            let nextCopy = JSON.parse(JSON.stringify(nextHistory.payload));
            let nextMerged = JSON.parse(JSON.stringify(merged));
            merge(nextMerged, nextCopy);

            let nextUpdated = nextMerged.room.updated;
            let currentUpdated = merged.room.updated;

            if (gamepanel.room.updated != merged?.room?.updated) {
                let now = Date.now();
                // gamepanel.room.timerSequence = merged?.timer?.sequence || 0;
                gamepanel.room.starttime = merged?.room?.starttime || 0;
                gamepanel.room.endtime = now + merged?.room?.timesec * 1000;
            }

            replayTimerTriggerNext(room_slug, nextUpdated - currentUpdated);
        }
    }

    merged.room.timeend = gamepanel.room.endtime;

    let players = merged?.players;
    merged.local = players[gamepanel.room.replayFollow];

    gamepanel.room.replayIndex = gamepanel.room.replayIndex + 1;
    gamepanel.gamestate = structuredClone(merged);
    updateGamePanel(gamepanel);
    updateRoomStatus(room_slug);

    if (iframe?.current?.contentWindow) iframe.current.contentWindow.postMessage(merged, "*");
}

export function replayJumpToIndex(room_slug: string, startIndex: number) {
    let gamepanel = findGamePanelByRoom(room_slug);
    let iframe = gamepanel.iframe;

    if (!iframe || !iframe.current || !iframe.current.contentWindow) return false;

    let history = gamepanel.room.history;
    if (!(history || history.length == 0)) {
        //    iframe.resize();
        return false;
    }

    if (startIndex < gamepanel.room.replayStartIndex || startIndex >= history.length) {
        return false;
    }

    if (gamepanel.room.replayIndex == history.length - 1) {
    }

    
    gamepanel.room.replayIndex = startIndex;

    let merged:any = {};
    // gamepanel.room.timerSequence = -1;
    // gamepanel.room.timeend = 0;
    for (let i = 1; i <= startIndex; i++) {
        //skip first one if it has room metadata
        if (history[i].payload.gameid) {
            continue;
        }

        let copy = JSON.parse(JSON.stringify(history[i].payload));
        if ("events" in merged) merged.room.events = [];
        if ("action" in merged) {
            merged.action = [];
        }

        merged = merge(merged, copy);

        if (gamepanel.room.updated != merged?.room?.updated) {
            // gamepanel.room.timerSequence = merged?.timer?.sequence || 0;
            gamepanel.room.endtime = Date.now() + (merged?.room?.timesec * 1000 || 0);
        }
    }

    // merged.room_slug = history[0].room_slug;

    if (history.length > startIndex + 1) {
        let nextHistory = history[startIndex + 1];
        let nextCopy = JSON.parse(JSON.stringify(nextHistory.payload));
        let nextMerged = JSON.parse(JSON.stringify(merged));
        nextMerged = merge(nextMerged, nextCopy);

        let nextUpdated = nextMerged.room.updated;
        let currentUpdated = nextMerged.room.updated;

        if (gamepanel.room.updated != nextMerged?.room?.updated) {
            let now = Date.now();
            // gamepanel.room.timerSequence = merged?.timer?.sequence || 0;
            gamepanel.room.starttime = nextMerged?.room?.starttime || 0;
            gamepanel.room.endtime = now + nextMerged?.room?.timesec * 1000;
        }

        replayTimerTriggerNext(room_slug, nextUpdated - currentUpdated);
    }

    if( !merged?.room )
        return;

    merged.room.timeend = gamepanel.room.timeend;

    let players = merged?.players;
    if (!gamepanel.room.replayFollow) {
        let playerIds = Object.keys(players);
        let randomPlayerId = playerIds[Math.floor(Math.random() * playerIds.length)];

        merged.local = players[randomPlayerId];

        gamepanel.room.replayFollow = randomPlayerId;
    } else {
        merged.local = players[gamepanel.room.replayFollow];
    }

    for (let shortid in players) {
        let player = players[shortid];
        player.portrait = `${config.https.cdn}images/portraits/assorted-${
            player.portraitid || 1
        }-medium.webp`;
    }

    merged.room.timeend = gamepanel.room.endtime;

    gamepanel.gamestate = structuredClone(merged);
    updateGamePanel(gamepanel);
    updateRoomStatus(room_slug);
    if (iframe?.current?.contentWindow) iframe.current.contentWindow.postMessage(merged, "*");
}

export function replaySendGameStart(room_slug:string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    let iframe = gamepanel.iframe;

    if (!iframe) return false;

    let history = gamepanel.room.history;
    if (!(history || history.length == 0)) {
        //    iframe.resize();
        return false;
    }

    //find gamestart index
    let replayStartIndex = 0;
    for (let i = 0; i < history.length; i++) {
        let gamestate = history[i];
        if (gamestate?.payload?.room?.status == "gamestart") {
            replayStartIndex = i;
            break;
        }
    }

    gamepanel.room.replayStarted = true;
    gamepanel.room.replayStartIndex = replayStartIndex;
    gamepanel.room.timeend = Date.now() + (gamepanel.room.timesec || 0);
    //gamepanel.gamestate = merged;
    //updateGamePanel(gamepanel);

    replayJumpToIndex(room_slug, replayStartIndex);
}