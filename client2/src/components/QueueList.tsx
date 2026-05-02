import { useState } from "react";
import { gameQueues, games } from "../data/mockData";

export function QueueList() {
  const gameById = new Map(games.map((game) => [game.id, game]));

  const queuedGames = gameQueues
    .map((queue) => ({ queue, game: gameById.get(queue.gameId) }))
    .filter((item) => item.game && item.queue.waitingPlayers > 0)
    .sort((a, b) => b.queue.waitingPlayers - a.queue.waitingPlayers);

  return (
    <section className="flex h-full min-h-0 flex-col p-3 sm:p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Queue Watch</h3>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
          {queuedGames.length} Active
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto panel-scrollbar pr-1">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {queuedGames.slice(0, 10).map(({ queue, game }) => (
            <div key={queue.gameId} className="relative group">
              <img
                src={game?.imageUrl}
                alt={game?.name}
                className={`h-14 w-14 rounded-md object-cover border transition-colors ${
                  queue.isCurrentPlayerQueued
                    ? "border-emerald-400/80 ring-1 ring-emerald-300"
                    : "border-slate-300 hover:border-cyan-400"
                }`}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="whitespace-nowrap rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 shadow-lg">
                  {game?.name}
                  {queue.isCurrentPlayerQueued && (
                    <span className="ml-1.5 text-emerald-400">✓ queued</span>
                  )}
                </div>
                <div className="mx-auto -mt-1 h-1.5 w-1.5 rotate-45 border-r border-b border-slate-200 bg-white" />
              </div>
            </div>
          ))}
          {queuedGames.length === 0 ? (
            <p className="col-span-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              No active queues right now.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
