// const { genFullShortId } = require('./fsg-shared/util/idgen');

// for(var i=0; i<5; i++) {
//     console.log(genFullShortId(5));
// }


const redis = require('./fsg-shared/services/redis');

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

    let json = {
        timer: 999,
        seq: 3
    }
    await redis.hset('action-1', '1234', JSON.stringify(json))

    let json2 = {
        timer: 444,
        seq: 6
    }
    await redis.hset('action-1', 'abcd', JSON.stringify(json2));

    let result = await redis.hget('action-1', '1234');
    console.log(result);

    let result2 = await redis.hgetall('action-1');
    console.log(result2);
}

run();