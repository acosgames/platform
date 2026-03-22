
import { btGame, btGames, btJoinQueues, btQueueStats, btQueues } from './buckets';


export async function onQueueStats(msg) {
    btQueueStats.set(msg);
}

export async function addGameQueue(newQueues) {

    let queues = btQueues.get() || localStorage.getItem('queues') || [];

    let queueMap = {};
    queues.forEach(q => queueMap[q.game_slug + q.mode] = true);

    newQueues.forEach(q => {
        if (!queueMap[q.game_slug + q.mode])
            queues.push(q);
    })

    btQueues.set(queues);

}

export async function addJoinQueues(game_slug, mode) {
    let joinqueues = getJoinQueues() || {};

    if (!joinqueues.queues)
        joinqueues.queues = [];

    let game = btGame.get();
    let games = btGames.get();

    if (!game || !game.longdesc) {
        game = games[game_slug];
    }

    if (!joinqueues.queues.find(q => q.game_slug == game_slug && q.mode == mode)) {
        joinqueues.queues.push({ game_slug, mode, preview_image: game.preview_images, name: game.name });
        joinqueues.owner = null;
        btJoinQueues.set(joinqueues);
        localStorage.setItem('joinqueues', JSON.stringify(joinqueues));
    }
}

export function getJoinQueues() {
    let joinqueues = btJoinQueues.get() || [];
    try {
        if (!joinqueues || joinqueues.length == 0) {
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

export function findQueue(game_slug) {
    let queues = btQueues.get() || localStorage.getItem('queues') || [];
    if (queues.find(q => (q.game_slug == game_slug))) {
        return true;
    }
    return false;
}

export async function clearGameQueues() {
    btQueues.set([]);
    btJoinQueues.set(null);
    localStorage.setItem('queues', []);
    localStorage.removeItem('joinqueues');
}


export async function getQueues() {
    return btQueues.get() || [];
}