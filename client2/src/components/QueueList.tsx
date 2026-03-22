import { useState } from "react";
import { gameQueues, games } from "../data/mockData";

export function QueueList() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const gameById = new Map(games.map((game) => [game.id, game]));

  const queuedGames = gameQueues
    .map((queue) => ({ queue, game: gameById.get(queue.gameId) }))
    .filter((item) => item.game && item.queue.waitingPlayers > 0)
    .sort((a, b) => b.queue.waitingPlayers - a.queue.waitingPlayers);

  const playerQueues = queuedGames.filter((item) => item.queue.isCurrentPlayerQueued);

  return (
    <section className="rounded-lg border border-slate-300/65 dark:border-white/20 
    bg-linear-to-b from-slate-50/95 to-slate-100/90 dark:from-gray-950 dark:to-black 
    backdrop-blur-sm ring-1 ring-slate-300/40 
    dark:ring-white/5 p-3.5 space-y-3 shrink-0 overflow-hidden 
    shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.32)]">
      <div className="flex items-center justify-between gap-2" onClick={() => setIsCollapsed((v) => !v)}>
        <h3 className="text-sm font-semibold text-foreground">Queue Watch</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-cyan-700 dark:text-cyan-300">{queuedGames.length} active</span>
          <button
            type="button"
            // onClick={() => setIsCollapsed((v) => !v)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand queue list" : "Collapse queue list"}
            className="h-6 w-6 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cyan-400/40 transition-colors"
          >
            {isCollapsed ? "▸" : "▾"}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1 panel-scrollbar">
            {queuedGames.slice(0, 5).map(({ queue, game }) => (
              <div key={queue.gameId} className="rounded-md border border-white/10 bg-black/15 px-2.5 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={game?.imageUrl}
                      alt={game?.name}
                      className="w-8 h-8 rounded object-cover border border-white/15 shrink-0"
                    />
                    <p className="text-xs font-medium text-foreground truncate">{game?.name}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">~{queue.averageWaitMinutes}m</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] text-cyan-700 dark:text-cyan-300">{queue.waitingPlayers} waiting</span>
                  {queue.isCurrentPlayerQueued ? (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      You queued
                    </span>
                  ) : (
                    <span className="text-[11px] text-white/45">Not queued</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 border-t border-white/10">
            <p className="text-[11px] text-muted-foreground mb-1">Your queue entries</p>
            {playerQueues.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {playerQueues.map(({ queue, game }) => (
                  <span
                    key={`me-${queue.gameId}`}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 border border-cyan-400/25"
                  >
                    {game?.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-white/45">You are not in any queue.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
