import { useEffect, useState } from "react";

interface SettingsPaneProps {
    isPlayRoute: boolean;
}

export function SettingsPane({ isPlayRoute }: SettingsPaneProps) {
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

    return (
        <section className="flex h-full min-h-0 flex-col p-3 sm:p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Interface Settings</p>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                    Profile
                </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto panel-scrollbar pr-1 space-y-2.5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Theme Mode</p>
                    <button
                        type="button"
                        onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                        className="mt-2 h-9 w-full rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-cyan-300 hover:bg-cyan-50"
                    >
                        Toggle {theme === "dark" ? "Light" : "Dark"} Theme
                    </button>
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
