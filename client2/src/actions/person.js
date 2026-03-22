import { GET, POST } from "./http";
// import { findDevGames } from './devgame';
// import history from "./history";
import { getWithExpiry, setWithExpiry, removeWithExpiry } from "./cache";
import { disconnect, wsRejoinQueues, wsJoinQueues } from "./ws";
import { addGameQueue, addJoinQueues, clearGameQueues, getJoinQueues } from "./queue";
import { clearRooms, getLastJoinType, getRoomList, getRooms, setLastJoinType } from "./room";
import { findGame, findGamePerson } from "./game";
import {
    btCheckingUserLogin,
    btDefaultCountry,
    btDisplayName,
    btGame,
    btIsCreateDisplayName,
    btJustCreatedName,
    btLoadingDefaultCountry,
    btLoadingGameInfo,
    btLoadingProfile,
    btLoadingUser,
    btLoggedIn,
    btLoginFrom,
    btPlayerStats,
    btPortraitId,
    btProfile,
    btUser,
    // btUserId,
} from "./buckets";

export async function createDisplayName({ displayname, portraitid, countrycode }) {
    try {
        let response = await POST("/api/v1/person/create/displayname", {
            displayname,
            portraitid,
            countrycode,
        });
        let user = response.data;

        let existing = btUser.get();
        Object.assign(existing, user);

        btUser.set(existing);

        // btUserId.set(existing.id);

        disconnect();

        console.log(existing);
        return existing;
    } catch (e) {
        console.error(e);
        return e.response.data;
    }
}

export async function getCountry() {
    try {
        btLoadingDefaultCountry.set(true);

        let response = await GET("/api/v1/country/");
        let data = response.data;

        if (!data || !data.countrycode) {
            btDefaultCountry.set("US");
            btLoadingDefaultCountry.set(false);
            return "US";
        }

        btDefaultCountry.set(data.countrycode);
        return data.countrycode;
    } catch (e) {
        btDefaultCountry.set("US");
    } finally {
        btLoadingDefaultCountry.set(false);
    }
    return "US";
}

export async function createTempUser({ displayname, portraitid, countrycode }) {
    try {
        let response = await POST("/login/temp", { displayname, portraitid, countrycode });
        let user = response.data;

        console.log("Created Temp User: ", user);

        logoutTimer(user);

        btUser.set(user);
        // btUserId.set(user.id);
        // btProfile.set(user);

        disconnect();

        console.log(user);
        return user;
    } catch (e) {
        console.error(e);
        return e.response.data;
    }
}

export async function logout() {
    try {
        let response = await GET("/logout");
        let result = response.data;

        if (!result.status || result.status != "success") {
            return false;
        }

        setLoginMode();
        btUser.set(null);

        // btUserId.set(0);
        btPlayerStats.set({});
        btDisplayName.set("");
        btIsCreateDisplayName.set(false);
        localStorage.removeItem("displayname");
        removeWithExpiry("user");

        clearRooms();
        clearGameQueues();
        setLastJoinType("");

        await disconnect();

        return true;
    } catch (e) {
        console.error(e);
        return e?.response?.data;
    }
}

export function isUserLoggedIn() {
    let loggedIn = btLoggedIn.get();
    return !(!loggedIn || loggedIn == "LURKER" || loggedIn == "CHECKING");
}

export async function getPlayer(displayname) {
    try {
        btLoadingProfile.set(true);

        let response = await GET("/api/v1/person/" + displayname);
        let player = response.data;

        if (player.ecode) {
            console.error("Player not found: ", displayname);
            btProfile.set(null);
            btLoadingProfile.set(false);
            return null;
        }
        btProfile.set(player);
    } catch (e) {
        btProfile.set(null);
    } finally {
        btLoadingProfile.set(false);
    }
}

export async function loadUserGameData(game_slug) {
    try {
        btLoadingGameInfo.set(true);
        let player_stat = btPlayerStats.get((bucket) => bucket[game_slug]);
        // let player_stat = player_stats[game_slug];

        let curgame = btGame.get();
        let game = null;
        let user = btUser.get();

        // let user = await getUser();

        if (user && user.shortid) {
            await findGamePerson(game_slug);
        } //if (!curgame || !curgame.name) {
        else await findGame(game_slug);

        btLoadingGameInfo.set(false);
    } catch (e) {
        btLoadingGameInfo.set(false);
    }
}

export async function getUser() {
    let user = btUser.get();
    if (!user) {
        btLoadingUser.set(true);
        user = await getUserProfile();
    }

    // reconnect(true, true);

    btLoadingUser.set(false);

    if (!user) {
        return false;
    }

    return user;
}

export async function login() {
    let isLoginShowing = btIsCreateDisplayName.get();
    if (isLoginShowing) return;

    let game = btGame.get();
    if (game && window.location.pathname.indexOf("/g/") > -1) {
        let mode = getLastJoinType();
        addJoinQueues(game.game_slug, mode);
    }

    btLoginFrom.set("game");
    btIsCreateDisplayName.set(true);
    btPortraitId.set(Math.floor(Math.random() * (2104 - 1 + 1) + 1));
}

export async function loginComplete() {
    btIsCreateDisplayName.set(false);
    btJustCreatedName.set(true);

    let joinqueues = getJoinQueues();

    let queues = joinqueues.queues || [];
    let isJoiningQueues = queues.length > 0;

    if (isJoiningQueues) {
        wsJoinQueues(joinqueues.queues, joinqueues.owner);
    }
}


export async function validateLogin() {
    let user = await getUser();

    if (!user && !isUserLoggedIn()) {
        login();

        return false;
    }
    return true;
}

export function setLoginMode(user) {
    let loginMode = "LURKER";

    if (user) {
        if (user.email) {
            loginMode = "USER";
        } else if (user.displayname) loginMode = "TEMP";
    }

    btLoggedIn.set(loginMode);
    return loginMode;
}

export async function getUserProfile() {
    try {
        let user = btUser.get();
        if (!user || !user.displayname) {
            user = getWithExpiry("user");
            if (!user || !user.displayname) {
                btCheckingUserLogin.set(true);
                let response = await GET("/api/v1/person");
                user = response.data;
                console.log("getUserProfile from api", user);
            }
        }
        if (user.ecode) {
            console.error("[ERROR] Login failed. Please login again.", user.ecode);
            removeWithExpiry("user");
            return null;
        }

        //create local user session with expiration

        let previousLoggedIn = btLoggedIn.get();

        logoutTimer(user);

        btUser.set(user);
        // btUserId.set(user.id);
        btProfile.set(user);

        setTimeout(() => {
            let newLoggedIn = setLoginMode(user);

            if (previousLoggedIn != newLoggedIn) {
                // disconnect();
                // reconnect();
            }
        }, 0);

        // if (user.isdev)
        //     await findDevGames(user.id)

        // if (!user.displayname || user.displayname.length == 0) {
        //     let history = btHistory.get()
        //     history('/player/create');
        //     return user;
        // }

        try {
            let roomList = getRoomList(); // localStorage.getItem('rooms') || {};
            // if (roomList.length > 0) {
            // reconnect();
            // }
            wsRejoinQueues();
        } catch (e) {
            console.error(e);
        }

        btCheckingUserLogin.set(false);
        return user;
    } catch (e) {
        setLoginMode();
        btUser.set(null);
        // btUserId.set(0);

        // console.error('[Profile] Login failed. Please login again.');
        btCheckingUserLogin.set(false);
        if (e.response.data.ecode) {
            console.error("[ERROR] Login failed. Please login again.", e.response.data.ecode);
            return null;
        }

        console.error(e);

        //if( e )
        //return e.response.data;
    }
    return null;
}

function logoutTimer(user) {
    let exp = user.exp;
    let now = Math.round(new Date().getTime() / 1000);
    let diff = exp - now;
    console.log("User expires in " + diff + " seconds.");
    setWithExpiry("user", user, diff);
    setLoginMode(user);

    let fiveMinuteWarningDelay = (diff - 300) * 1000;
    let expireDelay = diff * 1000;

    //max delay for setTimeout is 24.8 days
    expireDelay = Math.min(2147483647, expireDelay);
    setTimeout(() => {}, fiveMinuteWarningDelay);

    console.log("Expire delay: ", expireDelay);
    setTimeout(() => {
        logout();
    }, expireDelay);
}

export async function requestCreateRoom() {}
