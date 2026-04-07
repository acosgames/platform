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
  const [isCollapsed, setIsCollapsed] = useState(false);
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
          country: entry.country,
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
    <section className={`flex-1 bg-card  p-3.5 ${isCollapsed ? "shrink-0" : "flex-1 min-h-0 flex flex-col"}`}>
      <div className={`cursor-n-resize flex items-center justify-between ${isCollapsed ? "" : "mb-2.5"}`} onClick={() => {
              setIsCollapsed((v) => !v);
              setQuickChatOpen(false);
            }} >
        <h3 className="text-sm font-semibold text-foreground">Game Chat</h3>
        {/* <div className="flex items-center gap-2">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300">Live</span>
          <button
            type="button"
            // onClick={() => {
            //   setIsCollapsed((v) => !v);
            //   setQuickChatOpen(false);
            // }}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand chat pane" : "Collapse chat pane"}
            className="h-6 w-6 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cyan-400/40 transition-colors"
          >
            {isCollapsed ? "▸" : "▾"}
          </button>
        </div> */}
      </div>

      {!isCollapsed && (
      <>
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1 panel-scrollbar">
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
              className="px-1 py-0.5 border-b border-white/8 last:border-b-0"
            >
              <div className="flex gap-0.5 min-w-0">
                <img src={sender.avatarUrl} alt={msg.sender} className="w-6 h-6 rounded-md object-cover border border-white/20 shrink-0" />
                <div className="inline leading-none">
                  <img
                    src={flagSrc}
                    alt={`${countrycode} flag`}
                    className="w-4 h-3 mr-0.5 inline-block rounded-[2px] object-cover border border-white/20 wrap-anywhere"
                    title={countrycode}
                  />
                  <span className={`text-sm  wrap-anywhere font-medium ${isMe ? "text-cyan-400 dark:text-cyan-200" : "text-foreground"}`}>
                    {msg.sender}
                  </span>
                  <span className={`text-sm mr-1`}>:</span>
                  <span className="text-xs text-white/85  wrap-anywhere">{msg.message}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-white/10 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Message squad..."
          className="flex-1 h-8 rounded-md border border-white/15 bg-black/20 px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400/40"
        />
        <div className="relative" ref={quickChatRef}>
          <button
            type="button"
            onClick={() => setQuickChatOpen((v) => !v)}
            className="h-8 w-8 rounded-md border border-cyan-400/30 bg-black/25 text-sm hover:bg-cyan-500/20 hover:border-cyan-300/55 transition-colors"
            aria-label="Open quick chat menu"
            aria-expanded={quickChatOpen}
          >
            ⚡
          </button>

          {quickChatOpen && (
            <div className="absolute bottom-9 right-0 z-30 w-36 rounded-md bg-popover border border-white/10 shadow-2xl shadow-black/50 py-1.5 overflow-hidden">
              {QUICK_CHATS.map((msg) => (
                <button
                  key={msg}
                  type="button"
                  onClick={() => sendQuickChat(msg)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-white/5 text-left"
                >
                  <span className="text-[11px] text-cyan-800 dark:text-cyan-200">⚡</span>
                  {msg}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={sendMessage}
          className="h-8 w-8 rounded-md text-background bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-colors inline-flex items-center justify-center"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </button>
      </div>
      </>
      )}
    </section>
  );
}
