import { useEffect, useState } from "react";
import { BoltIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useBucket } from "@/actions/bucket";
import { btQueues, type QueueEntry } from "@/actions/buckets";
import { clearGameQueues } from "@/actions/queue";
import { wsLeaveQueue } from "@/actions/ws";



export function MatchmakingQueueIndicator() {
  const queues = (useBucket(btQueues) as QueueEntry[] | undefined) || [];
  const queue = queues[0];
  const isActive = queues.length > 0;

  const [dotStep, setDotStep] = useState(0);

  const cancelQueue = () => {
    wsLeaveQueue();
    clearGameQueues();
  };

  useEffect(() => {
    if (!isActive) return;

    const dots = window.setInterval(() => setDotStep((step) => (step + 1) % 4), 450);

    return () => {
      window.clearInterval(dots);
    };
  }, [isActive]);

  const dots = ".".repeat(dotStep);

  if (!isActive || !queue) return null;

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
                <p className="text-sm font-semibold text-white truncate">Searching for {queue?.name}{dots}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-white/75">
                  <span>Mode {queue?.mode}</span>
                  <span>Rating {queue?.rating ?? "-"}</span>
                  <span>{queues.length} in queue</span>
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
