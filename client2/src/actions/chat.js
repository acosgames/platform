import { wsSend } from "./ws";

import { getPrimaryGamePanel } from "./room";
import { btChannel, btChatMessage, btChatUpdated, btGame, btLastChatSent } from "./buckets";



export function addChatMessage(msg) {

    if (!msg)
        return null;

    if (!msg.payload)
        return null;

    let channel = 'chat';
    let chatMessages = [];

    if (Array.isArray(msg.payload)) {

        for (var i = 0; i < msg.payload.length; i++) {
            let payload = msg.payload[i];
            if (payload.room_slug) {
                channel = 'chat/' + payload.room_slug;
            } else {
                channel = 'chat';
            }

            chatMessages = getChatMessages(channel);
            chatMessages.push(payload);
            saveChatMessages(channel, chatMessages);
        }

        if (msg.payload.length > 0)
            btChatUpdated.set(Date.now());

    } else {
        if (msg.payload.room_slug) {
            channel = 'chat/' + msg.payload.room_slug;
        }

        chatMessages = getChatMessages(channel);
        chatMessages.push(msg.payload);
        saveChatMessages(channel, chatMessages);
    }




    // localStorage.removeItem(key)
}

export function clearChatMessages(channel) {
    channel = channel || 'chat';
    localStorage.removeItem(channel);

    btChannel.assign({ [channel]: [] });
}

export function filterChatMessages(chatMessages, chatMode) {
    chatMode = chatMode || 'all';

    if (chatMode == 'game') {
        let game = btGame.get();
        if (game) {
            let filtered = [];
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
        let filtered = [];
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

export function saveChatMessages(channel, chatMessages) {

    let count = chatMessages.length;
    if (count > 100) {
        chatMessages = chatMessages.slice(count - 100, count);
    }

    btChannel.assign({ [channel]: chatMessages });
    btChatUpdated.set(Date.now());
    localStorage.setItem(channel, JSON.stringify(chatMessages));
}
export function getChatMessages(channel) {

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