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
    <div className="fixed bottom-3 left-3  z-60 w-[min(96vw,16rem)] pointer-events-none">
      <div className="pointer-events-auto rounded-lg  bg-slate-950 shadow-md ">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,211,238,0.10),transparent_42%),radial-gradient(circle_at_82%_50%,rgba(56,189,248,0.07),transparent_45%)]" /> */}
        <div className="relative px-2.5 py-2 sm:px-3 sm:py-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative h-8 w-8 shrink-0">
                <span className="absolute inset-0 rounded-full border border-cyan-300/40 animate-ping" />
                <span className="absolute inset-1 rounded-full border-2 border-cyan-400/70 border-t-transparent animate-spin" />
                <span className="absolute inset-2 rounded-full border border-cyan-300/60 border-b-transparent animate-spin" style={{ animationDuration: '1.8s' }} />
                <span className="absolute inset-0 flex items-center justify-center">
                  <BoltIcon className="h-3.5 w-3.5 text-cyan-700" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-cyan-400 truncate">Searching{dots}</p>
                <span className="block text-[10px] text-cyan-400/80 mt-0.5">{queue?.game_slug}</span>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400/70 mt-0.5">
                  <span className="uppercase font-bold">{queue?.mode} match</span>
                  <span> ({queue?.rating ?? "-"})</span>
                  {/* <span>{queues.length} in queue</span> */}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={cancelQueue}
              className="h-7 w-7 shrink-0 rounded-full border border-cyan-300/30 bg-slate-950 text-cyan-400/80 hover:text-cyan-200 hover:border-cyan-400/60 transition-colors flex items-center justify-center"
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
