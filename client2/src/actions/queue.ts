
import { btGame, btGames, btJoinQueues, btQueueStats, btQueues } from './buckets';


export async function onQueueStats(msg:any) {
    btQueueStats.set(msg);
}

export async function addGameQueue(newQueues:any) {

    let queues = btQueues.get() || localStorage.getItem('queues') || [];

    let queueMap: Record<string, boolean> = {};
    queues.forEach((q: any) => queueMap[q.game_slug + q.mode] = true);

    newQueues.forEach((q: any) => {
        if (!queueMap[q.game_slug + q.mode])
            queues.push(q);
    })

    btQueues.set(queues);

}

export async function addJoinQueues(game_slug: string, mode: string) {
    let joinqueues = getJoinQueues() || {};

    if (!joinqueues.queues)
        joinqueues.queues = [];

    let game = btGame.get();
    let games = btGames.get();

    if (!game || !game.longdesc) {
        game = games[game_slug];
    }

    if (!joinqueues.queues.find((q: any) => q.game_slug == game_slug && q.mode == mode)) {
        joinqueues.queues.push({ game_slug, mode });
        joinqueues.owner = null;
        btJoinQueues.set(joinqueues);
        localStorage.setItem('joinqueues', JSON.stringify(joinqueues));
    }
}

export function getJoinQueues() {
    let joinqueues = btJoinQueues.get() || {};
    try {
        if (!joinqueues || !joinqueues.queues || joinqueues.queues.length == 0) {
            joinqueues = localStorage.getItem('joinqueues');
            if (joinqueues)
                joinqueues = JSON.parse(joinqueues);

            if (!joinqueues)
                joinqueues = {}
        }
    }
    catch (e) {
        console.error(e);
    }

    return joinqueues;
}

export function findQueue(game_slug: string) {
    let queues = btQueues.get() || localStorage.getItem('queues') || [];
    if (queues.find((q: any) => (q.game_slug == game_slug))) {
        return true;
    }
    return false;
}

export async function clearGameQueues() {
    btQueues.set([]);
    btJoinQueues.set(null);
    localStorage.setItem('queues', JSON.stringify([]));
    localStorage.removeItem('joinqueues');
}


export async function getQueues() {
    return btQueues.get() || [];
}