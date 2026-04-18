import { POST, GET } from "./http";

// import * as validation from "../../../shared/util/validation.mjs";
// import { genShortId } from 'shared/util/idgen.js';
import { getWithExpiry, setWithExpiry } from "./cache";

import config from "../config";
import {
    btAchievementForm,
    btAchievementFormErrors,
    // btAchievementIconId,
    btDevClient,
    btDevClientBundles,
    btDevClientImagesById,
    btDevClients,
    btDevClientsEnv,
    btDevClientsError,
    btDevGame,
    btDevGameError,
    btDevGameImages,
    btDevGameTeams,
    btDevGames,
    btFormFields,
    btGameTemplates,
    btLoadedDevGame,
    btLoadingGames,
} from "./buckets";
import {
    validate,
    validateField,
    validateSimple,
} from '../../../shared/util/validation';

// let validateSimple = () => [];

// fs.set('devgameimages', []);
// fs.set('devgame', {});
// fs.set('devgames', []);
// btDevGameError.set([]);

// fs.set('devClientsImages', []);
// fs.set('devClients', []);
// fs.set('devClientsError', []);

// fs.set('devServerImages', []);
// fs.set('devServers', []);
// fs.set('devServerError', []);

function imagesToMap(images: any[]) {
    let obj: { [key: string]: any } = {};
    images.forEach((v, i) => {
        v.file.index = i;
        obj[v.file.name] = v;
    });
    return obj;
}

// function sleep(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

export async function addImages(nextImages: any[], uploadFunc: Function) {
    // let game = btDevGame.get();
    let curImages = btDevGameImages.get();
    if (!curImages) return;

    let curMap = imagesToMap(curImages);
    let nextMap = imagesToMap(nextImages);

    let added = [];
    let deleted = [];
    for (var key in curMap) {
        if (!(key in nextMap)) {
            deleted.push(curMap[key]);
        }
    }

    for (var key in nextMap) {
        if (!(key in curMap)) {
            let image = nextMap[key];

            added.push(image);
        }
    }

    if (added.length > 0) {
        if (uploadFunc) {
            uploadFunc(added, nextImages);
        }
    }

    btDevGameImages.set(nextImages);
}

export async function findClients(gameid: string) {
    try {
        let response = await GET("/api/v1/dev/find/clients/" + gameid);
        let clients = response.data;

        for (var i = 0; i < clients.length; i++) {
            let client = clients[i];
            if (client.preview_images) {
                let images: any[] = [];
                let list = client.preview_images.split(",");
                for (var i = 0; i < list.length; i++) {
                    let url =
                        config.https.cdn +
                        client.gameid +
                        "/clients/preview/" +
                        list[i];
                    images.push({ data_url: url, file: {} });
                }
                let clientImages = btDevClientImagesById.get();
                clientImages[client.id] = images;
                btDevGameImages.set(clientImages);
            }
        }

        btDevClientsError.set([]);
        btDevClients.set(clients);
        console.log(clients);
        return clients;
    } catch (e: any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevClientsError.set([data]);
        }
    }
    return null;
}

// function rowsToMap(list: any[]) {
//     let map: { [key: string]: any } = {};
//     for (var i = 0; i < list.length; i++) {
//         let obj = list[i];
//         map[obj.id] = obj;
//     }
//     return map;
// }

export async function findDevGames(userid: string) {
    try {
        btLoadingGames.set(true);
        let games = getWithExpiry("devgames");
        if (!games || games.length == 0) {
            let response = await GET("/api/v1/dev/games/" + userid);
            games = response.data;

            setWithExpiry("devgames", games, 60);
        }

        btLoadingGames.set(false);
        btDevGames.set(games);

        return games;
    } catch (e:any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevGameError.set([data]);
        }
    }
    return null;
}

export async function findGameTemplates() {
    try {
        let games = getWithExpiry("devgames");
        if (!games) {
            let response = await GET("/api/v1/dev/gametemplates");
            games = response.data;

            setWithExpiry("gametemplates", games, 60);
        }

        btGameTemplates.set(games);

        return games;
    } catch (e: any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevGameError.set([data]);
        }
    }
    return null;
}

export async function findGame(game_slug: string) {
    try {
        let response = await GET("/api/v1/dev/find/game/" + game_slug);
        let game = response.data;

        if (game.preview_images) {
            let images: any[] = [];
            let list = game.preview_images.split(",");
            for (var i = 0; i < list.length; i++) {
                let url =
                    config.https.cdn +
                    "g/" +
                    game.game_slug +
                    "/preview/" +
                    list[i];
                images.push({ data_url: url, file: {} });
            }
            btDevGameImages.set(images);
        }

        game.deployCommand = `npm run deploy -- ${game?.game_slug}.${
            game?.apikey
        }${location.hostname === "localhost" ? " --local" : ""}`;
        btDevGameError.set([]);
        console.log(game);
        btDevGame.set(game);

        btLoadedDevGame.set(Date.now());
        if (game.teams) {
            btDevGameTeams.set(game.teams);
        }

        return game;
    } catch (e:any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevGameError.set([data]);
        }
    }
    return null;
}

function updateClient(client: any) {
    let game = btDevGame.get();
    let clients = game.clients;
    if (!clients) return;

    btDevClientsEnv.assign({ [client.env]: client });

    var storageURL = config.https.cdn;
    var storagePath = client.gameid + "/client/" + client.id + "/";
    if (client.preview_images) {
        let images = [];
        let list = client.preview_images.split(",");
        for (var j = 0; j < list.length; j++) {
            let url = storageURL + storagePath + list[j];
            images.push({ data_url: url, file: {} });
        }
        let clientImages = btDevClientImagesById.get();
        clientImages[client.id] = images;
        btDevClientImagesById.set(clientImages);

        let bundleURL = storageURL + storagePath + client.build_client;
        btDevClientBundles.assign({ [client.id]: bundleURL });
    }
}

export async function uploadClientBundle(client: any, file: any) {
    let progress = {
        onUploadProgress: (progressEvent: any) => {
            console.log(progressEvent.loaded);
        },
    };

    var formData = new FormData();
    formData.append("clientid", client.id);
    formData.append("gameid", client.gameid);
    //images.forEach(image => {
    formData.append("bundle", file);
    //})

    let response = await POST(
        "/api/v1/dev/update/client/bundle/" + client.id,
        formData,
        progress
    );
    let updatedClient = response.data;

    updateClient(updatedClient);

    console.log(updatedClient);

    return updatedClient;
}

export async function uploadClientImages(images: any[], nextImages: any[]) {
    var client = btDevClient.get();
    var preview_images = null;
    for (var i = 0; i < images.length; i++) {
        let image = images[i];

        let response = await uploadClientImage(client, image);
        preview_images = response.images;
        console.log(preview_images);
    }

    if (preview_images) {
        for (var i = 0; i < preview_images.length; i++) {
            if (nextImages[i]) {
                let url =
                    config.https.cdn +
                    client.gameid +
                    "/client/" +
                    client.id +
                    "/" +
                    preview_images[i];
                nextImages[i].data_url = url;
            }
        }
    }
}

export async function uploadClientImage(client: any, image: any) {
    try {
        let progress = {
            onUploadProgress: (progressEvent: any) => {
                console.log(progressEvent.loaded);
            },
        };

        var formData = new FormData();
        formData.append("clientid", client.id);
        formData.append("gameid", client.gameid);
        //images.forEach(image => {
        formData.append("images", image.file);
        //})

        let response = await POST(
            "/api/v1/dev/update/client/images/" + client.id,
            formData,
            progress
        );
        let newClient = response.data;
        updateClient(newClient);
        console.log(newClient);

        return newClient;
    } catch (e:any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevGameError.set([data]);
        }
        throw e;
    }
}

export async function uploadGameImages(images: any[], nextImages: any[]) {
    var game = btDevGame.get();
    var preview_images = null;
    for (var i = 0; i < images.length; i++) {
        let image = images[i];

        let response = await uploadGameImage(game.game_slug, image);
        preview_images = response.images;
        console.log(preview_images);
    }

    if (preview_images) {
        for (var i = 0; i < preview_images.length; i++) {
            if (nextImages[i]) {
                let url =
                    config.https.cdn +
                    "g/" +
                    game.game_slug +
                    "/preview/" +
                    preview_images[i];
                nextImages[i].data_url = url;
            }
        }
    }
}

export async function uploadGameImage(game_slug: any, image: any) {
    try {
        let progress = {
            onUploadProgress: (progressEvent: any) => {
                console.log(progressEvent.loaded);
            },
        };

        var formData = new FormData();
        formData.append("game_slug", game_slug);

        //images.forEach(image => {
        formData.append("images", image.file);
        //})

        let response = await POST(
            "/api/v1/dev/update/game/images/" + game_slug,
            formData,
            progress
        );
        let game = response.data;
        console.log(game);

        return game;
    } catch (e:any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevGameError.set([data]);
        }
        throw e;
    }
}

export async function deleteGame() {
    let deleteGame = btDevGame.get();

    let response = await POST("/api/v1/dev/delete/game", deleteGame);
    let result = response.data;

    //let imageResponse = await uploadImages();
    //let gameWithImages = response.data;

    //console.log(gameWithImages);
    btDevGameError.set([]);
    btDevGame.set({});
    console.log(result);
    return deleteGame;
}

export async function updateGameAPIKey() {
    try {
        let newGame = btDevGame.get();
        let response = await POST("/api/v1/dev/update/gameapikey", {
            game_slug: newGame.game_slug,
        });
        let game = response.data;

        newGame.apikey = game.apikey;
        newGame.deployCommand = `npm run deploy -- ${newGame?.game_slug}.${
            newGame?.apikey
        }${location.hostname === "localhost" ? " --local" : ""}`;
        btDevGame.set(newGame);
    } catch (e:any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevGameError.set([data]);
        }
    }
    return null;
}

export async function createOrEditAchievement() {
    try {
        let achievement = btAchievementForm.get();
        let devgame = btDevGame.get();

        let results = validate("manage-achievement", achievement);
        if (results.length > 0) {
            let errorMap: { [key: string]: any } = {};
            results.map((result:any) => (errorMap[result.key] = result.errors));
            btAchievementFormErrors.set(errorMap);
            return null;
        }

        let game = {
            game_slug: devgame.game_slug,
        };

        // let achievement_icon = btAchievementIconId.get();

        // achievement.achievement_icon = achievement_icon;

        let response = await POST("/api/v1/dev/createoredit/achievement", {
            game,
            achievement,
        });
        let updatedGame = response.data;

        //let imageResponse = await uploadImages();
        //let gameWithImages = response.data;

        //console.log(gameWithImages);

        btAchievementFormErrors.set([]);
        btDevGame.set(updatedGame);
        console.log(updatedGame);
        return updatedGame;
    } catch (e:any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btAchievementFormErrors.set([data]);
        }
    }
    return null;
}

export async function updateGame() {
    try {
        let form = btFormFields.get((form:any) => form["update-game_info"]);
        let newGame = form; //btDevGame.get();

        //validated seperately
        let teams = newGame.teams;
        if (newGame.teams) {
            delete newGame.teams;
        }

        let errors = validateSimple("update-game_info", newGame);
        if (errors.length > 0) {
            btDevGameError.set(errors);
            return null;
        }

        if (teams) {
            if (teams.length > newGame.maxteams) {
                let filteredTeams = [];
                for (let i = 0; i < newGame.maxteams; i++) {
                    filteredTeams.push(teams[i]);
                }

                teams = filteredTeams;
            }

            for (let team of teams) {
                let errors2 = validateSimple("update-game_team", team);
                if (errors2.length > 0) {
                    btDevGameError.set(errors2);
                    return null;
                }
            }

            newGame.teams = teams;
        }

        let response = await POST("/api/v1/dev/update/game", newGame);
        let game = response.data;

        //let imageResponse = await uploadImages();
        //let gameWithImages = response.data;

        //console.log(gameWithImages);

        btDevGameError.set([]);
        console.log(game);
        return game;
    } catch (e:any) {
        console.error(e);

        if (e.response) {
            const { response } = e;
            const data = response.data;
            btDevGameError.set([data]);
        }
    }
    return null;
}

// const fieldSelector = (group: string, key: string) => (form: any) => {
//     // let parts = key.split('>');
//     // let current = form;
//     // for (let i = 0; i < parts.length; i++) {
//     //     current = current[parts[i]];
//     //     if (!current) return false;
//     // }
//     // return current;
//     // return form[group][key];
// };

export async function updateGameField(name: string, value: any, group: string) {
    //   let prevValue = btFormFields.get(fieldSelector(key));
    // if (typeof prevValue === 'undefined')
    //     return null;

    // errorkey = errorkey || 'devgameerror'
    // let prev = game[name];
    // game[name] = value;

    //   let fields = {};

    //   let parts = key.split(">");
    //   if (parts.length > 1) {
    //     // let fieldkey = key.replace('>' + parts[parts.length - 1], '');
    //     fields = btFormFields.get(fieldSelector(fieldKey));
    //   }
    let form = btFormFields.get();
    let formGroup = form[group];
    if (!formGroup) {
        form[group] = {};
    }
    form[group][name] = value;
    btFormFields.set(form);

    let errors = validateField(group, name, value, form[group]);
    if (errors.length > 0) {
        btDevGameError.set(errors);
        // fs.set(errorkey, errors);
        // game[name] = prev;

        // fs.set(key, value);
        //return value;
    }

    //   fs.set(key, value);

    // console.log(game);
}
// export async function updateGameField(name, value, group, key, errorkey) {
//     let game = btDevGame.get();

//     let prev = game[name];
//     game[name] = value;

//     let errors = validateField('update-game_info', game);
//     if (errors.length > 0) {
//         fs.set('devgameerror', errors);
//         game[name] = prev;
//         fs.set('devgame', game);
//         return game;
//     }

//     fs.set('devgame', game);

//     console.log(game);
// }

// export async function updateClientField(name: string, value: any) {
//     let client = fs.get("devclient");

//     let errors = validation.validateSimple("game_client", client);
//     if (errors.length > 0) {
//         fs.set("devclienterror", errors);
//         return client;
//     }

//     client[name] = value;

//     fs.set("devclient", client);

//     console.log(client);
// }

// export async function updateServerField(name: string, value: any) {
//     let server = fs.get("devserver");

//     let errors = validation.validateSimple("game_server", server);
//     if (errors.length > 0) {
//         fs.set("devservererror", errors);
//         return server;
//     }

//     server[name] = value;

//     fs.set("devserver", server);

//     console.log(server);
// }

// export async function createClient(progressCB) {
//     try {
//         let game = btDevGame.get();
//         let newClient = fs.get("devclient");

//         let errors = validation.validateSimple("game_client", newClient);
//         if (errors.length > 0) {
//             fs.set("devclienterror", errors);
//             return newClient;
//         }

//         let response = await POST(
//             "/api/v1/dev/create/client/" + game.gameid,
//             newClient
//         );
//         let client = response.data;

//         fs.set("devclienterror", []);
//         console.log(client);
//         return client;
//     } catch (e) {
//         console.error(e);

//         if (e.response) {
//             const { response } = e;
//             const data = response.data;

//             //const { request, ...errorObject } = response; // take everything but 'request'
//             //console.log(errorObject);

//             fs.set("devclienterror", [data]);
//         }
//     }
//     return null;
// }

// export async function createServer(progressCB) {
//     try {
//         let game = btDevGame.get();
//         let newServer = fs.get("devserver");

//         let errors = validation.validateSimple("game_server", newServer);
//         if (errors.length > 0) {
//             fs.set("devservererror", errors);
//             return newServer;
//         }

//         let response = await POST(
//             "/api/v1/dev/create/server/" + game.gameid,
//             newServer
//         );
//         let server = response.data;

//         fs.set("devservererror", []);
//         console.log(server);
//         return server;
//     } catch (e) {
//         console.error(e);

//         if (e.response) {
//             const { response } = e;
//             const data = response.data;

//             //const { request, ...errorObject } = response; // take everything but 'request'
//             //console.log(errorObject);

//             fs.set("devservererror", [data]);
//         }
//     }
//     return null;
// }

export function clearGameFields() {
    btDevGame.set({});
    btDevGameTeams.set([]);
    btDevGameError.set([]);
}

export async function sendGithubInvite() {
    let response = await POST("/api/v1/dev/invite/github", {});
    let json = response.data;
    if (json && json.status && json.status == "success") {
        return true;
    }
    return false;
}

// export async function createGame() {
//     try {
//         let newGame = btDevGame.get();

//         let errors = validation.validateSimple("create-game_info", newGame);
//         if (errors.length > 0) {
//             fs.set("devgameerror", errors);
//             return null;
//         }

//         let response = await POST("/api/v1/dev/create/game", newGame);
//         let game = response.data;

//         btDevGameError.set([]);
//         console.log(game);
//         return game;
//     } catch (e) {
//         console.error(e);

//         if (e.response) {
//             const { response } = e;
//             const data = response.data;

//             //const { request, ...errorObject } = response; // take everything but 'request'
//             //console.log(errorObject);

//             btDevGameError.set([data]);
//         }
//     }
//     return null;
// }

// export async function deployToProduction(game:any) {
//     try {
//         let deployGame = {
//             gameid: game.gameid,
//             version: game.latest_version,
//         };
//         let response = await POST("/api/v1/dev/deploy/game", deployGame);
//         let gameResult = response.data;

//         if (!gameResult.version) {
//             fs.set("devgameerror", [
//                 { ecode: "E_DEPLOYERROR", payload: "Unknown" },
//             ]);
//             return;
//         }

//         let dgame = btDevGame.get();
//         game.version = gameResult.version;
//         fs.set("devgame", game);

//         let dgames = fs.get("devgames");
//         for (var i = 0; i < dgames.length; i++) {
//             let g = dgames[i];
//             if (g.gameid == game.gameid) {
//                 g.version = gameResult.version;
//                 dgames[i] = g;
//                 fs.set("devgames", dgames);
//                 break;
//             }
//         }

//         btDevGameError.set([]);
//         console.log(gameResult);
//         return gameResult;
//     } catch (e) {
//         console.error(e);

//         if (e.response) {
//             const { response } = e;
//             const data = response.data;

//             //const { request, ...errorObject } = response; // take everything but 'request'
//             //console.log(errorObject);

//             btDevGameError.set([data]);
//         }
//     }
//     return null;
// }

// export async function deployVersionToProduction(game, version) {
//     try {
//         if (
//             !version ||
//             !Number.isInteger(version) ||
//             version < 0 ||
//             version > game.latest_version
//         ) {
//             version = game.latest_version;
//         }

//         let deployGame = {
//             gameid: game.gameid,
//             version,
//         };
//         let response = await POST("/api/v1/dev/deploy/game", deployGame);
//         let gameResult = response.data;

//         if (!gameResult.version) {
//             fs.set("devgameerror", [
//                 { ecode: "E_DEPLOYERROR", payload: "Unknown" },
//             ]);
//             return;
//         }

//         let dgame = btDevGame.get();
//         game.version = gameResult.version;
//         fs.set("devgame", game);

//         let dgames = fs.get("devgames");
//         for (var i = 0; i < dgames.length; i++) {
//             let g = dgames[i];
//             if (g.gameid == game.gameid) {
//                 g.version = gameResult.version;
//                 dgames[i] = g;
//                 fs.set("devgames", dgames);
//                 break;
//             }
//         }

//         btDevGameError.set([]);
//         console.log(gameResult);
//         return gameResult;
//     } catch (e) {
//         console.error(e);

//         if (e.response) {
//             const { response } = e;
//             const data = response.data;

//             //const { request, ...errorObject } = response; // take everything but 'request'
//             //console.log(errorObject);

//             btDevGameError.set([data]);
//         }
//     }
//     return null;
// }
