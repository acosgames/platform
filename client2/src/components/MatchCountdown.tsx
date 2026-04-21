import { useBucket, useBucketSelector } from "@/actions/bucket";
import { btGame, btPrimaryGamePanel, btTimeleft, btTimeleftUpdated } from "@/actions/buckets";
import { GameStatus } from "@acosgames/framework";

export function MatchCountdown({ className }: { className?: string }) {
  useBucket(btTimeleftUpdated); // subscribe to timeleft updates

  const primaryId = useBucket(btPrimaryGamePanel) as string | number | null;
  const gamestate = useBucket(btGame) as any;
  const timeleft = useBucketSelector(btTimeleft, (bucket) => (bucket as Record<string, any>)[primaryId as any]) as number | undefined;
  const timeupdated = useBucket(btTimeleftUpdated) as number | undefined;
  const status = gamestate?.room?.status;
  const seconds = Math.ceil((timeleft ?? 0) / 1000);

  let title:any = {
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
