import { useEffect, useState } from "react";
import { useBucket, useBucketSelector } from "@/actions/bucket";
import {
    btAchievementForm,
    btAchievementFormErrors,
    btAchievements,
    btDevGame,
    btDevGameError,
    btEditAchievement,
    btShowCreateAchievement,
} from "@/actions/buckets";
import { createOrEditAchievement } from "@/actions/devgame";
import { showToast } from "@/actions/toast";
import FSGTextInput from "@/components/inputs/FSGTextInput";
import FSGSelect from "@/components/inputs/FSGSelect";
import FSGNumberInput from "@/components/inputs/FSGNumberInput";
import FSGSwitch from "@/components/inputs/FSGSwitch";
import schema from "shared/model/schema.json";
import { XMarkIcon } from "@heroicons/react/24/outline";

const useValue = (id: string) =>
    useBucketSelector(btAchievementForm, (form: any) => form[id]);

const useTarget = (id: string, value: any) => {
    btAchievementForm.assign({ [id]: value });
};

const useErrors = (id: string) =>
    useBucketSelector(btAchievementFormErrors, (form: any) => form[id]);

export function EditAchievement() {
    const group = "manage-achievement";
    const rules = (schema as any)[group];

    const editAchievement = useBucket(btEditAchievement) as any;
    const isUpdate = editAchievement?.achievement_slug;
    const all_required = useBucketSelector(btAchievementForm, (form: any) => form["all_required"]);
    const show = useBucket(btShowCreateAchievement) as boolean;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editAchievement) {
            btAchievementForm.assign({ ...editAchievement });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUpdate]);

    useEffect(() => {
        const form = btAchievementForm.get() as any;
        if (!Number.isInteger(Number.parseInt(form?.times_in_a_row))) {
            btAchievementForm.assign({ times_in_a_row: 0 });
        }

        const stats: any[] = (btDevGame.get() as any)?.stats || [];
        const statMap: Record<string, any> = {};
        stats.forEach((s) => (statMap[s.stat_slug] = s));

        let needsUpdate = false;
        if (form?.stat_slug1 && form?.goal1_valueTYPE != statMap[form.stat_slug1]?.valueTYPE) {
            form.goal1_valueTYPE = statMap[form.stat_slug1]?.valueTYPE;
            needsUpdate = true;
        }
        if (form?.stat_slug2 && form?.goal2_valueTYPE != statMap[form.stat_slug2]?.valueTYPE) {
            form.goal2_valueTYPE = statMap[form.stat_slug2]?.valueTYPE;
            needsUpdate = true;
        }
        if (form?.stat_slug3 && form?.goal3_valueTYPE != statMap[form.stat_slug3]?.valueTYPE) {
            form.goal3_valueTYPE = statMap[form.stat_slug3]?.valueTYPE;
            needsUpdate = true;
        }
        if (needsUpdate) {
            btAchievementForm.assign({
                goal1_valueTYPE: form.goal1_valueTYPE,
                goal2_valueTYPE: form.goal2_valueTYPE,
                goal3_valueTYPE: form.goal3_valueTYPE,
            });
        }

        if (!form?.achievement_award) {
            if (form?.award_xp) btAchievementForm.assign({ achievement_award: "award_xp" });
            if (form?.award_gamepoints) btAchievementForm.assign({ achievement_award: "award_gamepoints" });
            if (form?.award_badge) btAchievementForm.assign({ achievement_award: "award_badge" });
            if (form?.award_item) btAchievementForm.assign({ achievement_award: "award_item" });
        }
    });

    const onClose = () => {
        btShowCreateAchievement.set(false);
        btEditAchievement.set(null);
        btAchievementForm.set({});
    };

    const onSubmit = async () => {
        setLoading(true);
        const gameFull = await createOrEditAchievement();

        if (!gameFull) {
            const errorResults = btAchievementFormErrors.get();
            showToast({
                status: "error",
                title: "Error",
                description: "Fix the errors and try again. " + JSON.stringify(errorResults),
            });
            setLoading(false);
            return;
        }

        if ((gameFull as any)?.achievements) {
            btAchievements.set((gameFull as any).achievements);
        }

        const achievement = btAchievementForm.get() as any;
        const errors = btDevGameError.get() as any[];
        if (errors.length > 0) {
            showToast({ status: "error", title: "Error", description: "An error occurred." });
        } else {
            showToast({
                title: `Successfully ${isUpdate ? "updated" : "created"} achievement.`,
                description: `Achievement: ${achievement?.achievement_name}`,
                status: "success",
                duration: 4000,
            });
        }

        setLoading(false);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100">
                    <h2 className="text-sm font-black uppercase tracking-tight text-slate-900">
                        {isUpdate ? "Edit Achievement" : "Create Achievement"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 sm:px-6 py-4 flex flex-col gap-3">
                    {/* Compact: 2-column grid for main fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FSGTextInput
                            rules={group}
                            group={group}
                            name="achievement_slug"
                            id="achievement_slug"
                            title="Slug"
                            disabled={!!isUpdate}
                            maxLength={60}
                            uppercase={true}
                            required={rules["achievement_slug"].required}
                            useValue={useValue}
                            useTarget={useTarget}
                            useErrors={useErrors}
                        />
                        <FSGTextInput
                            rules={group}
                            group={group}
                            name="achievement_name"
                            id="achievement_name"
                            title="Name"
                            maxLength={60}
                            required={rules["achievement_name"].required}
                            useValue={useValue}
                            useTarget={useTarget}
                            useErrors={useErrors}
                        />
                    </div>
                    <FSGTextInput
                        rules={group}
                        group={group}
                        name="achievement_description"
                        id="achievement_description"
                        title="Description"
                        maxLength={120}
                        required={rules["achievement_description"].required}
                        useValue={useValue}
                        useTarget={useTarget}
                        useErrors={useErrors}
                    />

                    {/* Goals: grid */}
                    <div className="border-t border-slate-100 pt-3">
                        <h3 className="text-xs font-bold uppercase tracking-tight text-slate-700 mb-2">Goals</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                            <StatGoalInput id={1} title="Stat #1" name="stat_slug1" />
                            <StatGoalInput id={2} title="Stat #2" name="stat_slug2" />
                            <StatGoalInput id={3} title="Stat #3" name="stat_slug3" />
                        </div>
                    </div>

                    {/* Switch + times in a row: grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FSGSwitch
                            name="all_required"
                            id="all_required"
                            rules={group}
                            group={group}
                            title={all_required ? "All Goals Required" : "Any of the Goals"}
                            horizontal={true}
                            required={rules["all_required"].required}
                            useValue={useValue}
                            useTarget={useTarget}
                            useErrors={useErrors}
                        />
                        <FSGNumberInput
                            group={group}
                            name="times_in_a_row"
                            id="times_in_a_row"
                            min={0}
                            max={1000}
                            title="Repeat for X matches in a row"
                            required={rules["times_in_a_row"].required}
                            useValue={useValue}
                            useTarget={useTarget}
                            useErrors={useErrors}
                        />
                    </div>

                    {/* Awards: grid */}
                    <div className="border-t border-slate-100 pt-3">
                        <StatAwardInput />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-4 sm:px-6 py-3 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-60"
                    >
                        {loading ? "Saving..." : isUpdate ? "Update" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatAwardInput() {
    const group = "manage-achievement";
    const rules = (schema as any)[group];
    const achievement_award = useBucketSelector(btAchievementForm, (form: any) => form["achievement_award"]);

    const renderAwardInput = () => {
        switch (achievement_award) {
            case "award_xp":
                return (
                    <FSGNumberInput
                        group={group}
                        name="award_xp"
                        id="award_xp"
                        title="XP Amount"
                        step={1}
                        required={rules["award_xp"].required}
                        useValue={useValue}
                        useTarget={useTarget}
                        useErrors={useErrors}
                    />
                );
            case "award_gamepoints":
                return (
                    <FSGNumberInput
                        group={group}
                        name="award_gamepoints"
                        id="award_gamepoints"
                        title="Points Amount"
                        step={1}
                        required={rules["award_gamepoints"].required}
                        useValue={useValue}
                        useTarget={useTarget}
                        useErrors={useErrors}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Awards</h3>
            <FSGSelect
                group={group}
                id="achievement_award"
                name="achievement_award"
                placeholder="-- Select Award --"
                options={[
                    <option key="award_none" value="-1">--</option>,
                    <option key="award_item" disabled value="award_item">Item</option>,
                    <option key="award_xp" value="award_xp">XP</option>,
                    <option key="award_gamepoints" value="award_gamepoints">Game Points</option>,
                    <option key="award_badge" disabled value="award_badge">Badge</option>,
                ]}
                useValue={useValue}
                useTarget={useTarget}
                useErrors={useErrors}
            />
            {renderAwardInput()}
        </div>
    );
}

interface StatGoalInputProps {
    title: string;
    name: string;
    id: number;
}

function StatGoalInput({ title, name, id }: StatGoalInputProps) {
    const group = "manage-achievement";
    const rules = (schema as any)[group];
    const stats: any[] = useBucketSelector(btDevGame, (game: any) => game?.stats) || [];
    const goalValue = useBucketSelector(btAchievementForm, (form: any) => form[name]);

    const goalOptions = stats.map((stat) => (
        <option key={"statgoal-" + stat.stat_slug} value={stat.stat_slug}>
            {stat.stat_name}
        </option>
    ));

    const valueINT = (index: number, label?: string) => (
        <FSGNumberInput
            group={group}
            name={`goal${index}_valueINT`}
            id={`goal${index}_valueINT`}
            title={label ?? "Integer Value"}
            step={1}
            required={rules[`goal${index}_valueINT`].required}
            useValue={useValue}
            useTarget={useTarget}
            useErrors={useErrors}
        />
    );

    const valueFLOAT = (index: number) => (
        <FSGNumberInput
            group={group}
            name={`goal${index}_valueFLOAT`}
            id={`goal${index}_valueFLOAT`}
            title="Float Value"
            step={0.01}
            required={rules[`goal${index}_valueFLOAT`].required}
            useValue={useValue}
            useTarget={useTarget}
            useErrors={useErrors}
        />
    );

    const valueOptions = (index: number, type: number) => {
        switch (type) {
            case 0: return valueINT(index);
            case 1: return valueFLOAT(index);
            case 2: return valueFLOAT(index);
            case 3: return valueINT(index, "Time (seconds)");
            default: return null;
        }
    };

    const renderGoalValues = (index: number) => {
        if (goalValue === "-1" || !goalValue) return null;
        const stat = stats.find((s) => s.stat_slug === goalValue);
        if (!stat && (goalValue === "ACOS_WINS" || goalValue === "ACOS_PLAYED")) return valueOptions(index, 0);
        if (!stat && goalValue === "ACOS_SCORE") return valueOptions(index, 0);
        if (!stat && goalValue === "ACOS_RATING") return valueOptions(index, 0);
        if (!stat && goalValue === "ACOS_PLAYTIME") return valueOptions(index, 3);
        return valueOptions(index, stat?.valueTYPE);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 pb-4 border-b border-slate-100 last:border-0">
            <div className="flex-1">
                <FSGSelect
                    title={title}
                    group={group}
                    id={name}
                    name={name}
                    options={[
                        <option key="statgoal-none" value="-1">--</option>,
                        ...goalOptions,
                    ]}
                    required={rules[name].required}
                    useValue={useValue}
                    useTarget={useTarget}
                    useErrors={useErrors}
                />
            </div>
            {renderGoalValues(id) && (
                <div className="flex-1">{renderGoalValues(id)}</div>
            )}
        </div>
    );
}
