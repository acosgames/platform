import { POST, GET } from "./http";

// import { getUser } from "./person";
import { wsJoinRankedGame, wsJoinBetaGame } from "./ws";
import {createDefaultDict} from "acos-json-encoder";
import ACOSDictionary from 'shared/model/acos-dictionary.json';
createDefaultDict(ACOSDictionary);

import {
    btGame,
    btGameLists,
    btGames,
    btLoading,
    // btJSGame,
    btPlayerStats,
} from "./buckets";
import { LOADED, LOADING } from "./loading";

export async function sortGames(games: Record<string, any>) {
    let rankList: any[] = [];
    let experimentalList: any[] = [];
    let soloList: any[] = [];

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
        LOADING('games');
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
        LOADED('games');
    } catch (e) {
        console.error(e);
        btGames.set({});
        LOADED('games');
    }
}

export async function findGame(game_slug:string) {
    try {
        LOADING('game/' + game_slug);
        let response = await GET("/api/v1/game/" + game_slug);
        let game = response.data;
        if (game.ecode) {
            throw game.ecode;
        }

        btGames.assign({ [game_slug]: game });
        btGame.set(game);
        // btGameFound.set(true);
        LOADED('game/' + game_slug);
        return game;
    } catch (e) {
        console.error(e);
        btGame.set({});
        LOADED('game/' + game_slug);
        throw "E_GAMENOTFOUND";
    }
}



export async function findGamePerson(game_slug: string) {
    try {
        LOADING('game/' + game_slug);
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

        let player_stats = btPlayerStats.get((bucket:any) => bucket[game_slug]) || {} as Record<string, any>;
        if (result.player) {
            player_stats = result.player;
            btPlayerStats.assign({ [game_slug]: player_stats });
        }

        btGame.set(result.game);
        btGames.assign({ [game_slug]: result.game });
        LOADED('game/' + game_slug);
        // btGameFound.set(true);
    } catch (e) {
        console.error(e);
    } finally {
        LOADED('game/' + game_slug);
    }
}

// export async function findAndRejoin(game_slug: string, room_slug: string) {
//     let player_stat = btPlayerStats.get((bucket) => bucket[game_slug]);
//     // let player_stat = player_stats[game_slug];
//     let user = await getUser();
//     if (user && user.shortid && !player_stat) {
//         await findGamePerson(game_slug);
//     } else {
//         await findGame(game_slug);
//     }

//     wsRejoinRoom(game_slug, room_slug);
// }

// let hJoining = 0;

export async function joinGame(game: any, istest: boolean) {
    // let game_slug = game.game_slug;
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

// export async function downloadGame(gameid: string, version: string) {
//     // let url = `${config.https.cdn}${gameid}/client/client.bundle.${version}.js`

//     return new Promise(async (rs, rj) => {
//         try {
//             // let res = await fetch(url, { headers: { 'Content-Type': 'application/javascript' } })
//             // let blob = await res.text();
//             //let file = window.URL.createObjectURL(blob);
//             btJSGame.set(true);
//             rs(true);
//         } catch (e) {
//             console.error(e);
//             rj(e);
//         }
//     });
// }


export async function reportGame(game_slug: string, reportType: string) {
    let request = await POST("/api/v1/game/report", {
        game_slug,
        reportType,
    });
    let response = request.data;

    return response;
}

export async function rateGame(game_slug: string, vote: number, previousVote: number) {
    let request = await POST("/api/v1/game/rate", {
        game_slug,
        vote,
        previousVote,
    });
    let response = request.data;

    return response;
}
