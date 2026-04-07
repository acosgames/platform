import { btRankingUpdate } from "../buckets";
import { addGameQueue, onQueueStats } from "../queue";
import { onPong, wsLeaveQueue } from "../ws";
import type { WSIncomingHandler } from "./types";
import { logIncoming } from "./utils";

export const handleRankings: WSIncomingHandler = (context) => {
    console.log("[rankings]:", context.msg);
    btRankingUpdate.set(context.msg.payload);

    console.log("[queueStats]:", `[${context.byteLength} bytes]`, context.msg);
    onQueueStats(context.msg);
    return "return";
};

export const handleQueueStats: WSIncomingHandler = (context) => {
    console.log("[queueStats]:", `[${context.byteLength} bytes]`, context.msg);
    onQueueStats(context.msg);
    return "return";
};

export const handlePong: WSIncomingHandler = (context) => {
    onPong(context.msg);
    return "return";
};

export const handleAddedQueue: WSIncomingHandler = (context) => {
    logIncoming("[Incoming] queue:", context);

    const payload = context.msg.payload as { queues?: any };
    addGameQueue(payload?.queues);

    return "return";
};

export const handleRemovedQueue: WSIncomingHandler = async (context) => {
    logIncoming("[Incoming] queue:", context);
    await wsLeaveQueue();
    return "return" as const;
};
