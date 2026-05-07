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
import { GameStateReader, GameStatus, gs } from "@acosgames/framework";
import { useBucketSelector } from "./bucket";
import type { GameStateLocal } from "./replay";

export function setCurrentRoom(room_slug: string | null) {
    btRoomSlug.set(room_slug);
}

export function getCurrentRoom() {
    return btRoomSlug.get() || null;
}

export function setLastJoinType(type: string | null) {
    btLastJoin.set(type);
}

export function getLastJoinType() {
    return btLastJoin.get();
}

export function getGamePanel(id: string) {
    return btGamePanels.get((bucket: any) => bucket[id]);
}

export function getGamePanels() {
    return btGamePanels.get() || [];
}

export function findGamePanelByRoom(room_slug: string | null) {
    let gamepanels = getGamePanels();
    for (let i = 0; i < gamepanels.length; i++) {
        let gp = gamepanels[i];
        if (gp.room.room_slug == room_slug) return gp;
    }
    return null;
}

export function findGamePanelByIFrame(iframeRef: any) {
    let gamepanels = getGamePanels();
    for (let i = 0; i < gamepanels.length; i++) {
        let gp = gamepanels[i];
        if (gp?.iframe?.current == iframeRef) return gp;
    }
    return null;
}

export function updateGamePanel(gamepanel: any) {
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
            status == GameStatus.gameover ||
            status == GameStatus.gamecancelled ||
            status == GameStatus.gameerror
        ) {
            gamepanel.showGameover = true;
            gamepanel.showPregame = false;
        } else if (status == GameStatus.pregame || status == GameStatus.starting) {
            gamepanel.showGameover = false;
            gamepanel.showPregame = true;
        } else {
            gamepanel.showPregame = false;
        }
    }

    if (gamestate?.room?.events) {
        for (const event of gamestate?.room?.events) {
            if (event.type == 'join') {
                let playerid = event.payload;
                let player = gamestate.players?.[playerid];
                player.id = playerid;
                player.portrait = `https://assets.acos.games/images/portraits/assorted-${player.portraitid || 1}-medium.webp`;
            }
        }
    }

    // let prefix = "gamepanel/" + gamepanel.id;
    if (gamepanel.isPrimary) {
        btPrimaryState.set(gamestate);
        btPrimaryRoom.set(gamepanel.room);
    }

    gamepanel.updated = Date.now();
    gamepanels[gamepanel.id] = gamepanel;
    btGamePanels.set(gamepanels);
}

export function useGamePanel(room_slug: string | null, selector?: (gamepanel: any) => any) {
    return useBucketSelector(btGamePanels, (panels) => {
        if (!room_slug) return null;
        const panel = (panels || []).find((p: any) => p?.room?.room_slug === room_slug);
        if (!panel) return null;
        return selector ? selector(panel) : panel ?? null;
    });
}

export function useGamePanelUpdated(room_slug: string | null) {
    return useGamePanel(room_slug, (panel) => panel?.updated ?? 0);
}

export function useGame(room_slugOrGamePanelId: string | number | null, selector: (gamestate: GameStateLocal) => any) {
    return useBucketSelector(btGamePanels, (panels) => {
        if (room_slugOrGamePanelId == null) return null;
        let panel: any;
        if (typeof room_slugOrGamePanelId === "string") {
            panel = (panels || []).find((p: any) => p?.room?.room_slug === room_slugOrGamePanelId);
        } else {
            panel = panels?.[room_slugOrGamePanelId as number];
        }
        if (!panel) return null;
        return selector ? selector(panel?.gamestate) : panel?.gamestate ?? null;
    });
}

export function useGameStatus(room_slug: string | null): GameStatus {
    return useGame(room_slug, (gamestate) => gamestate?.room?.status ?? null);
}

export function useRoomStatus(room_slug: string | null):RoomStatus {
    return useGamePanel(room_slug, (panel) => {
        if (!panel) return RoomStatus.NOTEXIST;
        return panel?.room?.status ?? RoomStatus.NOTEXIST;
    });
}

export function useGamePlayer(room_slugOrGamePanelId: string | number | null, playerId: number, selector?: (player: any) => any) {
    return useGame(room_slugOrGamePanelId, (gamestate) => {
        const player = gamestate?.players?.[playerId];
        return selector ? selector(player) : player;
    });
}

export function useGameTeam(room_slugOrGamePanelId: string | number | null, teamId: number, selector?: (team: any) => any) {
    return useGame(room_slugOrGamePanelId, (gamestate) => {
        const team = gamestate?.teams?.[teamId];
        return selector ? selector(team) : team;
    });
}

export function validateNextUser(userid: number, game: GameStateReader): boolean {
        
        let next = game.nextPlayer;
        if (Array.isArray(next) && next.includes(userid)) return true;
        let player = game.player(userid);
        if (!player) return false;
        if (next === userid) return true;
        if (validateNextTeam(game, player.teamid)) return true;
        return false;
    }

   export function validateNextTeam(game: GameStateReader, teamid: number): boolean {
        
        let next = game.nextTeam;
        if (Array.isArray(next) && next.includes(teamid)) return true;
        let player = game.player(teamid);
        if (!player) return false;
        if (next === teamid) return true;
        return false;
    }

export function getPrimaryGamePanel() {
    let id = btPrimaryGamePanel.get();
    if (id == null) return null;

    let gamepanel = btGamePanels.get((bucket) => bucket[id]);
    if (!gamepanel) return null;

    return gamepanel;
}
export function setPrimaryGamePanel(gamepanel: any) {
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
            let game = btGames.get((bucket: any) => bucket[game_slug]);
            if (game) {
                updateBrowserTitle(game.name);
            }
        }
        updateGamePanel(gamepanel);

        timerLoop();
    }
}

export function cleanupGamePanel(gamepanel: any) {
    gamepanel.available = true;
    gamepanel.showGameover = false;
    gamepanel.showPregame = false;
    gamepanel.closeOverlay = false;
    updateGamePanel(gamepanel);
}

export function setRoomForfeited(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    gamepanel.active = false;
    gamepanel.forfeit = true;

    updateRoomStatus(room_slug);
    updateGamePanel(gamepanel);
}

export function setRoomActive(room_slug: string, active: boolean) {
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
            gp.gamestate?.room?.status == GameStatus.gameover ||
            gp.gamestate?.room?.status == GameStatus.gamecancelled ||
            gp.gamestate?.room?.status == GameStatus.gameerror
        ) {
            gp.available = true;
            updateGamePanel(gp);
            // btGamePanels.set(gamepanels);
            return gp;
        }
    }
}

export interface IGamePanel {
    id: number;
    available: boolean;
    loaded: boolean;
    ready: boolean;
    forfeit: boolean;
    canvasRef: HTMLElement | null;
    gamestate: any;
    gameover: boolean;
    iframe: HTMLIFrameElement | null;
    room: RoomInfo & GameInfo | null;
    active: boolean;
    showGameover: boolean;
    showPregame: boolean;
    closeOverlay: boolean;
}

export function createGamePanel(): IGamePanel {
    let gp: IGamePanel = {
        id: -1,
        available: false,
        loaded: false,
        ready: false,
        forfeit: false,
        canvasRef: null,
        gamestate: null,
        gameover: false,
        iframe: null,
        room: null,
        active: true,
        showGameover: false,
        showPregame: false,
        closeOverlay: false,
    };
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

export function setIFrameLoaded(room_slug: string, loaded: boolean, iframeRef: any) {
    let iframes = btIframes.get();
    if (!(room_slug in iframes)) {
        return false;
    }
    iframes[room_slug].loaded = loaded;
    btIframes.assign({ [room_slug]: { element: iframeRef, loaded: false } });
    return true;
}

export function setIFrame(room_slug: string, iframeRef: any) {
    // let iframes = btIframes.get();
    btIframes.assign({ [room_slug]: { element: iframeRef, loaded: false } });
}

export function getIFrame(room_slug: string) {
    let iframes = btIframes.get();
    let iframe = iframes[room_slug];
    return iframe;
}

export function getGames() {
    let games = btGames.get() || getWithExpiry("games") || {};
    return games;
}
export function getGame(game_slug: string) {
    let games = btGames.get() || getWithExpiry("games") || {};
    return games[game_slug];
}

export function getRoom(room_slug: string) {
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

export function addRooms(roomList: any[]) {
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

            for (const player of gamestate.players) {
                player.id = player.id;
                player.portrait = `https://assets.acos.games/images/portraits/assorted-${player.portraitid || 1}-medium.webp`;
            }

            
            gamestate.local = gamestate.players.find((player: any) => player.shortid === user.shortid);
            // if (gamestate.local) gamestate.local.shortid = user.shortid;

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

export function addRoom(msg: any) {

    let history = msg.payload.gamestate;
    let room = msg.payload.room;

    let gamepanel = findGamePanelByRoom(room?.room_slug);

    if (gamepanel) {
        return gamepanel;
    }

    let rooms = getRooms();

    //merge with any existing
    // let existing = rooms[msg.room.room_slug] || {};
    // room = Object.assign({}, existing, room);

    //reserve and update gamepanel
    gamepanel = reserveGamePanel();
    gamepanel.room = room;
    if (room?.isReplay) {
        gamepanel.gamestate = history[1]?.payload;
        gamepanel.room.history = history;
    } else {
        gamepanel.gamestate = history;
    }

    btShowLoadingBox.assign({ [gamepanel.id]: true });
    updateGamePanel(gamepanel);

    if (!room?.isReplay) {
        //should we make it primary immediately? might need to change this
        setPrimaryGamePanel(gamepanel);
    }

    rooms[room?.room_slug] = { room: room, gamestate: history };
    btRooms.set(rooms);
    setWithExpiry("rooms", JSON.stringify(rooms), 120);

    return gamepanel;
}

export async function maximizeGamePanel(gamepanel: any) {
    if (gamepanel.isPrimary) return;
    setPrimaryGamePanel(gamepanel);
    updateGamePanel(gamepanel);
}

export async function minimizeGamePanel() {
    let primaryGamePanel = getPrimaryGamePanel();
    if (primaryGamePanel) {
        if (primaryGamePanel.status == "GAMEOVER") {
            btDisplayMode.set("normal");
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

export function clearRoom(room_slug: string) {
    let gamepanel = findGamePanelByRoom(room_slug);
    cleanupGamePanel(gamepanel);

    if (gamepanel.isPrimary) {
        setPrimaryGamePanel(null);
    }

    let rooms = btRooms.get();
    if (!rooms[room_slug]) return;
    delete rooms[room_slug];
    btRooms.set(rooms);
    setWithExpiry("rooms", JSON.stringify(rooms), 120);

    clearChatMessages(room_slug);
}

export function getRoomStatus(room_slug: string): RoomStatus {
    let gamepanel = findGamePanelByRoom(room_slug);
    if (!gamepanel) return RoomStatus.NOTEXIST;

    return btGameStatus.get((bucket: any) => bucket[gamepanel.id] || RoomStatus.NOTEXIST);
}

export function updateRoomStatus(room_slug: string | null): RoomStatus {
    if (!room_slug) return RoomStatus.NOTEXIST;
    let gamepanel = findGamePanelByRoom(room_slug);
    let status = processsRoomStatus(gamepanel);
    gamepanel.status = status;

    btGameStatus.assign({ [gamepanel.id]: status });
    btGameStatusUpdated.set(Date.now());
    // updateGamePanel(gamepanel);

    //console.log("ROOM STATUS = ", status);
    return status;
}

const RoomStatus = {
    NOTEXIST: 1, 
    LOADING: 2,
    PREGAME: 3,
    GAME: 4,
    GAMEOVER: 5,
    GAMECANCELLED: 6,
    GAMEERROR: 7,
    NOSHOW: 8,
    FORFEIT: 9,
    ERROR: 10
} as const;

type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export { RoomStatus };

export function processsRoomStatus(gamepanel: any): RoomStatus {
    let gamestate = gs(gamepanel.gamestate);

    if (!gamepanel.gamestate || !gamepanel.gamestate.state || !gamepanel.gamestate.players) {
        return RoomStatus.NOTEXIST;
    }

    let eventMap = gamestate.eventsMap();
    if (eventMap.gameover) {
        return RoomStatus.GAMEOVER;
    }
    if (gamestate.status == GameStatus.gamecancelled || eventMap.gamecancelled) {
        return RoomStatus.GAMECANCELLED;
    }
    if (gamestate.status == GameStatus.gameerror || eventMap.gameerror) {
        return RoomStatus.GAMEERROR;
    }
    if (eventMap.error) {
        return RoomStatus.ERROR;
    }

    if (eventMap.noshow) {
        return RoomStatus.NOSHOW;
    }

    if (gamepanel.forfeit) {
        return RoomStatus.FORFEIT;
    }

    let gameLoaded = gamepanel.loaded;
    if (!gameLoaded) return RoomStatus.LOADING;

    return RoomStatus.GAME;
}

export function isNextTeam(gamepanel: any, userid: string) {
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

export function isUserNext(gamestate: any, userid: string) {
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
