import { wsSend } from "./ws";

import { getPrimaryGamePanel } from "./room";
import { btChannel, btChatMessage, btChatUpdated, btGame, btLastChatSent } from "./buckets";



export function addChatMessage(msg: any) {

    // if (!msg)
    //     return null;

    // if (!msg.payload)
    //     return null;

    let channel = 'chat';
    let chatMessages: ChatPayload[] = [];

    if (Array.isArray(msg)) {

        for (var i = 0; i < msg.length; i++) {
            let payload = msg[i];
            if (payload.room_slug) {
                channel = 'chat/' + payload.room_slug;
            } else {
                channel = 'chat';
            }

            chatMessages = getChatMessages(channel);
            chatMessages.push(payload);
            saveChatMessages(channel, chatMessages);
        }

        if (msg.length > 0)
            btChatUpdated.set(Date.now());

    } else {
        if (msg.room_slug) {
            channel = 'chat/' + msg.room_slug;
        }

        chatMessages = getChatMessages(channel);
        chatMessages.push(msg);
        saveChatMessages(channel, chatMessages);
    }




    // localStorage.removeItem(key)
}

export function clearChatMessages(channel:string) {
    channel = channel || 'chat';
    localStorage.removeItem(channel);

    btChannel.assign({ [channel]: [] });
}

export function filterChatMessages(chatMessages: ChatPayload[], chatMode: string): ChatPayload[] {
    chatMode = chatMode || 'all';

    if (chatMode == 'game') {
        let game = btGame.get();
        if (game) {
            let filtered: ChatPayload[] = [];
            for (var msg of chatMessages) {
                if (msg.room_slug)
                    continue;
                if (msg.game_slug == game.game_slug) {
                    filtered.push(msg);
                }
            }
            chatMessages = filtered;
        }
    }
    else if (chatMode == 'room') {
        let filtered: ChatPayload[] = [];
        let gamepanel = getPrimaryGamePanel();
        for (var msg of chatMessages) {
            if (msg.room_slug == gamepanel?.room?.room_slug) {
                filtered.push(msg);
            }
        }
        chatMessages = filtered;
    }
    return chatMessages;
}

export function saveChatMessages(channel: string, chatMessages: ChatPayload[]): void {

    let count = chatMessages.length;
    if (count > 100) {
        chatMessages = chatMessages.slice(count - 100, count);
    }

    btChannel.assign({ [channel]: chatMessages });
    btChatUpdated.set(Date.now());
    localStorage.setItem(channel, JSON.stringify(chatMessages));
}
export function getChatMessages(channel: string): ChatPayload[] {

    // let channel = 'chat';
    // if (chatMode != 'all') {
    //     channel = 'chat/' + chatMode;
    // }
    let chatMessages = btChannel.get(bucket => bucket[channel]);
    // if (!chatMessages) {
    //     chatMessages = JSON.parse(localStorage.getItem(channel));
    //     if (!chatMessages)
    //         chatMessages = [];
    // }

    // chatMessages = filterChatMessages(chatMessages, chatMode);

    return chatMessages || [];
}

export async function sendChatMessage() {

    let message = btChatMessage.get();
    if (!message)
        return false;



    let game = btGame.get();
    let game_slug = game?.game_slug;

    let gamepanel = getPrimaryGamePanel();
    let room_slug = gamepanel?.room?.room_slug;

    let payload = { message, game_slug, room_slug }

    await wsSend({ type: 'chat', payload })

    btLastChatSent.set(Date.now());
    btChatMessage.set('');
}