import { useBucket, useBucketSelector } from "@/actions/bucket";
import { btQueues } from "@/actions/buckets";
import { joinGame } from "@/actions/game";
// import { useMatchmakingQueue } from "@/context/MatchmakingQueueContext";

import { PlayIcon } from "@heroicons/react/24/solid";
// import { useNavigate } from "react-router";


export function PlayNow({ game_slug, name }: { game_slug: string; name: string }) {

    const queues = useBucket(btQueues);

    // const navigate = useNavigate();
    // const { enqueue } = useMatchmakingQueue();

    const handlePlayNow = () => {
        joinGame(game_slug, false);
        // enqueue({ game_slug, name });
        // navigate(`/game/${game_slug}/play`);
    };


    return (<div className="relative">
        <span className="absolute -inset-2 rounded-[1.8rem]  to-transparent blur-2xl opacity-90 group-hover:opacity-100" />
        <button
            type="button"
            onClick={handlePlayNow}
            className="group relative inline-flex items-center gap-3 h-13 px-4 sm:px-5 rounded-[1.35rem] border border-lime-200 ring-2 ring-lime-300 text-white bg-linear-to-br from-gray-800 via-gray-950 to-gray-800 shadow-[0_18px_12px_rgba(0,0,0,0.52),0_0_8px_rgba(91,141,255,0.40)] hover:shadow-[0_10px_16px_rgba(0,0,0,0.56),0_0_12px_rgba(91,141,141,0.60)] hover:ring-lime-500 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.985] overflow-hidden"
        >
            <span className="pointer-events-none absolute inset-0 bg-linear-to-r from-secondary/0 via-white/10 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="pointer-events-none absolute -left-14 top-0 h-full w-12 bg-linear-to-r from-transparent via-white/60 to-transparent rotate-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-72 transition-all duration-700" />
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 border-white/30 shadow-[0_0_12px_rgba(91,141,255,0.65)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110 shrink-0">
                <PlayIcon className="h-4 w-4 text-slate-950" />
            </span>
            <span className="flex flex-col gap-1 leading-[1.02] text-left transition-transform duration-300 group-hover:translate-x-0.5">
                <span>Play Now</span>
                <span className="text-[9px] font-bold tracking-[0.16em] text-lime-300 uppercase">Competitive Match</span>
            </span>
        </button>
        {/* <span className="absolute -top-2 -right-2 z-20 rounded-full bg-rose-500 text-white text-[9px] px-1.5 py-0.5 tracking-wide shadow-[0_0_12px_rgba(244,63,94,0.7)]">
              LIVE
            </span> */}
    </div>)
}