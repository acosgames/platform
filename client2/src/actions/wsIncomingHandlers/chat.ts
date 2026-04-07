import { addChatMessage } from "../chat";
import type { WSIncomingHandler } from "./types";

export const handleChat: WSIncomingHandler = (context) => {
    console.log("[ChatMessage]:", context.msg);
    addChatMessage(context.msg);
    return "return";
};
