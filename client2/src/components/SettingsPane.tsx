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
        <section className="rounded-md border border-white/12 bg-card p-3.5 space-y-3 h-full">
            <p className="text-sm font-semibold text-foreground">Interface Settings</p>
            <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className="w-full h-10 rounded-md border border-white/15 bg-black/20 text-sm font-semibold text-foreground hover:border-cyan-300/45 transition-colors"
            >
                Toggle {theme === "dark" ? "Light" : "Dark"} Theme
            </button>
            <p className="text-xs text-muted-foreground">
                {isPlayRoute ? "Play mode is active. Use controls here while staying in-match." : "General account and interface tools are available here."}
            </p>
        </section>
    );
}
