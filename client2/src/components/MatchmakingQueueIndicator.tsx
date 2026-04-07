import { useEffect, useMemo, useState } from "react";
import { BoltIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useMatchmakingQueue } from "../context/MatchmakingQueueContext";

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function MatchmakingQueueIndicator() {
  const { queue, cancelQueue } = useMatchmakingQueue();
  const [now, setNow] = useState(Date.now());
  const [dotStep, setDotStep] = useState(0);

  useEffect(() => {
    if (!queue.active) return;

    const ticker = window.setInterval(() => setNow(Date.now()), 1000);
    const dots = window.setInterval(() => setDotStep((step) => (step + 1) % 4), 450);

    return () => {
      window.clearInterval(ticker);
      window.clearInterval(dots);
    };
  }, [queue.active]);

  const elapsedSeconds = useMemo(() => {
    if (!queue.active || !queue.queuedAt) return 0;
    return Math.max(0, Math.floor((now - queue.queuedAt) / 1000));
  }, [now, queue.active, queue.queuedAt]);

  const etaRemaining = Math.max(0, queue.etaSeconds - elapsedSeconds);
  const dots = ".".repeat(dotStep);

  if (!queue.active) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-60 w-[min(92vw,34rem)] -translate-x-1/2 pointer-events-none">
      <div className="pointer-events-auto rounded-md border border-cyan-300/35 bg-linear-to-r from-slate-950/96 via-slate-900/96 to-cyan-950/96 backdrop-blur-xl shadow-[0_18px_48px_rgba(0,0,0,0.45),0_0_30px_rgba(34,211,238,0.25)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.2),transparent_42%),radial-gradient(circle_at_82%_50%,rgba(56,189,248,0.15),transparent_45%)]" />
        <div className="relative p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 shrink-0">
                <span className="absolute inset-0 rounded-full border border-cyan-300/40 animate-ping" />
                <span className="absolute inset-1 rounded-full border-2 border-cyan-300/60 border-t-transparent animate-spin" />
                <span className="absolute inset-2 rounded-full border border-cyan-100/60 border-b-transparent animate-spin" style={{ animationDuration: "1.8s" }} />
                <span className="absolute inset-0 flex items-center justify-center">
                  <BoltIcon className="h-4 w-4 text-cyan-200" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/80">Matchmaking Queue</p>
                <p className="text-sm font-semibold text-white truncate">Searching for {queue.gameName}{dots}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-white/75">
                  <span>Queued {formatDuration(elapsedSeconds)}</span>
                  <span>ETA {formatDuration(etaRemaining)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={cancelQueue}
              className="h-8 w-8 shrink-0 rounded-full border border-white/15 bg-black/30 text-white/75 hover:text-white hover:border-cyan-300/45 transition-colors flex items-center justify-center"
              aria-label="Leave matchmaking queue"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
