import { useState } from "react";
import { gameQueues, games } from "../data/mockData";

import { btGames, btParty, btQueues, btQueueStats, type QueueEntry } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
import type { GameQueue, PartyQueue, QueueStats } from "shared/types/queue";
import config from "../config";
import { wsJoinGame } from "@/actions/ws";

// Dummy join handler (replace with real join logic)
function joinQueue(queue: GameQueue) {
  // TODO: Replace with actual join logic (e.g., wsJoinQueues or addJoinQueues)
  wsJoinGame(queue.mode, queue.game_slug);
}

export function QueueList() {
  // const gameById = new Map(games.map((game) => [game.id, game]));

  const games: Record<string, any> = useBucket(btGames) || {};
  const queueStats:Record<string, QueueStats> = useBucket(btQueueStats) || {};
  const party: PartyQueue | null = useBucket(btParty) || null;

  let queueMap: Record<string, boolean> = {};
  let totalPlayers = 0;
  const queuedGames = party?.queues
    .map((queue) => {
      queue.game = games[queue.game_slug];

      let key = queue.mode + '/' + queue.game_slug;
      queue.imageUrl = `${config.https.cdn}g/${queue.game_slug}/preview/${queue?.preview_images}`;
      queue.waitingPlayers = queueStats?.[key]?.waitingPlayers || 0;
      totalPlayers += queue.waitingPlayers;
      queueMap[key] = true;
      return queue;
    })
    .sort((a, b) => (b?.waitingPlayers ?? 0) - (a?.waitingPlayers ?? 0)) || [];

  const queuedOpen: GameQueue[] = [];
  for(let key in queueStats) {
    let [mode, game_slug] = key.split('/');
    if( key in queueMap) continue;
    let imageUrl = `${config.https.cdn}g/${game_slug}/preview/${queueStats[key]?.preview_images}`;
    let queue:GameQueue = {...queueStats[key], mode, game_slug, imageUrl};
    totalPlayers += queue?.waitingPlayers ?? 0;

    queuedOpen.push(queue);
  }

  return (
    <section className="flex w-full overflow-hidden h-full min-h-0 flex-col p-1 sm:p-1">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">Queue Watch</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
          {totalPlayers} players
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto panel-scrollbar2">
        <ul className="flex flex-col gap-2">
          {queuedGames.map((queue) => (
            <li
              key={queue.game_slug}
              className={`flex items-center gap-3 rounded-xl bg-white px-2 py-2 shadow-md 
                transition-colors hover:border-cyan-400 border-emerald-400/80 ring-1 ring-emerald-300 bg-emerald-50/40"`}
            >
              <img
                src={queue.imageUrl ?? "https://via.placeholder.com/48x48?text=No+Image"}
                alt={queue.name}
                className="h-12 w-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-slate-900 text-sm">{queue.name}</div>
                <div className="text-xs text-slate-500">{queue.waitingPlayers} player{queue.waitingPlayers !== 1 ? "s" : ""} waiting</div>
              </div>
                <span className="ml-2 text-emerald-500 text-xs font-semibold">✓</span>
            </li>
          ))}
          {queuedOpen.map((queue) => (
            <li
              key={queue.game_slug}
              className={`flex items-center gap-3 rounded-xl bg-white px-2 py-2 shadow-md 
                transition-colors hover:border-cyan-400 border-slate-200"`}
            >
              <img
                src={queue?.imageUrl ?? "https://via.placeholder.com/48x48?text=No+Image"}
                alt={queue?.name ?? ""}
                className="h-12 w-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-slate-900 text-sm">{queue.name}</div>
                <div className="text-xs text-slate-500">{queue.waitingPlayers} player{queue.waitingPlayers !== 1 ? "s" : ""} waiting</div>
              </div>
              <button
                type="button"
                onClick={() => joinQueue(queue)}
                className="ml-2 rounded-lg   bg-blue-700 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-500 hover:text-slate-50 transition-colors"
              >
                Join
              </button>
            </li>
          ))}
          {queuedGames.length === 0 && queuedOpen.length === 0 ? (
            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 text-center">
              No active queues right now.
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
