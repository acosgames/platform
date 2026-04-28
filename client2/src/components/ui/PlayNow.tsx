import { joinGame } from "@/actions/game";
// import { useMatchmakingQueue } from "@/context/MatchmakingQueueContext";

import { PlayIcon } from "@heroicons/react/24/solid";
// import { useNavigate } from "react-router";


export function PlayNow({ game_slug, name: _name }: { game_slug: string; name: string }) {

    // const navigate = useNavigate();
    // const { enqueue } = useMatchmakingQueue();

    const handlePlayNow = () => {
        joinGame(game_slug, false);
        // enqueue({ game_slug, name });
        // navigate(`/game/${game_slug}/play`);
    };


    return (<div className="group relative inline-flex">
        {/* <span className="pointer-events-none absolute -inset-2 rounded-full  blur-2xl opacity-70 transition-opacity duration-300 group-hover:opacity-100" /> */}
        <button
            type="button"
            onClick={handlePlayNow}
            className="play-now-shine relative inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-white/35 bg-linear-to-r from-[#2458d3] via-[#1d4db8] to-[#0f172a] px-4 py-2 font-bold text-white shadow-[0px_10px_20px_rgba(15,23,42,0.24)] outline-none transition-all duration-300 hover:scale-[1.03] hover:border-sky-200/75 active:scale-[0.985]"
        >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/95 text-[#1d4db8] shadow-[0_0_12px_rgba(255,255,255,0.28)] transition-transform duration-300 group-hover:translate-x-0.5">
                <PlayIcon className="h-4.5 w-4.5" />
            </span>
            <span className="flex flex-col gap-0.5 text-left leading-none">
                <span className="text-sm font-bold sm:text-[15px]">Play Now</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-100/90">Competitive Match</span>
            </span>
        </button>
        {/* <span className="absolute -top-2 -right-2 z-20 rounded-full bg-rose-500 text-white text-[9px] px-1.5 py-0.5 tracking-wide shadow-[0_0_12px_rgba(244,63,94,0.7)]">
              LIVE
            </span> */}
    </div>)
}