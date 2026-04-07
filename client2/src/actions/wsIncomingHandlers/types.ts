export type WSIncomingHandlerAction = "return" | "continue";

export type WSIncomingHandlerContext = {
    msg: ACOSMessage;
    byteLength: number;
    history?: (path: string) => void;
    timerLoop: () => void;
};

export type WSIncomingHandler = (
    context: WSIncomingHandlerContext
) => Promise<WSIncomingHandlerAction> | WSIncomingHandlerAction;
