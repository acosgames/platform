import { useState } from "react";
import { gameQueues, games } from "../data/mockData";

export function QueueList() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const gameById = new Map(games.map((game) => [game.id, game]));

  const queuedGames = gameQueues
    .map((queue) => ({ queue, game: gameById.get(queue.gameId) }))
    .filter((item) => item.game && item.queue.waitingPlayers > 0)
    .sort((a, b) => b.queue.waitingPlayers - a.queue.waitingPlayers);

  return (
    <section className="bg-card  p-3.5 space-y-3 shrink-0 overflow-hidden">
      <div className="flex items-center justify-between gap-2" onClick={() => setIsCollapsed((v) => !v)}>
        <h3 className="text-sm font-semibold text-foreground">Queue Watch</h3>
        {/* <div className="flex items-center gap-2">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300">{queuedGames.length} active</span>
          <button
            type="button"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand queue list" : "Collapse queue list"}
            className="h-6 w-6 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cyan-400/40 transition-colors"
          >
            {isCollapsed ? "▸" : "▾"}
          </button>
        </div> */}
      </div>

      {!isCollapsed && (
        <div className="flex flex-wrap gap-2">
          {queuedGames.slice(0, 10).map(({ queue, game }) => (
            <div key={queue.gameId} className="relative group">
              <img
                src={game?.imageUrl}
                alt={game?.name}
                className={`w-14 h-14  object-cover border transition-colors ${
                  queue.isCurrentPlayerQueued
                    ? "border-emerald-400/60 ring-1 ring-emerald-400/40"
                    : "border-white/15 hover:border-cyan-400/50"
                }`}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="whitespace-nowrap rounded bg-black/90 border border-white/15 px-2 py-1 text-[11px] text-foreground shadow-lg">
                  {game?.name}
                  {queue.isCurrentPlayerQueued && (
                    <span className="ml-1.5 text-emerald-400">✓ queued</span>
                  )}
                </div>
                <div className="mx-auto w-1.5 h-1.5 bg-black/90 border-r border-b border-white/15 rotate-45 -mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
