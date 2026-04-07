import type { WSIncomingHandlerContext } from "./types";

function toPlainMessage(msg: ACOSMessage) {
    return JSON.parse(JSON.stringify(msg, null, 2));
}

export function logIncoming(label: string, context: WSIncomingHandlerContext) {
    console.log(label, `[${context.byteLength} bytes]`, toPlainMessage(context.msg));
}
