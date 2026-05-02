import {
    btAchievementForm,
    btAchievementIconId,
    btDevGame,
    btEditAchievement,
    btShowCreateAchievement,
} from "../../../actions/buckets";
import { PencilIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { EditAchievement } from "./ModalEditAchievement";

const VALUE_TYPE_NAMES: Record<number, string> = {
    0: "Integer",
    1: "Float",
    2: "Average",
    3: "Time",
};

export default function TabStatsAndAchievements() {
    const devgame = btDevGame.get() as any;
    const achievements: any[] = devgame?.achievements || [];
    const stats: any[] = devgame?.stats || [];

    if (!devgame?.stats) return null;

    return (
        <>
        <EditAchievement />
        <div className="grid grid-cols-1 lg:grid-cols-[0.3fr_0.7fr] gap-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Stats</h3>
                <div className="flex flex-col gap-4">
                    {stats.map((stat) => (
                        <StatDisplay key={"stat-display-" + stat.stat_slug} {...stat} />
                    ))}
                </div>
            </div>

            {/* Achievements */}
            <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Achievements</h3>
                    <button
                        onClick={() => {
                            btShowCreateAchievement.set(true);
                            btAchievementIconId.set(0);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition w-fit"
                    >
                        Create New
                    </button>
                </div>

                <div className="flex flex-col gap-0">
                    {achievements.map((a) => (
                        <div
                            key={"dev-achievement-panel-" + a.achievement_slug}
                            className="relative"
                        >
                            {/* Edit button */}
                            <button
                                title="Edit"
                                className="absolute top-2 right-2 z-10 p-1 rounded bg-slate-900/60 hover:bg-slate-900/80 text-white transition"
                                onClick={() => {
                                    btAchievementForm.set({});
                                    btShowCreateAchievement.set(true);
                                    btEditAchievement.set(a);
                                    btAchievementIconId.set(a?.achievement_icon);
                                }}
                            >
                                <PencilIcon className="w-4 h-4" />
                            </button>
                            {/* Duplicate button */}
                            <button
                                title="Duplicate"
                                className="absolute top-9 right-2 z-10 p-1 rounded bg-slate-900/60 hover:bg-slate-900/80 text-white transition"
                                onClick={() => {
                                    btAchievementForm.set({});
                                    btShowCreateAchievement.set(true);
                                    const newForm = { ...a };
                                    if (newForm?.achievement_slug) delete newForm.achievement_slug;
                                    btAchievementForm.assign(newForm);
                                    btAchievementIconId.set(a?.achievement_icon);
                                }}
                            >
                                <DocumentDuplicateIcon className="w-3 h-3" />
                            </button>
                            <AchievementRow achievement={a} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}

function AchievementRow({ achievement }: { achievement: any }) {
    const { achievement_name, achievement_description, achievement_slug } = achievement;
    return (
        <div className="bg-white rounded-xl shadow-md p-4 mb-2 pr-12">
            <p className="text-sm font-semibold text-slate-900">{achievement_name}</p>
            <p className="text-xs text-slate-500">{achievement_description}</p>
            <p className="text-xs text-slate-400 mt-1">{achievement_slug}</p>
        </div>
    );
}

function StatDisplay({
    stat_name,
    stat_desc,
    stat_abbreviation,
    isactive,
    scoreboard,
    stat_order,
    valueTYPE,
}: any) {
    const typeName = VALUE_TYPE_NAMES[valueTYPE] ?? "n/a";

    return (
        <div className="flex flex-col gap-1 pb-4 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{stat_name}</span>
                <span className="text-xs text-slate-400">({stat_abbreviation})</span>
            </div>
            <p className="text-xs text-slate-500">{stat_desc}</p>
            <div className="flex gap-3 text-xs text-slate-400 mt-1">
                <span>Type: {typeName}</span>
                <span>Order: {stat_order}</span>
                {scoreboard === 1 && (
                    <span className="text-blue-600">Scoreboard</span>
                )}
                {isactive ? (
                    <span className="text-green-600">Active</span>
                ) : (
                    <span className="text-slate-300">Inactive</span>
                )}
            </div>
        </div>
    );
}
