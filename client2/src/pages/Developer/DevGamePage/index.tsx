import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { clearGameFields, findGame, updateGame } from "../../../actions/devgame";
import { useBucket } from "../../../actions/bucket";
import { btDevGame, btFormFields } from "../../../actions/buckets";
import { ArrowTopRightOnSquareIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import FSGSubmit from "../../../components/inputs/FSGSubmit";
import TabPageInfo from "./TabPageInfo";
import TabPublishing from "./TabPublishing";
import TabGameSettings from "./TabGameSettings";
import TabStatsAndAchievements from "./TabStatsAndAchievements";

const TABS = ["Game Info", "Publishing", "Settings", "Achievements"] as const;
const TAB_HASHES = ["#gameinfo", "#publishing", "#settings", "#stats"];

export function DevGamePage() {
    const params = useParams<{ game_slug: string }>();
    const navigate = useNavigate();
    const { hash } = useLocation();
    const game = useBucket(btDevGame) as any;
    const game_slug = game?.game_slug;

    const defaultTabIndex = TAB_HASHES.indexOf(hash) >= 0 ? TAB_HASHES.indexOf(hash) : 0;
    const [activeTab, setActiveTab] = useState(defaultTabIndex);

    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const pullGame = async () => {
        clearGameFields();
        const slug = params.game_slug!;
        const loadedGame = await findGame(slug);
        if (!loadedGame) return;

        const group = "update-game_info";
        const form = btFormFields.get();
        const formGroup = (form[group] = { ...loadedGame });
        btFormFields.assign({ [group]: formGroup });
    };

    useEffect(() => {
        pullGame();
    }, []);

    const onRefresh = async () => {
        await pullGame();
    };

    const onSubmit = async () => {
        try {
            const saved = await updateGame();
            if (!saved) {
                setToast({ text: "Fix errors to continue", ok: false });
                return;
            }
            setToast({ text: "Successfully saved", ok: true });
        } catch (e) {
            console.error(e);
        }
    };

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        navigate(TAB_HASHES[index], { replace: true, preventScrollReset: true });
    };

    return (
        <div className="space-y-4 pb-4">
            {toast && (
                <div
                    className={[
                        "fixed top-6 right-6 px-5 py-3 rounded-lg text-white text-sm shadow-lg z-50",
                        toast.ok ? "bg-green-700" : "bg-red-700",
                    ].join(" ")}
                >
                    {toast.text}
                </div>
            )}

            {/* Back nav */}
            <div className="flex items-start justify-between gap-3">
                <Link
                    to="/dev"
                    className="inline-flex items-center gap-2 rounded-md bg-slate-900/85 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-slate-900"
                >
                    ← Manage Games
                </Link>
            </div>

            {/* Hero */}
            <section className="relative rounded-xl overflow-hidden shadow-md border-8 border-white">
                <div className="relative px-5 py-5 lg:px-7 lg:py-6 bg-slate-950 text-white rounded-xl">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-[1.5rem] font-black uppercase tracking-tight text-white sm:text-[2rem] truncate">
                                {game?.name ?? "Loading…"}
                            </h1>
                            <p className="mt-0.5 text-[11px] font-medium text-white/50 uppercase tracking-widest">
                                {game?.game_slug}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Link
                                to={`/game/${game_slug}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[10px] font-semibold text-white hover:border-white/40 transition"
                            >
                                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                                Public Page
                            </Link>
                            <button
                                onClick={onRefresh}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-3 py-1 text-[10px] font-semibold text-white hover:border-white/40 transition"
                            >
                                <ArrowPathIcon className="w-3.5 h-3.5" />
                                Refresh
                            </button>
                            <FSGSubmit
                                title="Save Changes"
                                loadingTitle="Saving…"
                                onClick={onSubmit}
                                className="rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tab nav */}
            <div className="w-full rounded-xl bg-white shadow-md overflow-x-auto">
                <div className="flex items-center gap-1 p-3 sm:p-4 sm:py-3 whitespace-nowrap">
                    {TABS.map((tab, i) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(i)}
                            className={[
                                "h-8 rounded-lg px-4 text-sm font-semibold transition-colors",
                                activeTab === i
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
                            ].join(" ")}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <section>
                {activeTab === 0 && <TabPageInfo />}
                {activeTab === 1 && <TabPublishing />}
                {activeTab === 2 && <TabGameSettings />}
                {activeTab === 3 && <TabStatsAndAchievements />}
            </section>
        </div>
    );
}
