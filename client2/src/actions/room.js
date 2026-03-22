import { getWithExpiry, removeWithExpiry, setWithExpiry } from "./cache";
import { clearChatMessages } from "./chat";
import { timerLoop, updateBrowserTitle } from "./connection";
import {
    btChatMode,
    btChatUpdated,
    btDisplayMode,
    btGamePanels,
    btGameStatus,
    btGameStatusUpdated,
    btGames,
    btIframes,
    btLastJoin,
    btPrimaryGamePanel,
    btPrimaryRoom,
    btPrimaryState,
    btRoomSlug,
    btRooms,
    btShowLoadingBox,
    btUser,
} from "./buckets";

export function setCurrentRoom(room_slug) {
    btRoomSlug.set(room_slug);
}

export function getCurrentRoom() {
    return btRoomSlug.get() || null;
}

export function setLastJoinType(type) {
    btLastJoin.set(type);
}

export function getLastJoinType() {
    return btLastJoin.get();
}

export function getGamePanel(id) {
    return btGamePanels.get((bucket) => bucket[id]);
}

export function getGamePanels() {
    return btGamePanels.get() || [];
}

export function findGamePanelByRoom(room_slug) {
    let gamepanels = getGamePanels();
    for (let i = 0; i < gamepanels.length; i++) {
        let gp = gamepanels[i];
        if (gp.room.room_slug == room_slug) return gp;
    }
    return null;
}

export function findGamePanelByIFrame(iframeRef) {
    let gamepanels = getGamePanels();
    for (let i = 0; i < gamepanels.length; i++) {
        let gp = gamepanels[i];
        if (gp?.iframe?.current == iframeRef) return gp;
    }
    return null;
}

export function updateGamePanel(gamepanel) {
    // console.log("Updating gamepanel/" + gamepanel.id);
    let gamepanels = btGamePanels.get();

    if (!gamepanel.gamestate) {
        return;
    }

    let gamestate = gamepanel.gamestate;

    if (
        gamepanel.isPrimary &&
        !gamepanel.closeOverlay &&
        !gamepanel?.room?.isReplay
    ) {
        let status = gamestate?.room?.status;

        if (
            !gamepanel.active ||
            status == "gameover" ||
            status == "gamecancelled" ||
            status == "gameerror"
        ) {
            gamepanel.showGameover = true;
            gamepanel.showPregame = false;
        } else if (status == "pregame" || status == "starting") {
            gamepanel.showGameover = false;
            gamepanel.showPregame = true;
        } else {
            gamepanel.showPregame = false;
        }
    }

    let prefix = "gamepanel/" + gamepanel.id;
    if (gamepanel.isPrimary) {
        btPrimaryState.set(gamestate);
        btPrimaryRoom.set(gamepanel.room);
    }

    gamepanels[gamepanel.id] = gamepanel;
    btGamePanels.set(gamepanels);
}

export function getPrimaryGamePanel() {
    let id = btPrimaryGamePanel.get();
    if (id == null) return null;

    let gamepanel = btGamePanels.get((bucket) => bucket[id]);
    if (!gamepanel) return null;

    return gamepanel;
}
export function setPrimaryGamePanel(gamepanel) {
    let primaryId = btPrimaryGamePanel.get();
    let primary = getGamePanel(primaryId);

    if (primary) {
        primary.isPrimary = false;
        updateGamePanel(primary);
    }

    if (!gamepanel) {
        btPrimaryGamePanel.set(null);
        btChatMode.set("all");
    } else {
        btPrimaryGamePanel.set(gamepanel.id);
        btChatMode.set(gamepanel.room.room_slug);
        btChatUpdated.set(Date.now());

        gamepanel.isPrimary = true;

        let game_slug = gamepanel?.room?.game_slug;
        if (game_slug) {
            let game = btGames.get((bucket) => bucket[game_slug]);
            if (game) {
                updateBrowserTitle(game.name);
            }
        }
        updateGamePanel(gamepanel);

        timerLoop();
    }
}

export function cleanupGamePanel(gamepanel) {
    gamepanel.available = true;
    gamepanel.showGameover = false;
    gamepanel.showPregame = false;
    gamepanel.closeOverlay = false;
    updateGamePanel(gamepanel);
}

export function setRoomForfeited(room_slug) {
    let gamepanel = findGamePanelByRoom(room_slug);
    gamepanel.active = false;
    gamepanel.forfeit = true;

    updateRoomStatus(room_slug);
    updateGamePanel(gamepanel);
}

export function setRoomActive(room_slug, active) {
    let gamepanel = findGamePanelByRoom(room_slug);
    gamepanel.active = active;

    updateRoomStatus(room_slug);
    updateGamePanel(gamepanel);
}

export function cleanupGamePanels() {
    let gamepanels = getGamePanels();
    for (let i = 0; i < gamepanels.length; i++) {
        let gp = gamepanels[i];
        if (
            gp.gamestate?.room?.status == "gameover" ||
            gp.gamestate?.room?.status == "gamecancelled" ||
            gp.gamestate?.room?.status == "gameerror"
        ) {
            gp.available = true;
            updateGamePanel(gp);
            // btGamePanels.set(gamepanels);
            return gp;
        }
    }
}

export function createGamePanel() {
    let gp = {};
    gp.id = -1;
    gp.available = false;
    gp.loaded = false;
    gp.ready = false;
    gp.forfeit = false;
    gp.canvasRef = null;
    gp.gamestate = null;
    gp.gameover = false;
    gp.iframe = null;
    gp.room = null;
    gp.active = true;
    gp.showGameover = false;
    gp.showPregame = false;
    gp.closeOverlay = false;
    return gp;
}

export function reserveGamePanel() {
    let gamepanels = getGamePanels();
    for (let i = 0; i < gamepanels.length; i++) {
        let gp = gamepanels[i];
        if (gp.available) {
            gp.available = false;

            gp.loaded = false;
            gp.forfeit = false;
            gp.ready = false;
            gp.gamestate = null;
            gp.gameover = false;
            gp.room = null;
            gp.active = true;
            gp.showGameover = false;
            gp.showPregame = false;
            gp.closeOverlay = false;
            // updateGamePanel(gp);
            // btGamePanels.set(gamepanels);
            return gp;
        }
    }

    let gp = createGamePanel();
    gp.id = gamepanels.length;
    gamepanels.push(gp);
    console.log("reserverGamePanel updating gamepanel/" + gp.id);
    // btGamePanels.set(gamepanels);
    return gp;
}

export function setIFrameLoaded(room_slug, loaded) {
    let iframes = btIframes.get();
    if (!(room_slug in iframes)) {
        return false;
    }
    iframes[room_slug].loaded = loaded;
    btIframes.assign({ [room_slug]: { element: iframeRef, loaded: false } });
    return true;
}

export function setIFrame(room_slug, iframeRef) {
    let iframes = btIframes.get();
    btIframes.assign({ [room_slug]: { element: iframeRef, loaded: false } });
}

export function getIFrame(room_slug) {
    let iframes = btIframes.get();
    let iframe = iframes[room_slug];
    return iframe;
}

export function getGames() {
    let games = btGames.get() || getWithExpiry("games") || {};
    return games;
}
export function getGame(game_slug) {
    let games = btGames.get() || getWithExpiry("games") || {};
    return games[game_slug];
}

export function getRoom(room_slug) {
    let rooms = btRooms.get() || getWithExpiry("rooms") || {};
    return rooms[room_slug];
}

export function getRooms() {
    let rooms = btRooms.get() || getWithExpiry("rooms") || {};
    return rooms;
}
export function getRoomList() {
    let rooms = getRooms();
    let roomList = [];
    for (var room_slug in rooms) {
        roomList.push(rooms[room_slug]);
    }
    return roomList;
}

export function addRooms(roomList) {
    if (!Array.isArray(roomList)) return;

    let rooms = getRooms();
    let user = btUser.get();

    let foundFirst = false;
    for (var roomInfo of roomList) {
        let { gamestate, room } = roomInfo;

        rooms[room.room_slug] = roomInfo;
        //remove from the rooms object, so we can keep it separate
        // if (r.gamestate)
        //     delete r.gamestate;
        let gamepanel = findGamePanelByRoom(
            room.room_slug || gamestate.room.room_slug
        );
        if (!gamepanel) {
            gamepanel = reserveGamePanel();
            btShowLoadingBox.assign({ [gamepanel.id]: true });
        }

        if (gamestate && gamestate.players) {
            gamestate.local = gamestate.players[user.shortid];
            if (gamestate.local) gamestate.local.shortid = user.shortid;

            for (const shortid in gamestate.players) {
                gamestate.players[shortid].shortid = shortid;
            }
        } else {
            gamestate.local = {
                displayname: user.displayname,
                shortid: user.shortid,
            };
        }

        gamepanel.room = room;
        gamepanel.gamestate = gamestate;

        updateRoomStatus(room.room_slug);
        updateGamePanel(gamepanel);

        if (!foundFirst) {
            foundFirst = true;
            setPrimaryGamePanel(gamepanel);
        }
    }

    btRooms.set(rooms);
    setWithExpiry("rooms", JSON.stringify(rooms), 120);
}

export function addRoom(msg) {
    let gamepanel = findGamePanelByRoom(msg.room_slug || msg.room.room_slug);

    if (gamepanel) {
        return gamepanel;
    }

    let rooms = getRooms();

    //merge with any existing
    // let existing = rooms[msg.room.room_slug] || {};
    // room = Object.assign({}, existing, room);

    //reserve and update gamepanel
    gamepanel = reserveGamePanel();
    gamepanel.room = msg.room;
    if (msg.room.isReplay) {
        gamepanel.gamestate = msg.payload[1].payload;
        gamepanel.room.history = msg.payload;
    } else {
        gamepanel.gamestate = msg.payload;
    }

    btShowLoadingBox.assign({ [gamepanel.id]: true });
    updateGamePanel(gamepanel);

    if (!msg.room.isReplay) {
        //should we make it primary immediately? might need to change this
        setPrimaryGamePanel(gamepanel);
    }

    rooms[msg.room.room_slug] = { room: msg.room, gamestate: msg.payload };
    btRooms.set(rooms);
    setWithExpiry("rooms", JSON.stringify(rooms), 120);

    return gamepanel;
}

export async function maximizeGamePanel(gamepanel) {
    if (gamepanel.isPrimary) return;
    setPrimaryGamePanel(gamepanel);
    updateGamePanel(gamepanel);
}

export async function minimizeGamePanel() {
    let primaryGamePanel = getPrimaryGamePanel();
    if (primaryGamePanel) {
        if (primaryGamePanel.status == "GAMEOVER") {
            btDisplayMode.set("none");
            clearRoom(primaryGamePanel.room.room_slug);
            // clearPrimaryGamePanel();
        }
        // primaryGamePanel.canvasRef = primaryGamePanel.draggableRef;

        setPrimaryGamePanel(null);
        // updateGamePanel(primaryGamePanel);
    }
}

export function clearPrimaryGamePanel() {
    setPrimaryGamePanel(null);
}

export function clearRooms() {
    btRooms.set({});
    removeWithExpiry("rooms");
}

export function clearRoom(room_slug) {
    let gamepanel = findGamePanelByRoom(room_slug);
    cleanupGamePanel(gamepanel);

    if (gamepanel.isPrimary) {
        setPrimaryGamePanel();
    }

    let rooms = btRooms.get();
    if (!rooms[room_slug]) return;
    delete rooms[room_slug];
    btRooms.set(rooms);
    setWithExpiry("rooms", JSON.stringify(rooms), 120);

    clearChatMessages(room_slug);
}

export function getRoomStatus(room_slug) {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel) return "NOTEXIST";

    return btGameStatus.get((bucket) => bucket[gamepanel.id] || "NOTEXIST");
}

export function updateRoomStatus(room_slug) {
    let gamepanel = findGamePanelByRoom(room_slug);
    let status = processsRoomStatus(gamepanel);
    gamepanel.status = status;

    btGameStatus.assign({ [gamepanel.id]: status });
    btGameStatusUpdated.set(Date.now());
    // updateGamePanel(gamepanel);

    //console.log("ROOM STATUS = ", status);
    return status;
}

export function processsRoomStatus(gamepanel) {
    let gamestate = gamepanel.gamestate;

    if (!gamestate || !gamestate.state | !gamestate.players) {
        return "NOTEXIST";
    }

    if (gamestate?.room?.events?.gameover) {
        return "GAMEOVER";
    }
    if (gamestate?.room?.events?.gamecancelled) {
        return "GAMECANCELLED";
    }
    if (gamestate?.room?.events?.gameerror) {
        return "GAMEERROR";
    }
    if (gamestate?.room?.events?.error) {
        return "ERROR";
    }

    if (gamestate?.room?.events?.noshow) {
        return "NOSHOW";
    }

    if (gamepanel.forfeit) {
        return "FORFEIT";
    }

    let gameLoaded = gamepanel.loaded;
    if (!gameLoaded) return "LOADING";

    return "GAME";
}

export function isNextTeam(gamepanel, userid) {
    let gamestate = gamepanel?.gamestate;
    let local = gamestate?.local;

    if (!gamestate) return;

    userid = userid || local?.id;
    // let nextid = next?.id;
    let room = gamestate.room;

    if (room?.status == "pregame") return true;

    let nextid = gamestate?.room?.next_id;
    if (!nextid) return false;

    if (!gamestate.state) return false;

    //check if we ven have teams
    let teams = gamestate?.teams;

    if (typeof nextid === "string") {
        //anyone can send actions
        if (nextid == "*") return true;

        //only specific user can send actions
        // if (nextid == userid)
        //     return false;

        //validate team has players
        if (!teams || !teams[nextid] || !teams[nextid].players) return false;

        //allow players on specified team to send actions
        if (
            Array.isArray(teams[nextid].players) &&
            teams[nextid].players.includes(userid)
        ) {
            return true;
        }
    } else if (Array.isArray(nextid)) {
        //multiple users can send actions if in the array
        // if (nextid.includes(userid))
        //     return false;

        //validate teams exist
        if (!teams) return false;

        //multiple teams can send actions if in the array
        for (var i = 0; i < nextid.length; i++) {
            let teamid = nextid[i];
            let team = teams[teamid];
            let teamplayers = team?.players;
            if (Array.isArray(teamplayers) && teamplayers.includes(userid)) {
                return true;
            }
        }
    }

    return false;
}

export function isUserNext(gamestate, userid) {
    if (!gamestate) return false;

    // userid = userid || user.shortid;
    // let nextid = next?.id;
    let room = gamestate.room;

    if (room?.status != "gamestart") return false;

    let nextid = gamestate?.room?.next_id;
    if (!nextid) return false;

    if (!gamestate.state) return false;

    //check if we ven have teams
    let teams = gamestate?.teams;

    if (typeof nextid === "string") {
        //anyone can send actions
        if (nextid == "*") return true;

        //only specific user can send actions
        if (nextid == userid) return true;

        //validate team has players
        if (!teams || !teams[nextid] || !teams[nextid].players) return false;

        //allow players on specified team to send actions
        if (
            Array.isArray(teams[nextid].players) &&
            teams[nextid].players.includes(userid)
        ) {
            return true;
        }
    } else if (Array.isArray(nextid)) {
        //multiple users can send actions if in the array
        if (nextid.includes(userid)) return true;

        //validate teams exist
        if (!teams) return false;

        //multiple teams can send actions if in the array
        for (var i = 0; i < nextid.length; i++) {
            let teamid = nextid[i];
            let team = teams[teamid];
            let teamplayers = team?.players;
            if (Array.isArray(teamplayers) && teamplayers.includes(userid)) {
                return true;
            }
        }
    }

    return false;
}
