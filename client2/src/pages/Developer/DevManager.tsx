import { useEffect } from "react";
import { findDevGames } from "../../actions/devgame";
import { btDevGames, btUser } from "../../actions/buckets";
import { useBucket } from "../../actions/bucket";
import DevGameListItem from "./DevGameListItem";
import { Link } from "react-router";
import { PlusIcon } from "@heroicons/react/24/solid";

export function DevManager() {
    const user = useBucket(btUser) as any;
    const games = useBucket(btDevGames) as any[];

    useEffect(() => {
        if (user) findDevGames(user.id);
    }, [user]);

    return (
        <div className="space-y-4 pb-4">
            {/* Back nav */}
            <div className="flex items-start justify-between gap-3">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-md bg-slate-900/85 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-slate-900"
                >
                    ← Back to Games
                </Link>
            </div>

            {/* Hero */}
            <section className="relative rounded-xl overflow-hidden shadow-md border-8 border-white">
                <div className="relative px-5 py-5 lg:px-7 lg:py-6 bg-slate-950 text-white rounded-xl">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-[1.5rem] font-black uppercase tracking-tight text-white sm:text-[2rem]">
                                Developer Portal
                            </h1>
                            <p className="mt-1 text-sm text-white/60">
                                {user?.displayname ?? "Your Games"} · {games.length} game{games.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors shrink-0">
                            <PlusIcon className="w-4 h-4" />
                            New Game
                        </button>
                    </div>
                </div>
            </section>

            {/* Games grid */}
            <section className="bg-white rounded-xl shadow-md p-5">
                {games.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">No games found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {games.map((game: any) => (
                            <DevGameListItem
                                key={"devgameitem-" + game.gameid}
                                {...game}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
