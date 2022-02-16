// const { genFullShortId } = require('./shared/util/idgen');

// for(var i=0; i<5; i++) {
//     console.log(genFullShortId(5));
// }

const axios = require('axios');

const redis = require('./shared/services/redis');

const { encode, decode } = require('./shared/util/encoder');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function run() {


    let test = {
        uint: (new Date()).getTime(),
        int: -(new Date()).getTime()
    }
    console.log("original: ", test);

    let bytes = encode(test);

    console.log("bytes: ", bytes);
    let json = decode(bytes);
    console.log("decode: ", json);

    // let id = BigInt(102938490234231n);

    // let bytes = bnToBuf(id);
    // console.log(id);
    // console.log(bytes);
    // while (!redis.isActive) {

    //     console.warn("[WebSocket] waiting on redis...");
    //     await this.sleep(1000);
    //     //return;
    // }

    // await redis.connect();

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

    // let members = [
    //     { name: 'JOE', rating: 3000 },
    //     { name: 'TIM', rating: 2000 },
    //     { name: 'BOB', rating: 2500 },
    //     { name: 'SID', rating: 3500 },
    //     { name: 'SID1', rating: 3501 },
    //     { name: 'SID2', rating: 2902 },
    //     { name: 'SID3', rating: 2903 },
    //     { name: 'SID4', rating: 2904 },
    //     { name: 'SID5', rating: 2905 },
    //     { name: 'SID6', rating: 2906 },
    //     { name: 'SID7', rating: 2907 },
    //     { name: 'SID8', rating: 3508 },
    //     { name: 'SID9', rating: 3509 },
    //     { name: 'SID10', rating: 3510 },
    //     { name: 'SID11', rating: 3511 },
    //     { name: 'SID12', rating: 3512 },
    //     { name: 'SID13', rating: 3513 },
    //     { name: 'SID14', rating: 3514 },
    // ]


    // await updateLeaderboard('tictactoe', members);

    // let top10 = await getGameTop10Players('tictactoe');
    // let playerRanking = await getPlayerGameLeaderboard('tictactoe', '5SG');

    // let results = [];
    // let errors = [];
    // let count = 0;
    // console.time('stresstest');
    // while (count < 10000) {
    //     axios.get('https://acos.games/api/v1/game/tictactoe')
    //         .then(result => {
    //             results.push(result.data);
    //         })
    //         .catch(e => {
    //             // console.log(e);
    //             errors.push(e);
    //         });
    //     await sleep(3);
    //     count++;
    //     // console.log(count);
    // }

    // while ((results.length + errors.length) < 10000) {
    //     console.log("results: " + results.length, "errors: " + errors.length);
    //     console.timeEnd('stresstest');
    //     break;

    // }

    // console.log(results.data);

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

// run();

var dvbuff = new ArrayBuffer(16);
var dv = new DataView(dvbuff);

const TYPE_INT8 = 0;
const TYPE_UINT8 = 1;
const TYPE_INT16 = 2;
const TYPE_UINT16 = 3;
const TYPE_INT32 = 4;
const TYPE_UINT32 = 5;

function convertNumberToBytes(number, buffer) {
    if (number >= -128 && number < 0) {
        buffer.push(TYPE_INT8);
        dv.setInt8(0, number);
        buffer.push(dv.getUint8(0));
    }
    else if (number >= 0 && number <= 255) {
        buffer.push(TYPE_UINT8);
        dv.setUint8(0, number);
        buffer.push(dv.getUint8(0));
    }
    else if (number >= -32768 && number < 0) {
        buffer.push(TYPE_INT16);
        dv.setInt16(0, number);
        buffer.push(dv.getUint8(0));
        buffer.push(dv.getUint8(1));
    }
    else if (number >= 0 && number <= 65535) {
        buffer.push(TYPE_UINT16);
        dv.setUint16(0, number);
        buffer.push(dv.getUint8(0));
        buffer.push(dv.getUint8(1));
    }
    else if (number >= -2147483648 && number < 0) {
        buffer.push(TYPE_INT32);
        dv.setInt32(0, number);
        buffer.push(dv.getUint8(0));
        buffer.push(dv.getUint8(1));
        buffer.push(dv.getUint8(2));
        buffer.push(dv.getUint8(3));
    }
    else if (number >= 0 && number <= 4294967295) {
        buffer.push(TYPE_UINT32);
        dv.setUint32(0, number);
        buffer.push(dv.getUint8(0));
        buffer.push(dv.getUint8(1));
        buffer.push(dv.getUint8(2));
        buffer.push(dv.getUint8(3));
    }
}

function run2() {

    let buffer = [];
    //convert number to bytes
    let test1 = 100;
    let test2 = 123412341;
    let test3 = -1432;

    convertNumberToBytes(test1, buffer);
    convertNumberToBytes(test2, buffer);
    convertNumberToBytes(test3, buffer);

    console.log([test1, test2, test3]);
    console.log(buffer);

    [100, 123412341, -1432]

}

run2();