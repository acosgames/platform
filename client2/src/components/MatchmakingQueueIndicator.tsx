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
    <div className="fixed bottom-3 left-3 drop-shadow-md z-60 w-[min(96vw,16rem)] pointer-events-none">
      <div className="pointer-events-auto rounded-xl bg-slate-950 shadow-md ring-1 ring-white/10 ">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.10),transparent_42%),radial-gradient(circle_at_82%_50%,rgba(56,189,248,0.07),transparent_45%)]" /> */}
        <div className="relative px-2.5 py-2 sm:px-3 sm:py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute inset-0 rounded-full border border-white/25 animate-ping" />
                <span className="absolute inset-1 rounded-full border-2 border-blue-300/75 border-t-transparent animate-spin" />
                <span className="absolute inset-2 rounded-full border border-slate-300/60 border-b-transparent animate-spin" style={{ animationDuration: '1.8s' }} />
                <span className="absolute inset-0 flex items-center justify-center">
                  <BoltIcon className="h-3.5 w-3.5 text-blue-100" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Searching{dots}</p>
                <span className="block text-[10px] text-blue-100/90 mt-0.5">{queue?.game_slug}</span>
                <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-0.5">
                  <span className="uppercase font-bold">{queue?.mode} match</span>
                  <span> ({queue?.rating ?? "-"})</span>
                  {/* <span>{queues.length} in queue</span> */}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={cancelQueue}
              className="h-7 w-7 shrink-0 rounded-full border border-white/20 bg-white/5 text-slate-200 hover:text-white hover:border-white/40 hover:bg-white/10 transition-colors flex items-center justify-center"
              aria-label="Leave matchmaking queue"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
