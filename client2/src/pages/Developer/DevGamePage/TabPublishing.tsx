import { useRef, useState } from "react";
import { useBucket } from "@/actions/bucket";
import { btDevGame } from "@/actions/buckets";
import { updateGameField, updateGameAPIKey } from "@/actions/devgame";

import FSGSelect from "@/components/inputs/FSGSelect";

import FSGCopyText from "@/components/inputs/FSGCopyText";
import { ClipboardIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function TabPublishing() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[0.25fr_0.75fr] gap-6">
            <PublishingCard />
            <div className="flex flex-col gap-6">
                <CloneAndDeployCard />
            </div>
        </div>
    );
}

function PublishingCard() {
    const devgame = useBucket(btDevGame) as any;
    const group = "update-game_info";

    const onUpdateVersion = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number.parseInt(e.target.value);
        if (!Number.isInteger(value)) return;
        if (value < 0 || value > devgame.latest_version) return;
        updateGameField("version", value, group);
    };

    const onUpdateVisibility = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number.parseInt(e.target.value);
        if (!Number.isInteger(value)) return;
        updateGameField("visible", value, group);
    };

    const versionOptions = [];
    if (devgame?.latest_version) {
        for (let i = devgame.latest_version; i > 0; i--) {
            versionOptions.push(
                <option key={"published-v" + i} value={i}>
                    {i}
                </option>
            );
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-6">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Publish</h3>

            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-700">Live Version:</p>
                <FSGSelect
                    name="version"
                    rules={group}
                    group={group}
                    onChange={onUpdateVersion}
                    value={devgame?.version}
                    options={versionOptions}
                />
                <p className="text-xs text-slate-400">
                    Latest Build:{" "}
                    <span className="font-medium text-slate-600">
                        {devgame?.latest_version}
                    </span>
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-700">Visibility:</p>
                <FSGSelect
                    name="visible"
                    rules={group}
                    group={group}
                    onChange={onUpdateVisibility}
                    options={[
                        <option key="v0" value="0">Unlisted</option>,
                        <option key="v1" value="1">Public</option>,
                        <option key="v2" value="2">Hidden</option>,
                    ]}
                />
            </div>
        </div>
    );
}

function CloneAndDeployCard() {
    const devgame = useBucket(
        btDevGame,
        (a: any, b: any) => a?.deployCommand !== b?.deployCommand
    ) as any;
    const cloneRef = useRef<HTMLInputElement>(null);
    const deployRef = useRef<HTMLInputElement>(null);
    const [copiedClone, setCopiedClone] = useState(false);
    const [copiedDeploy, setCopiedDeploy] = useState(false);

    const cloneCmd = `git clone git@github.com:acosgames/${devgame?.game_slug}.git`;
    const githubURL = `https://github.com/acosgames/${devgame?.game_slug}`;

    const copyText = (text: string, setFlag: (v: boolean) => void) => {
        navigator.clipboard.writeText(text).then(() => {
            setFlag(true);
            setTimeout(() => setFlag(false), 2000);
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-6">
            <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Clone and Deploy</h3>

            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-700">
                    Clone{" "}
                    <a
                        href={githubURL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        GitHub repo
                    </a>{" "}
                    to get started
                </p>
                <div className="flex items-center gap-2">
                    <FSGCopyText
                        copyRef={cloneRef}
                        value={cloneCmd}
                        onFocus={(e: any) => e.target.select()}
                    />
                    <button
                        onClick={() => copyText(cloneCmd, setCopiedClone)}
                        title="Copy Clone Command"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0"
                    >
                        <ClipboardIcon className="w-4 h-4" />
                    </button>
                    {copiedClone && <span className="text-xs text-green-600">Copied!</span>}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-700">
                    Run command in{" "}
                    <span className="font-semibold text-slate-900">{devgame?.game_slug}</span>{" "}
                    project folder to deploy.
                </p>
                <div className="flex items-center gap-2">
                    <FSGCopyText
                        copyRef={deployRef}
                        value={devgame?.deployCommand || ""}
                        onFocus={(e: any) => e.target.select()}
                    />
                    <button
                        onClick={() => copyText(devgame?.deployCommand || "", setCopiedDeploy)}
                        title="Copy Deploy Command"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0"
                    >
                        <ClipboardIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => updateGameAPIKey()}
                        title="Regenerate API Key"
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition shrink-0"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                    </button>
                    {copiedDeploy && <span className="text-xs text-green-600">Copied!</span>}
                </div>
            </div>
        </div>
    );
}
