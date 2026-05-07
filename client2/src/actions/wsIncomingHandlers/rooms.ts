import { btDuplicateTabs } from "../buckets";
import { clearGameQueues } from "../queue";
import { addRoom, addRooms, clearRoom, setLastJoinType, setRoomForfeited } from "../room";
import { wsLeaveGame } from "../ws";
import type { WSIncomingHandler } from "./types";
import { logIncoming } from "./utils";

import { router } from '../../routes';

export const handleReady: WSIncomingHandler = () => {
    console.log("iframe is ready!");
    return "return";
};

export const handleNotExist: WSIncomingHandler = (context: any) => {
    const currentPath = window.location.href;
    const currentParts = currentPath.split("/g/");

    if (context.history && currentParts.length > 1) {
        const gamemode = currentParts[1].split("/");
        const gameSlug = gamemode[0];
        context.history(`/g/${gameSlug}`);
    }

    clearRoom(context.msg.room_slug);
    return "return";
};

export const handleInRooms: WSIncomingHandler = (context) => {
    logIncoming("[Incoming] InRooms:", context);

    const payload = context.msg.payload;
    if (Array.isArray(payload) && payload.length > 0) {
        const multiplayerRoom = payload.find((roomInfo: any) => roomInfo?.room?.maxplayers > 1);

        if (multiplayerRoom) {
            addRooms([multiplayerRoom]);

            payload.forEach((roomInfo: any) => {
                if (roomInfo === multiplayerRoom) return;
                setRoomForfeited(roomInfo.room.room_slug);
                wsLeaveGame(roomInfo.room.room_slug);
            });


            context.msg.payload = multiplayerRoom.gamestate;
            context.msg.room_slug = multiplayerRoom.room?.room_slug;
            let playPath = `/game/${multiplayerRoom?.room?.game_slug}/play`;
            if (window.location.pathname !== playPath) {
                router.navigate(playPath);
            }
            clearGameQueues();
        } else {
            addRooms(payload);
        }

        setLastJoinType("");
        context.timerLoop();
        return "return";
    }

    return "return";
};

export const handleJoined: WSIncomingHandler = (context) => {
    logIncoming("[Incoming] Joined:", context);

    addRoom(context.msg);

    let playPath = `/game/${context.msg.payload?.room?.game_slug}/play`;
    if (window.location.pathname !== playPath) {
        router.navigate(playPath);
    }

    const room = context.msg.payload?.room;
    if ((room?.maxplayers || 0) > 1) {
        clearGameQueues();
    }

    setLastJoinType("");
    context.timerLoop();
    return "return";
};

export const handleError: WSIncomingHandler = (context) => {
    logIncoming("[Incoming] ERROR::", context);
    clearGameQueues();
    setLastJoinType("");
    return "return";
};

export const handleDuplicateTabs: WSIncomingHandler = (context) => {
    logIncoming("[Incoming] ERROR :: Duplicate Tabs:: ", context);
    btDuplicateTabs.set(true);
    return "return";
};
