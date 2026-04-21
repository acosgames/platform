import type { WSIncomingHandler } from "./types";
import { logIncoming } from "./utils";

function createContinueLogger(label: string): WSIncomingHandler {
    return (context) => {
        logIncoming(label, context);
        return "continue";
    };
}

export const handleNoShow = createContinueLogger("[Incoming] No SHOW!");
export const handleJoin = createContinueLogger("[Incoming] Player joined the game!");
export const handleKicked = createContinueLogger("[Incoming] You were kicked from game!");
export const handleGameOver = createContinueLogger("[Incoming] Game Over!");
export const handleGameCancelled = createContinueLogger("[Incoming] Game Cancelled!");
export const handleGameError = createContinueLogger("[Incoming] Game Error!");
export const handlePrivate = createContinueLogger("[Incoming] Private State:");
export const handleUpdate = createContinueLogger("[Incoming] Update:");
export const handleLeave = createContinueLogger("[Incoming] Player Left:");

