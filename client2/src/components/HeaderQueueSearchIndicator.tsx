import { useEffect, useState } from "react";
import { BoltIcon, XMarkIcon } from "@heroicons/react/24/solid";

import { useBucket } from "@/actions/bucket";
import { btQueues, type QueueEntry } from "@/actions/buckets";
import { clearGameQueues } from "@/actions/queue";
import { wsLeaveQueue } from "@/actions/ws";

export function HeaderQueueSearchIndicator() {
  const queues = (useBucket(btQueues) as QueueEntry[] | undefined) || [];
  const queue = queues[0];
  const isActive = queues.length > 0;

  const [dotStep, setDotStep] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const intervalId = window.setInterval(() => {
      setDotStep((step) => (step + 1) % 4);
    }, 450);

    return () => window.clearInterval(intervalId);
  }, [isActive]);

  if (!isActive || !queue) return null;

  const dots = ".".repeat(dotStep);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-sm">
      <div className="pointer-events-auto flex  items-center rounded-full bg-slate-600 gap-3 p-1 ">
        <span className="relative h-4 w-4 shrink-0 ml-2">
          <span className="absolute inset-0 rounded-full border border-white/50 animate-ping" />
          <span className="absolute inset-0 rounded-full border border-blue-300/90 border-t-transparent animate-spin" style={{ animationDuration: "1.2s" }} />
          <span className="absolute inset-0 flex items-center justify-center">
            <BoltIcon className="h-2.5 w-2.5 text-blue-100" />
          </span>
        </span>

        <span className="truncate text-[11px] font-semibold tracking-wide text-white flex-1 p-1">
          Searching for match
          <span className="inline-flex w-3">{dots}</span>
          {/* <span className="ml-1 text-blue-100/90">{queue.game_slug}</span>
          <span className="ml-1 text-white/70">{queue.mode}</span> */}
        </span>

        <button
          type="button"
          onClick={() => {
            wsLeaveQueue();
            clearGameQueues();
          }}
          className="mr-1 pointer-events-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full   text-white/85 transition-colors hover:border-white/45 hover:bg-white/15 hover:text-white"
          aria-label="Leave matchmaking queue"
          title="Leave queue"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
