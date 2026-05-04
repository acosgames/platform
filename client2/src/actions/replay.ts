import { btReplay, btReplays } from "./buckets";
import { GET } from "./http";
import { addRoom, findGamePanelByRoom, updateGamePanel, updateRoomStatus } from "./room";
import config from "../config";

// import delta from "acos-json-delta";
import { merge } from "acos-json-encoder";
import { GameStatus } from "@acosgames/framework";

export async function findGameReplays(game_slug: string) {
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
        type: "replay",
        payload: {
            gamestate: history,
            room: replay,
        }
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




export function replayPrevIndex(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room) return;

    let jumpIndex = gamepanel.room.replayIndex - 1;

    gamepanel.gamestate = structuredClone(gamepanel.room.history[1].payload);
    gamepanel.room.replayIndex = gamepanel.room.replayStartIndex;

    //if we are currently in gameover state, jump back 2 times
    // if (gamepanel.room.replayIndex == gamepanel.gamestate.length - 1)
    //     jumpIndex -= 1;

    jumpToState(room_slug, jumpIndex, true);
}

export function replayNextIndex(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room) return;
    let jumpIndex = gamepanel.room.replayIndex+1;

    jumpToState(room_slug, jumpIndex, true);
}

export function replayTimerTriggerNext(room_slug: string, delay: number) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room) return;

    if (gamepanel.room.replayTimerHandle) {
        clearTimeout(gamepanel.room.replayTimerHandle);
        gamepanel.room.replayTimerHandle = null;
    }

    gamepanel.room.replayTimerHandle = setTimeout(() => {
        let jumpIndex = gamepanel.room.replayIndex+1;

        jumpToState(room_slug, jumpIndex, false);
    }, delay);
}


export function mergeToState(room_slug: string, index: number): { current: GameStateLocal; prev: GameStateLocal; next: GameStateLocal } {
    const gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room || !gamepanel.room.isReplay) return { current: {} as GameStateLocal, prev: {} as GameStateLocal, next: {} as GameStateLocal };

    let currentIndex = gamepanel?.room?.replayIndex ?? gamepanel.room.replayStartIndex ?? 0;
    
    let history = gamepanel.room.history;
    let current: GameStateLocal = structuredClone(gamepanel.gamestate) as GameStateLocal;
    let prev: GameStateLocal = {} as GameStateLocal;
    if (index < currentIndex) {
        currentIndex = 1;
        current = structuredClone(history[1].payload) as GameStateLocal;
        // index = gamepanel.room.replayStartIndex ?? 0;
    }

    let cur: GameStateLocal = {} as GameStateLocal;
    for (let i = currentIndex; i <= index; i++) {
        cur = structuredClone(history[i].payload);
        if( current?.room?.events ) {
            current.room.events = []
        }
        prev = structuredClone(cur);
        current = merge(current, cur);
    }

    cur = structuredClone(current);

    let next = {} as GameStateLocal;
    if (history.length > index + 1) {
        next = structuredClone(history[index + 1].payload);
        if( cur?.room?.events ) {
            cur.room.events = []
        }
        next = merge(cur, next);
    }
    return { current, prev, next };
}


export interface GameStateLocal extends GameState {
    local?: Player;
    action?: any;
}

const emptyGamestate = { current: {} as GameStateLocal, prev: {} as GameStateLocal, next: {} as GameStateLocal };

export function jumpToState(room_slug: string, index: number, paused: boolean): { current: GameStateLocal; prev: GameStateLocal; next: GameStateLocal } {
    const gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room)
        return gamepanel.replayState ?? emptyGamestate;

    if (index >= gamepanel.room.history.length || index < gamepanel.room.replayStartIndex)
        return gamepanel.replayState ?? emptyGamestate;
    let { current, prev, next } = mergeToState(room_slug, index);

    const now = Date.now();
    // if (current?.room?.updated) {
    //     if (current.room.timeend)
    //         current.room.timeend = 0;
    //     // current.room.updated = now - (current.room.starttime ?? 0);
    // }

    // if (prev?.room?.updated) {
    //     if (prev.room.timeend)
    //         prev.room.timeend = 0;
    //     // prev.room.updated = now - (prev.room.starttime ?? 0);
    // }

    let players = current?.players;
    if (players) {
        current.local = players[gamepanel.room.replayFollow ?? 0];

        for (let player of players) {
            player.portrait = `${config.https.cdn}images/portraits/assorted-${player.portraitid || 1
                }-medium.webp`;
        }
    }
    
    if( current?.room ) {
        current.room.starttime = Date.now() - (current.room.updated ?? 0); 
    }
    gamepanel.room.replayIndex = index;
    gamepanel.gamestate = current;
    gamepanel.replayState = { current, prev, next };
    updateGamePanel(gamepanel);
    updateRoomStatus(room_slug);

    let iframe = gamepanel.iframe;
    if (iframe?.current?.contentWindow)
        iframe.current.contentWindow.postMessage(current, "*");

    if (!paused && next?.room?.updated && current?.room?.updated) {
        let nextUpdated = next.room.updated;
        let currentUpdated = current.room.updated;
        replayTimerTriggerNext(room_slug, nextUpdated - currentUpdated);
    }

    return { current, prev, next };
}

export function pauseReplay(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room) return;
    if (gamepanel.room.replayTimerHandle) {
        clearTimeout(gamepanel.room.replayTimerHandle);
        gamepanel.room.replayTimerHandle = null;
    }

    let iframe = gamepanel.iframe;
    if (iframe?.current?.contentWindow)
        iframe.current.contentWindow.postMessage({type:"pause"}, "*");
}

export function resumeReplay(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel?.room) return;

    let iframe = gamepanel.iframe;
    if (iframe?.current?.contentWindow)
        iframe.current.contentWindow.postMessage({type:"resume"}, "*");

    let replayIndex = gamepanel.room.replayIndex ?? gamepanel.room.replayStartIndex ?? 0;
    let history = gamepanel.room.history;
    if (replayIndex >= history.length - 1) return;
    jumpToState(room_slug, replayIndex, false);
}

export function replaySendGameStart(room_slug: string) {
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
    for (let i = 1; i < history.length; i++) {
        let gamestate = history[i].payload;
        if (gamestate?.room?.status == GameStatus.gamestart) {
            replayStartIndex = i;
            break;
        }
    }

    gamepanel.gamestate = structuredClone(history[1].payload);
    gamepanel.room.replayIndex = replayStartIndex;

    gamepanel.room.replayStarted = true;
    gamepanel.room.replayStartIndex = replayStartIndex;
    // gamepanel.room.timeend = (gamepanel.room.timesec || 0) * 1000;
    //gamepanel.gamestate = merged;
    //updateGamePanel(gamepanel);

    if (iframe?.current?.contentWindow)
        iframe.current.contentWindow.postMessage({type:"resume"}, "*");

    jumpToState(room_slug, replayStartIndex, false);
}