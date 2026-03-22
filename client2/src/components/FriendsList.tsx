import { useMemo, useState } from "react";
import { friends } from "../data/mockData";

export function FriendsList() {
  const [partyMemberIds, setPartyMemberIds] = useState<Set<string>>(new Set(["f2"]));
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlineFriends = useMemo(
    () => friends.filter((friend) => friend.status === "online" || friend.status === "in-game"),
    []
  );

  const inGameFriends = onlineFriends.filter((friend) => friend.status === "in-game");
  const availableFriends = onlineFriends.filter((friend) => friend.status === "online");

  const toggleParty = (friendId: string) => {
    setPartyMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(friendId)) next.delete(friendId);
      else next.add(friendId);
      return next;
    });
  };

  const FriendRow = ({
    id,
    name,
    avatarUrl,
    status,
    currentGame,
  }: {
    id: string;
    name: string;
    avatarUrl: string;
    status: "online" | "in-game";
    currentGame?: string;
  }) => {
    const inParty = partyMemberIds.has(id);

    return (
      <div
        className={`rounded-md border px-2.5 py-2 transition-colors ${
          inParty
            ? "border-cyan-400/45 bg-cyan-500/12"
            : "border-white/10 bg-black/15"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
            <span
              className={`absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border border-card ${
                status === "in-game" ? "bg-violet-400" : "bg-emerald-400"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-medium text-foreground truncate">{name}</p>
              {inParty && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-cyan-300/45 bg-cyan-500/20 text-cyan-800 dark:text-cyan-200">
                  In Party
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {status === "in-game" ? `In game: ${currentGame ?? "Matchmaking"}` : "Online"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleParty(id)}
            className={`shrink-0 h-6 px-2 rounded-md text-[11px] font-semibold border transition-colors ${
              inParty
                ? "border-cyan-300/40 bg-cyan-500/20 text-cyan-800 dark:text-cyan-200 hover:bg-cyan-500/30"
                : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
            }`}
          >
            {inParty ? "Leave" : "Party Up"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="rounded-lg border border-slate-300/65 dark:border-white/20 bg-linear-to-b from-slate-50/95 to-slate-100/90 dark:from-card dark:to-card/85 backdrop-blur-sm ring-1 ring-slate-300/40 dark:ring-white/5 p-3.5 space-y-3 shrink-0 overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.32)]">
      <div className="flex items-center justify-between gap-2" onClick={() => setIsCollapsed((v) => !v)}>
        <h3 className="text-sm font-semibold text-foreground">Friends</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300">{onlineFriends.length} online</span>
          <button
            type="button"
            // onClick={() => setIsCollapsed((v) => !v)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand friends list" : "Collapse friends list"}
            className="h-6 w-6 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cyan-400/40 transition-colors"
          >
            {isCollapsed ? "▸" : "▾"}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 panel-scrollbar">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">In Game</p>
            {inGameFriends.length > 0 ? (
              <div className="space-y-1.5">
                {inGameFriends.map((friend) => (
                  <FriendRow
                    key={friend.id}
                    id={friend.id}
                    name={friend.name}
                    avatarUrl={friend.avatarUrl}
                    status="in-game"
                    currentGame={friend.currentGame}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-white/45">No friends currently in-game.</p>
            )}
          </div>

          <div className="pt-1 border-t border-white/10 space-y-1.5 max-h-44 overflow-y-auto pr-1 panel-scrollbar">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Online</p>
            {availableFriends.length > 0 ? (
              <div className="space-y-1.5">
                {availableFriends.map((friend) => (
                  <FriendRow
                    key={friend.id}
                    id={friend.id}
                    name={friend.name}
                    avatarUrl={friend.avatarUrl}
                    status="online"
                  />
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-white/45">No friends currently online.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
