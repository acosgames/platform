import { handleChat } from "./chat";
import {
    handleGameCancelled,
    handleGameError,
    handleGameOver,
    handleJoin,
    handleKicked,
    handleLeave,
    handleNoShow,
    handlePrivate,
    handleUpdate,
} from "./logs";
import { handleAchievements, handleXp } from "./profile";
import {
    handleAddedQueue,
    handlePong,
    handleQueueStats,
    handleRankings,
    handleRemovedQueue,
} from "./queue";
import {
    handleDuplicateTabs,
    handleError,
    handleInRooms,
    handleJoined,
    handleNotExist,
    handleReady,
} from "./rooms";
import type { WSIncomingHandler } from "./types";

export const wsIncomingHandlers: Record<string, WSIncomingHandler> = {
    chat: handleChat,
    xp: handleXp,
    achievements: handleAchievements,
    rankings: handleRankings,
    queueStats: handleQueueStats,
    pong: handlePong,
    addedQueue: handleAddedQueue,
    removedQueue: handleRemovedQueue,
    ready: handleReady,
    noshow: handleNoShow,
    notexist: handleNotExist,
    inrooms: handleInRooms,
    joined: handleJoined,
    join: handleJoin,
    kicked: handleKicked,
    gameover: handleGameOver,
    gamecancelled: handleGameCancelled,
    gameerror: handleGameError,
    private: handlePrivate,
    update: handleUpdate,
    leave: handleLeave,
    error: handleError,
    duplicatetabs: handleDuplicateTabs,
};
