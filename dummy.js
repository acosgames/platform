// const { genFullShortId } = require('./shared/util/idgen');

// for(var i=0; i<5; i++) {
//     console.log(genFullShortId(5));
// }


const redis = require('./shared/services/redis');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {


    while (!redis.isActive) {

        console.warn("[WebSocket] waiting on redis...");
        await this.sleep(1000);
        //return;
    }

    await redis.connect();

    // let json = {
    //     timer: 999,
    //     seq: 3
    // }
    // await redis.hset('action-1', '1234', JSON.stringify(json))

    // let json2 = {
    //     timer: 444,
    //     seq: 6
    // }
    // await redis.hset('action-1', 'abcd', JSON.stringify(json2));

    // let result = await redis.hget('action-1', '1234');
    // console.log("hget", result);

    // let result2 = await redis.hgetall('action-1');
    // console.log("hgetall", result2);

    let members = [
        { name: 'JOE', rating: 3000 },
        { name: 'TIM', rating: 2000 },
        { name: 'BOB', rating: 2500 },
        { name: 'SID', rating: 3500 },
        { name: 'SID1', rating: 3501 },
        { name: 'SID2', rating: 2902 },
        { name: 'SID3', rating: 2903 },
        { name: 'SID4', rating: 2904 },
        { name: 'SID5', rating: 2905 },
        { name: 'SID6', rating: 2906 },
        { name: 'SID7', rating: 2907 },
        { name: 'SID8', rating: 3508 },
        { name: 'SID9', rating: 3509 },
        { name: 'SID10', rating: 3510 },
        { name: 'SID11', rating: 3511 },
        { name: 'SID12', rating: 3512 },
        { name: 'SID13', rating: 3513 },
        { name: 'SID14', rating: 3514 },
    ]


    await updateLeaderboard('tictactoe', members);

    let top10 = await getGameTop10Players('tictactoe');
    let playerRanking = await getPlayerGameLeaderboard('tictactoe', '5SG');

}

async function getGameTop10Players(game_slug) {

    let rankings = await redis.zrevrange(game_slug + '/lb', 0, 10);

    for (var i = 0; i < rankings.length; i++) {
        rankings[i].rank = (i + 1);
    }

    console.log("top10: ", rankings);

    return rankings;
}

async function getPlayerGameLeaderboard(game_slug, player) {
    let rank = await redis.zrevrank(game_slug + '/lb', player);
    console.log("rank: ", game_slug, player, rank);

    let rankings = await redis.zrevrange(game_slug + '/lb', Math.max(0, rank - 1), rank + 1);
    console.log("rankings raw: ", rankings);
    let playerPos = 0;
    for (var i = 0; i < rankings.length; i++) {
        if (rankings[i].value == player) {
            playerPos = -i;
            break;
        }
    }

    let otherRank = 0;
    for (var i = 0; i < rankings.length; i++) {

        rankings[i].rank = rank + (playerPos + i + 1)
    }

    console.log("range: ", game_slug, rankings);

    return rankings;
}

async function updateLeaderboard(game_slug, players) {
    try {
        let members = [];
        for (var id in players) {
            let player = players[id];
            members.push({ value: player.name, score: player.rating });
        }

        let result = await redis.zadd(game_slug + '/lb', members);
        return result;
    }
    catch (e) {
        console.error(e);
    }
    return false;
}

run();