import { btGame } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";

// ─── Progress calculation (ported from client AchievementPanel.jsx) ──────────

type AchievementData = Record<string, any>;

function calculateStatProgress(
    goal_valueTYPE: number,
    goal_valueINT: number,
    goal_valueFLOAT: number,
    stat_valueINT: number,
    stat_valueFLOAT: number,
    times_in_a_row: number,
    played: number
): { value: number; maxValue: number; percent: number } | false {
    times_in_a_row = Math.max(0, times_in_a_row);
    if (Number.isInteger(times_in_a_row) && times_in_a_row > 0) {
        const value = played || 0;
        const maxValue = times_in_a_row;
        return { value, maxValue, percent: (value / maxValue) * 100 };
    }
    switch (goal_valueTYPE) {
        case 0: case 3: case 4: {
            const maxValue = goal_valueINT;
            const value = Math.min(stat_valueINT || 0, maxValue);
            return { value, maxValue, percent: (value / maxValue) * 100 };
        }
        case 1: case 2: {
            const maxValue = goal_valueFLOAT;
            const value = Math.min(stat_valueFLOAT || 0, maxValue);
            return { value, maxValue, percent: (value / maxValue) * 100 };
        }
    }
    return false;
}

function calculateAchievementProgress(achievement: AchievementData, progress: AchievementData) {
    const {
        stat_slug1, goal1_valueTYPE, goal1_valueINT, goal1_valueFLOAT,
        stat_slug2, goal2_valueTYPE, goal2_valueINT, goal2_valueFLOAT,
        stat_slug3, goal3_valueTYPE, goal3_valueINT, goal3_valueFLOAT,
        all_required, times_in_a_row,
    } = achievement;

    const {
        stat1_valueINT, stat1_valueFLOAT,
        stat2_valueINT, stat2_valueFLOAT,
        stat3_valueINT, stat3_valueFLOAT,
        played,
    } = progress;

    if (Number.isInteger(times_in_a_row) && times_in_a_row > 0) {
        const value = played || 0;
        const maxValue = times_in_a_row;
        return { value, maxValue, percent: (value / maxValue) * 100 };
    }

    const status: Array<{ value: number; maxValue: number; percent: number }> = [];

    if (stat_slug1) {
        const r = calculateStatProgress(goal1_valueTYPE, goal1_valueINT, goal1_valueFLOAT, stat1_valueINT, stat1_valueFLOAT, times_in_a_row, played);
        if (r) status.push(r);
    }
    if (stat_slug2) {
        const r = calculateStatProgress(goal2_valueTYPE, goal2_valueINT, goal2_valueFLOAT, stat2_valueINT, stat2_valueFLOAT, times_in_a_row, played);
        if (r) status.push(r);
    }
    if (stat_slug3) {
        const r = calculateStatProgress(goal3_valueTYPE, goal3_valueINT, goal3_valueFLOAT, stat3_valueINT, stat3_valueFLOAT, times_in_a_row, played);
        if (r) status.push(r);
    }

    if (status.length === 0) return { value: 0, maxValue: 1, percent: 0 };

    let value: number;
    let maxValue: number;

    if (!all_required) {
        value = status.reduce((t, c) => t + c.value, 0);
        maxValue = status.reduce((t, c) => c.maxValue >= t ? c.maxValue : t, 0);
    } else {
        value = status.reduce((t, c) => t + Math.min(c.value, c.maxValue), 0);
        maxValue = status.reduce((t, c) => t + c.maxValue, 0);
    }

    if (Number.isNaN(value)) value = 0;
    if (Number.isNaN(maxValue)) maxValue = 1;

    return { value, maxValue, percent: (value / maxValue) * 100 };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AchievementCard({ achievement }: { achievement: AchievementData }) {
    const { value, maxValue, percent } = calculateAchievementProgress(achievement, achievement);
    const done = percent >= 100;
    const inProgress = percent > 0 && !done;

    const barColor = done ? "bg-emerald-500" : inProgress ? "bg-blue-500" : "bg-slate-300";
    const borderColor = done ? "border-emerald-200" : inProgress ? "border-blue-200" : "border-slate-100";
    const badgeBg = done ? "bg-emerald-50 text-emerald-700" : inProgress ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500";

    return (
        <div className={`relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${borderColor}`}>
            {/* Completion accent */}
            {done && <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400" />}
            {inProgress && <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-400" />}

            <div className="flex items-start gap-3">
                {/* Icon placeholder */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-black ${done ? "bg-emerald-100 text-emerald-600" : inProgress ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
                    {done ? "✓" : (achievement.achievement_icon ?? "★")}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{achievement.achievement_name ?? achievement.name}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 line-clamp-2">{achievement.achievement_description ?? achievement.description}</p>
                        </div>

                        {/* XP reward */}
                        {achievement.award_xp != null && (
                            <div className={`shrink-0 rounded-lg px-2 py-1 text-center text-[10px] font-bold leading-tight ${done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                <div className="text-sm font-black">{achievement.award_xp}</div>
                                <div>XP</div>
                            </div>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2.5">
                        <div className="mb-1 flex items-center justify-between gap-2">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeBg}`}>
                                {done ? "Completed" : inProgress ? "In Progress" : "Locked"}
                            </span>
                            {!done && maxValue > 1 && (
                                <span className="text-[10px] font-semibold text-slate-400">
                                    {Math.min(value, maxValue)} / {maxValue}
                                </span>
                            )}
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className={`h-full rounded-full transition-all ${barColor}`}
                                style={{ width: `${Math.min(100, percent)}%` }}
                            />
                        </div>
                    </div>

                    {/* Claimed badge */}
                    {achievement.claimed && (
                        <p className="mt-1.5 text-[10px] font-semibold text-emerald-600">✔ Reward claimed</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

export function AchievementsTab() {
    const game = useBucket(btGame) as GameInfoFull | null;
    const achievements: AchievementData[] = (game as any)?.achievements ?? [];

    const completed = achievements.filter((a) => calculateAchievementProgress(a, a).percent >= 100).length;
    const inProgress = achievements.filter((a) => {
        const { percent } = calculateAchievementProgress(a, a);
        return percent > 0 && percent < 100;
    }).length;

    if (achievements.length === 0) {
        return (
            <div className="flex min-h-40 items-center justify-center rounded-xl bg-white p-8 shadow-md">
                <p className="text-sm font-semibold text-slate-400">No achievements found for this game.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Summary header */}
            <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-md">
                <div className="absolute inset-x-0 top-0 h-px" />
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Achievements</p>
                        <p className="text-2xl font-black text-slate-900">{achievements.length} <span className="text-sm font-semibold text-slate-400">total</span></p>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">Completed</p>
                        <p className="text-xl font-black text-emerald-600">{completed}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-600">In Progress</p>
                        <p className="text-xl font-black text-blue-600">{inProgress}</p>
                    </div>
                    {/* Overall progress bar */}
                    <div className="flex-1 min-w-32">
                        <div className="mb-1 flex justify-between text-[10px] font-semibold text-slate-400">
                            <span>Overall progress</span>
                            <span>{Math.round((completed / achievements.length) * 100)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${(completed / achievements.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievement grid */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {achievements.map((a, i) => (
                    <AchievementCard key={a.achievement_slug ?? a.id ?? i} achievement={a} />
                ))}
            </div>
        </div>
    );
}
