import { POST, GET, POSTFORM } from "./http";

import config from "../config";
import { getUser } from "./person";
import { wsJoinRankedGame, wsJoinBetaGame } from "./ws";
import { addRoom } from "./room";
import ACOSEncoder from "acos-json-encoder/encoder";
import ACOSDictionary from 'shared/model/acos-dictionary.json';
ACOSEncoder.createDefaultDict(ACOSDictionary);

import delta from "acos-json-delta";
import { getWithExpiry, setWithExpiry } from "./cache";
import {
    btAchievementAward,
    btClaimingAchievement,
    btDivision,
    btGame,
    btGameFound,
    btGameLists,
    btGameSlug,
    btGames,
    btJSGame,
    btLeaderboard,
    btLeaderboardHighscore,
    btLeaderboardHighscoreChange,
    btLeaderboardHighscoreCount,
    btLoading,
    btLoadingHightscores,
    btLocalPlayerHighscores,
    btNationalRankings,
    btPlayerStats,
    btRankings,
    btReplay,
    btReplays,
    btUser,
} from "./buckets";

export async function sortGames(games) {
    let rankList = [];
    let experimentalList = [];
    let soloList = [];

    for (var game_slug in games) {
        let game = games[game_slug];
        if (game.version > 0) {
            if (game.maxplayers == 1) soloList.push(game);
            else rankList.push(game);
        }
        if (!game.version) {
            experimentalList.push(game);
        }
    }

    btGameLists.set({ rankList, experimentalList, soloList });
}

export async function findGames() {
    try {
        let response = await GET("/api/v1/games");
        let result = response.data;
        if (result.ecode) {
            throw result.ecode;
        }

        let games = btGames.get();
        for (var game of result) {
            games[game.game_slug] = game;
        }

        sortGames(games);

        btGames.set(games);
    } catch (e) {
        console.error(e);
        btGames.set({});
    }
}

export async function findGame(game_slug) {
    try {
        let response = await GET("/api/v1/game/" + game_slug);
        let game = response.data;
        if (game.ecode) {
            throw game.ecode;
        }

        btGames.assign({ [game_slug]: game });
        btGame.set(game);
        // btGameFound.set(true);

        return game;
    } catch (e) {
        console.error(e);
        btGame.set(null);
        throw "E_GAMENOTFOUND";
    }
}



export async function findGamePerson(game_slug) {
    try {
        let response = await GET("/api/v1/game/person/" + game_slug);
        let result = response.data;
        if (result.ecode) {
            if (result.ecode == "E_NOTAUTHORIZED" || result.ecode == "E_NOTFOUND") {
                return await findGame(game_slug);
            }
            throw result.ecode;
        }

        if (!result.game) {
            throw "E_GAMENOTFOUND";
        }

        let player_stats = btPlayerStats.get((bucket) => bucket[game_slug]) || {};
        if (result.player) {
            player_stats = result.player;
            btPlayerStats.assign({ [game_slug]: player_stats });
        }

        btGame.set(result.game);
        btGames.assign({ [game_slug]: result.game });

        // btGameFound.set(true);
    } catch (e) {
        console.error(e);
    }
}

export async function findAndRejoin(game_slug, room_slug) {
    let player_stat = btPlayerStats.get((bucket) => bucket[game_slug]);
    // let player_stat = player_stats[game_slug];
    let user = await getUser();
    if (user && user.shortid && !player_stat) {
        await findGamePerson(game_slug);
    } else {
        await findGame(game_slug);
    }

    wsRejoinRoom(game_slug, room_slug);
}

let hJoining = 0;

export async function joinGame(game, istest) {
    let game_slug = game.game_slug;
    // let version = game.version;
    // if (istest) {
    //     version = game.latest_version;
    // }
    // await downloadGame(game.gameid, version);

    // clearTimeout(hJoining);

    try {
        if (istest) {
            wsJoinBetaGame(game);
        } else {
            wsJoinRankedGame(game);
        }
    } catch (e) {
        console.error(e);
    }

    // hJoining = setTimeout(() => { joinGame(game_slug) }, 3000);
}

export async function downloadGame(gameid, version) {
    // let url = `${config.https.cdn}${gameid}/client/client.bundle.${version}.js`

    return new Promise(async (rs, rj) => {
        try {
            // let res = await fetch(url, { headers: { 'Content-Type': 'application/javascript' } })
            // let blob = await res.text();
            //let file = window.URL.createObjectURL(blob);
            btJSGame.set(true);
            rs(true);
        } catch (e) {
            console.error(e);
            rj(e);
        }
    });
}


export async function reportGame(game_slug, reportType) {
    let request = await POST("/api/v1/game/report", {
        game_slug,
        reportType,
    });
    let response = request.data;

    return response;
}

export async function rateGame(game_slug, vote, previousVote) {
    let request = await POST("/api/v1/game/rate", {
        game_slug,
        vote,
        previousVote,
    });
    let response = request.data;

    return response;
}
