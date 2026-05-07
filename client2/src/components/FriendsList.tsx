import { useMemo, useState } from "react";
import { friends } from "../data/mockData";

export function FriendsList() {
  const [partyMemberIds, setPartyMemberIds] = useState<Set<string>>(new Set(["f2"]));

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
        className={`rounded-xl drop-shadow-md px-2.5 py-2 transition-colors ${
          inParty
            ? "border-blue-200 bg-blue-50"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <img src={avatarUrl} alt={name} className="h-8 w-8 rounded-full border border-slate-300 object-cover" />
            <span
              className={`absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border border-white ${
                status === "in-game" ? "bg-blue-500" : "bg-emerald-400"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-xs font-semibold text-slate-900">{name}</p>
              {inParty && (
                <span className="rounded-full border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">
                  In Party
                </span>
              )}
            </div>
            <p className="truncate text-[11px] text-slate-500">
              {status === "in-game" ? `In game: ${currentGame ?? "Matchmaking"}` : "Online"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => toggleParty(id)}
            className={`h-6 shrink-0 rounded-xl border px-2 text-[11px] font-semibold transition-colors ${
              inParty
                ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {inParty ? "Leave" : "Party Up"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="flex h-full min-h-0 flex-col p-3 sm:p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Friends</h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
            {onlineFriends.length} online
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 panel-scrollbar2 pb-2">
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">In Game</p>
            {inGameFriends.length > 0 ? (
              <div className="space-y-2">
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
              <p className="text-[11px] text-slate-500">No friends currently in-game.</p>
            )}
          </div>

          <div className="space-y-1.5 border-t border-slate-200 pt-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Online</p>
            {availableFriends.length > 0 ? (
              <div className="space-y-2">
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
              <p className="text-[11px] text-slate-500">No friends currently online.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
