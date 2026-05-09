import { useEffect, useState } from "react";
import { useBucket, useBucketSelector } from "@/actions/bucket";
import { btPrimaryGamePanel, btPrimaryState, btTimeleft, btTimeleftUpdated } from "@/actions/buckets";
import { GameStatus } from "@acosgames/framework";

export function MatchCountdown({ className, durationMs = 5000 }: { className?: string; durationMs?: number }) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [fallbackDeadlineMs, setFallbackDeadlineMs] = useState(() => Date.now() + durationMs);

  useEffect(() => {
    setNowMs(Date.now());
    setFallbackDeadlineMs(Date.now() + durationMs);

    const ticker = window.setInterval(() => {
      setNowMs(Date.now());
    }, 200);

    return () => window.clearInterval(ticker);
  }, [durationMs]);

  const primaryId = useBucket(btPrimaryGamePanel) as string | number | null;
  const gamestate = useBucket(btPrimaryState) as any;
  const timeleft = useBucketSelector(btTimeleft, (bucket) => (bucket as Record<string, any>)[primaryId as any]) as number | undefined;
  useBucket(btTimeleftUpdated);
  const status = gamestate?.room?.status;

  const fallbackMs = Math.max(0, fallbackDeadlineMs - nowMs);
  const bucketMs = typeof timeleft === "number" ? Math.max(0, timeleft) : undefined;
  const effectiveMs = bucketMs && bucketMs > 0 ? bucketMs : fallbackMs;
  const seconds = Math.ceil(effectiveMs / 1000);

  let title: any = {
    [GameStatus.pregame]: "Pregame",
    [GameStatus.starting]: "Starting",
    [GameStatus.gamestart]: "Match is live",
    [GameStatus.waiting]: "Waiting",
  }
  return (
    <div className={className}>
      <p className="flex flex-col items-center justify-center text-sm sm:text-base text-white/90 text-center">
            <span className="font-light text-md sm:text-md text-white uppercase font-acos-logo tracking-widest leading-4 block">
              {title[status] ?? "Live"}
            </span>
            <span className="font-acos-logo block text-lg sm:text-[1.5rem] font-light text-white">
              {seconds > 0 ? seconds : ""}
            </span>

      </p>
    </div>
  );
}
