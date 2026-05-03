import { useEffect, useMemo, useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import config from "../config";
import { chatMessages, currentPlayer, friends, leaderboard } from "../data/mockData";

const QUICK_CHATS = [
  "Wow!",
  "Nice one!",
  "Great pass!",
  "What a save!",
  "Close one!",
  "No problem.",
  "Thanks!",
  "Defending...",
  "I got it!",
];

export function ChatPane() {
  const [draft, setDraft] = useState("");
  const [quickChatOpen, setQuickChatOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState(chatMessages);
  const quickChatRef = useRef<HTMLDivElement>(null);

  const senderProfiles = useMemo(() => {
    const map = new Map<string, { avatarUrl: string; country: string }>();

    map.set(currentPlayer.name, { avatarUrl: currentPlayer.avatarUrl, country: currentPlayer.country });
    map.set("You", { avatarUrl: currentPlayer.avatarUrl, country: currentPlayer.country });

    friends.forEach((friend) => {
      map.set(friend.name, { avatarUrl: friend.avatarUrl, country: "US" });
    });

    leaderboard.forEach((entry, idx) => {
      if (!map.has(entry.player)) {
        map.set(entry.player, {
          avatarUrl: `https://i.pravatar.cc/80?img=${idx + 21}`,
          country: entry.countrycode,
        });
      }
    });

    return map;
  }, []);

  const messages = useMemo(() => localMessages.slice(-30), [localMessages]);

  const sendText = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sender: currentPlayer.name,
        message: text,
        timestamp,
      },
    ]);
  };

  const sendMessage = () => {
    sendText(draft);
    setDraft("");
  };

  const sendQuickChat = (value: string) => {
    if (!value) return;
    sendText(value);
    setQuickChatOpen(false);
  };

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (quickChatRef.current && !quickChatRef.current.contains(e.target as Node)) {
        setQuickChatOpen(false);
      }
    }

    if (quickChatOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [quickChatOpen]);

  return (
    <section className="flex h-full min-h-0 flex-col-reverse relative overflow-hidden p-2 sm:p-2">
      <div className="min-h-10 shrink-0 flex items-center gap-2  pt-2.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Message squad..."
          className="h-8 flex-1 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
        />
        <div className="relative" ref={quickChatRef}>
          <button
            type="button"
            onClick={() => setQuickChatOpen((v) => !v)}
            className="h-8 w-8 rounded-md border border-slate-300 bg-slate-50 text-sm text-slate-700 transition-colors hover:border-cyan-300 hover:bg-cyan-50"
            aria-label="Open quick chat menu"
            aria-expanded={quickChatOpen}
          >
            ⚡
          </button>

          {quickChatOpen && (
            <div className="absolute bottom-9 right-0 z-30 w-36 overflow-hidden rounded-md border border-slate-200 bg-white py-1.5 shadow-lg">
              {QUICK_CHATS.map((msg) => (
                <button
                  key={msg}
                  type="button"
                  onClick={() => sendQuickChat(msg)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100"
                >
                  <span className="text-[11px] text-cyan-700">⚡</span>
                  {msg}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={sendMessage}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-r from-cyan-500 to-blue-600 text-white transition-colors hover:from-cyan-400 hover:to-blue-500"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 min-h-0 max-h-50 md:max-h-full overflow-y-auto pr-1 panel-scrollbar">
        {messages.map((msg) => {
          const isMe = msg.sender === currentPlayer.name || msg.sender === "You";
          const sender = senderProfiles.get(msg.sender) ?? {
            avatarUrl: `https://i.pravatar.cc/80?u=${encodeURIComponent(msg.sender)}`,
            country: "US",
          };
          const countrycode = (sender.country || "US").toUpperCase();
          const flagSrc = `${config.https.cdn}images/country/${countrycode}.svg`;

          return (
            <div
              key={msg.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 mb-1.5 last:mb-0"
            >
              <div className="flex gap-1.5 min-w-0">
                <img src={sender.avatarUrl} alt={msg.sender} className="h-6 w-6 shrink-0 rounded-md border border-slate-300 object-cover" />
                <div className="inline leading-none">
                  <img
                    src={flagSrc}
                    alt={`${countrycode} flag`}
                    className="mr-1 inline-block h-3 w-4 rounded-[2px] border border-slate-300 object-cover wrap-anywhere"
                    title={countrycode}
                  />
                  <span className={`text-xs wrap-anywhere font-semibold ${isMe ? "text-cyan-700" : "text-slate-900"}`}>
                    {msg.sender}
                  </span>
                  <span className="mr-1 text-xs text-slate-500">:</span>
                  <span className="text-xs text-slate-700 wrap-anywhere">{msg.message}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
    </section>
  );
}
