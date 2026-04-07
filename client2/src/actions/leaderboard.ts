import {  
        btLeaderboard,
        btLoading
 } from "./buckets";
import { createRedisKey, getWithExpiry, setWithExpiry } from "./cache";
import { POST } from "./http";



export async function findLeaderboard(config:CacheConfig) {
    try {
        btLoading.assign({ leaderboardAPI: true });
        let key = createRedisKey(config);

        let cachedRanking = getWithExpiry(key);
        if (cachedRanking) {
            btLeaderboard.set(cachedRanking);
            btLoading.assign({ leaderboardAPI: false });
            return true;
        }

        let response = await POST("/api/v1/game/leaderboard/", config);
        let result = response.data;

        btLoading.assign({ leaderboardAPI: false });
        if (result.ecode) {
            if (result.ecode == "E_NOTAUTHORIZED") {
                return;
            }
            throw result.ecode;
        }

        let leaderboard = combineLeaderboards(result.leaderboard, result.localboard);
        let total = result.total;

        btLeaderboard.set({ leaderboard, total });
        setWithExpiry(key, { leaderboard, total }, 10);

        // btGameFound.set(true);
        return true;
    } catch (e) {
        console.error(e);
    }
    return false;
}


export function combineLeaderboards(a: any[], b: any[]) {
    a = a || [];
    b = b || [];
    let combined = a.concat(b);
    let rankmap: { [key: string]: any } = {};
    for (var i = 0; i < combined.length; i++) {
        let ranking = combined[i];
        rankmap[ranking.displayname] = ranking;
    }

    let leaderboard: any[] = [];
    for (let key in rankmap) leaderboard.push(rankmap[key]);
    leaderboard.sort((a, b) => a.rank - b.rank);

    return leaderboard;
}
