// import { w3cwebsocket as W3CWebSocket } from "websocket";
import { btChatToggle, btDuplicateTabs, btJoinQueues, btLatency, btOffsetTime, btPlayerCount, btQueues, btServerOffset, btUser, btWebsocket, btWebsocketConnected } from "./buckets";
import { revertBrowserTitle, sendPauseMessage, wsIncomingMessage } from "./connection";
import { getUser, isUserLoggedIn, validateLogin } from "./person";
import { clearGameQueues, getJoinQueues } from "./queue";
import { setLastJoinType, setRoomActive } from "./room";

import ACOSEncoder from "acos-json-encoder"; // '../util/encoder';
import ACOSDictionary from 'shared/model/acos-dictionary.json';
ACOSEncoder.createDefaultDict(ACOSDictionary);

import config from "../config";

export function wsDecode(buffer: Uint8Array | ArrayBuffer | any): ACOSMessage {
    return ACOSEncoder.decode(buffer);
}

export function wsEncode(data: ACOSMessage): Uint8Array | ArrayBuffer {
    return ACOSEncoder.encode(data);
}

export function wsConnect(url?: string, onMessage?: (msg: any) => void, onOpen?: (evt: Event) => void, onError?: (evt: Event) => void): Promise<WebSocket> {
    return new Promise(async (rs, rj) => {
        let ws = btWebsocket.get();
        let user = btUser.get() || { token: "LURKER" };
        btWebsocketConnected.set(false);

        console.log("CONNECT #1", ws, user);
        // if (!user) {
        //     //let ws = await reconnect();
        //     rs(ws);
        //     return;
        // }
        //if connecting or open, don't try to connect
        if (ws && ws.readyState <= 1) {
            //let ws = await reconnect();
            console.log("CONNECT #2");
            rs(ws);
            return;
        }

        // let cookies = parseCookies();
        url = config.https.ws;
        var client = new WebSocket(
            url || "ws://127.0.0.1:9002",
            user.token,
            // "http://localhost:3000",
            // {}
        );
        client.binaryType = "arraybuffer";
        // client.isReady = false;

        client.addEventListener("open", onOpen || ((evt) => {
            console.log(evt);
            console.log("WebSocket Client Connected");
            console.log("CONNECT #4");
            if (rs) rs(client);

            if (client.readyState == client.OPEN) {
                // client.isReady = true;
                wsPing();
            }

            btDuplicateTabs.set(false);
            btWebsocketConnected.set(true);
            // wsRejoinRooms();

            var currentdate = new Date();
            var datetime =
                "WS Opened: " +
                currentdate.getDate() +
                "/" +
                (currentdate.getMonth() + 1) +
                "/" +
                currentdate.getFullYear() +
                " @ " +
                currentdate.getHours() +
                ":" +
                currentdate.getMinutes() +
                ":" +
                currentdate.getSeconds() +
                "." +
                currentdate.getMilliseconds();
            console.log(datetime);
        }));

        client.addEventListener("close", async (evt) => {
            console.log("CONNECT #5");
            console.log(evt);
            // client.isReady = false;
            btWebsocketConnected.set(false);
            var currentdate = new Date();
            var datetime =
                "WS Closed: " +
                currentdate.getDate() +
                "/" +
                (currentdate.getMonth() + 1) +
                "/" +
                currentdate.getFullYear() +
                " @ " +
                currentdate.getHours() +
                ":" +
                currentdate.getMinutes() +
                ":" +
                currentdate.getSeconds() +
                "." +
                currentdate.getMilliseconds();
            console.log(datetime);

            if (rj) rj(evt);
            // clearRooms();
            await reconnect();
        });
        client.addEventListener("error",
            onError || (async (error) => {
                console.log("CONNECT #6");
                console.error(error);
                if (rj) rj(error);

                btWebsocketConnected.set(false);
                var currentdate = new Date();
                var datetime =
                    "WS Errored: " +
                    currentdate.getDate() +
                    "/" +
                    (currentdate.getMonth() + 1) +
                    "/" +
                    currentdate.getFullYear() +
                    " @ " +
                    currentdate.getHours() +
                    ":" +
                    currentdate.getMinutes() +
                    ":" +
                    currentdate.getSeconds() +
                    "." +
                    currentdate.getMilliseconds();
                console.log(datetime);
                await reconnect();
            }));

        client.addEventListener("message", onMessage || wsIncomingMessage);

        btWebsocket.set(client);
    });
}


export async function wsLeaveGame(room_slug: string) {
    let ws = btWebsocket.get();
    if (!ws || !ws.isReady) {
        setRoomActive(room_slug, false);
        return;
    }

    let action = { type: "leave", room_slug };
    let byteLen = await wsSend(action);
    console.log("[Outgoing] Leaving:", "[" + byteLen + " bytes]", action);

    setRoomActive(room_slug, false);
    revertBrowserTitle();
    sendPauseMessage(room_slug);
}

export async function wsLeaveQueue() {
    setLastJoinType("");
    await clearGameQueues();

    btJoinQueues.set(null);
    localStorage.removeItem("joinqueues");
    let action = { type: "leavequeue" };
    let byteLen = await wsSend(action);

    // await disconnect();

    console.log("[Outgoing] Leave Queue:", "[" + byteLen + " bytes]");
}

export async function wsRejoinQueues() {
    if (!(await validateLogin())) return;

    let joinqueues = getJoinQueues() || {};
    let user = btUser.get();

    let jqs = joinqueues.queues || [];
    if (jqs.length > 0 && user) wsJoinQueues(joinqueues.queues, joinqueues.owner);
}

export async function wsJoinQueues(queues: any[], owner: any, attempt?: number) {
    attempt = attempt || 1;

    let joinQueues = { queues, owner };
    btJoinQueues.set(joinQueues);
    localStorage.setItem("joinqueues", JSON.stringify(joinQueues));

    if (attempt > 10) return false;

    if (!(await validateLogin())) return false;

    if (!queues || queues.length == 0 || !queues[0].game_slug) {
        console.error("Queues is invalid.", queues);
        return false;
    }

    let currentQueues = btQueues.get() || [];
    if (currentQueues.length > 0) {
        console.warn("Already in queue", currentQueues);
        // return false;
    }

    let ws = await reconnect(true);
    if (!ws || !ws.isReady) {
        setTimeout(() => {
            wsJoinQueues(queues, owner, attempt + 1);
        }, 500);
        return false;
    }

    // gtag("event", "joinqueues", { queues, owner });

    let user = await getUser();
    let players = [{ shortid: user.shortid, displayname: user.displayname }];
    let payload = { queues, owner, players, captain: user.shortid };
    let action = { type: "joinqueues", payload };
    let byteLen = await wsSend(action);

    console.log("[Outgoing] Queing:", "[" + byteLen + " bytes]", action);

    btQueues.set(queues);

    return true;
}

export async function wsJoinGame(mode: string, game_slug: string) {
    if (!(await validateLogin())) return false;

    let ws = await reconnect(true);
    if (!ws || !ws.isReady) {
        return;
    }

    if (!game_slug) {
        console.error("Game [" + game_slug + "] is invalid.  Something went wrong.");
        return;
    }

    let user = await getUser();

    let queues = [{ mode, game_slug }];
    let players = [{ shortid: user.shortid, displayname: user.displayname }];
    let action = {
        type: "joingame",
        payload: { 
            captain: user.shortid, 
            queues, 
            players 
        },
    };
    let byteLen = await wsSend(action);

    console.log("[Outgoing] Joining " + mode + ":", "[" + byteLen + " bytes]", action);

    wsPing();
}

export async function wsSpectateGame(game_slug: string) {
    let ws = await reconnect(true);
    if (!ws || !ws.isReady) {
        return;
    }

    if (!game_slug) {
        console.error("Game [" + game_slug + "] is invalid.  Something went wrong.");
        return;
    }

    let action = { type: "spectate", payload: { game_slug } };
    let byteLen = await wsSend(action);

    console.log("[Outgoing] Spectating [" + game_slug + "]:", "[" + byteLen + " bytes]", action);
    // console.timeEnd('ActionLoop');
}

export async function wsJoinBetaGame(game: any) {
    // gtag("event", "join", { mode: "experimental", game_slug: game.game_slug });
    wsJoinGame("experimental", game.game_slug);
}

export async function wsJoinRankedGame(game: any) {
    // gtag("event", "join", { mode: "rank", game_slug: game.game_slug });
    wsJoinGame("rank", game.game_slug);
}

export async function wsJoinPublicGame(game: any) {
    wsJoinGame("public", game.game_slug);
}

var forcedLatency:number = Math.round(RandRange(50, 200));
function RandRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export async function wsSendFAKE(action: any) {
    latencyStart = new Date().getTime();

    setTimeout(() => {
        wsSend(action);
    }, forcedLatency);
}

export async function wsSend(action: any) {
    let ws = btWebsocket.get();
    if (!ws || !action) return false;

    try {
        let buffer = ACOSEncoder.encode(action);
        ws.send(buffer);
        return buffer.byteLength;
    } catch (e) {
        console.error(e);
        return false;
    }

}



var latencyStart = 0;
var latency = 0;

export async function wsPing() {
    latencyStart = new Date().getTime();
    let action = { type: "ping", payload: latencyStart };

    let byteLen = await wsSend(action);
    console.log("[Outgoing] Ping:", "[" + byteLen + " bytes]", action);
}


export function onPong(message: any) {
    let serverOffset = message.payload.offset;
    let serverTime = message.payload.serverTime;
    let currentTime = new Date().getTime();
    latency = currentTime - latencyStart;
    let offsetTime = serverTime - currentTime;
    // let halfLatency = Math.ceil(latency / 2);
    // let realTime = currentTime + offsetTime + halfLatency;
    console.log("Latency Start: ", latencyStart);
    console.log("Latency: ", latency);
    console.log("Offset Time: ", offsetTime);
    console.log("Server Offset: ", serverOffset);
    console.log("Server Time: ", serverTime);
    console.log("Client Time: ", currentTime);
    // console.log('Real Time: ', realTime);

    btLatency.set(latency);
    btServerOffset.set(serverOffset);
    btOffsetTime.set(offsetTime);
    btPlayerCount.set(message.playerCount || 0);
}


// export async function parseCookies() {
//     let cookies = {};
//     document.cookie.split(';').forEach(v => {
//         let pair = v.split('=');
//         if (!pair || !pair[0])
//             return;

//         cookies[pair[0].trim()] = pair[1].trim();
//     })
//     return cookies;
// }

// var reconnectTimeout = 0;

export async function disconnect() {
    let ws = btWebsocket.get();
    if (!ws) return;

    ws.close();

    btWebsocket.set(null);
    console.log("Disconnected from server.");
}
export async function reconnect(skipQueues?: any) {
    let ws = btWebsocket.get();
    if (ws && ws.isReady) {
        return ws;
    }

    let duplicatetabs = btDuplicateTabs.get();
    if (duplicatetabs) {
        btChatToggle.set(false);
        return null;
    }

    // if (queues.length == 0 && !isNew && (!rooms || Object.keys(rooms).length == 0))
    //     return disconnect();

    try {
        // if (reconnectTimeout)
        //     clearTimeout(reconnectTimeout);
        // reconnectTimeout = setTimeout(async () => {
        ws = await wsConnect();
        // }, 500);

        if (!skipQueues && isUserLoggedIn()) wsRejoinQueues();
    } catch (e) {
        console.error(e);
        return null;
    }

    return ws;
}
