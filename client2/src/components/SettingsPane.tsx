import { useEffect, useState } from "react";
import { sendFrameMessage } from "@/actions/connection";
import { useBucket } from "@/actions/bucket";
import { btGamePanels, btVolume } from "@/actions/buckets";

interface SettingsPaneProps {
    isPlayRoute: boolean;
}

export function SettingsPane({ isPlayRoute }: SettingsPaneProps) {
    const volume = useBucket(btVolume);
    const gamePanels = useBucket(btGamePanels) as any;

    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "dark";
        const stored = window.localStorage.getItem("theme-mode");
        if (stored === "light" || stored === "dark") return stored;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        window.localStorage.setItem("theme-mode", theme);
    }, [theme]);

    const onVolumeChange = (volume:number) => {

        
        btVolume.set(Number.isFinite(volume) ? volume : 1);

        const panels = Array.isArray(gamePanels)
            ? gamePanels
            : Object.values(gamePanels || {});

        localStorage.setItem("volume", String(volume));
        for (const panel of panels) {
            if (!panel?.room?.room_slug) continue;
            sendFrameMessage({
                type: "volume",
                payload: volume,
                room: panel.room,
            });
        }
    }

    return (
        <section className="flex h-full min-h-0 flex-col p-3 sm:p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Interface Settings</p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
                    Profile
                </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto panel-scrollbar2 pr-1 space-y-2.5">
                {/* <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Theme Mode</p>
                    <button
                        type="button"
                        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                        className="mt-2 h-9 w-full rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-300 hover:bg-cyan-50"
                    >
                        Toggle {theme === "dark" ? "Light" : "Dark"} Theme
                    </button>
                </div> */}

                <div className="rounded-xl border bg-white drop-shadow-md p-2.5">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Master Volume</p>
                        <span className="text-[11px] font-semibold text-slate-700">{Math.round((volume ?? 1) * 100)}%</span>
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={typeof volume === "number" ? volume : 1}
                        onChange={(event) => {
                            const nextVolume = Number(event.target.value);
                            onVolumeChange(nextVolume);
                        }}
                        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-xl bg-slate-200 accent-slate-600"
                        aria-label="Game volume"
                    />
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <p className="text-xs text-slate-600 leading-relaxed">
                        {isPlayRoute ? "Play mode is active. Use controls here while staying in-match." : "General account and interface tools are available here."}
                    </p>
                </div>
            </div>
        </section>
    );
}
