import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { PlayRightPanel } from "./PlayRightPanel";
import { RightPanel } from "./RightPanel";
import { MatchmakingQueueIndicator } from "./MatchmakingQueueIndicator";
// import { Gamepad2, Sparkles } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
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

  const isPlayRoute = /^\/game\/[^/]+\/play$/.test(location.pathname);
  const activeRightPanel = isPlayRoute ? <PlayRightPanel /> : <RightPanel />;

  return (
    <div className="h-screen overflow-hidden flex flex-col play-layout-root">
      <div className="h-full overflow-y-auto panel-scrollbar">
        {/* Header */}
        <header className="play-layout-header bg-linear-to-r from-background via-card to-background border-b border-cyan-500/20 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="container mx-auto px-4 sm:px-6 lg:pr-84 py-4 relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-purple-500 rounded-lg blur-lg opacity-50" />
                  <div className="relative w-12 h-12 bg-linear-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center shadow-xl">
                    {/* <Gamepad2 className="w-7 h-7 text-white" /> */}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400">ACOS</h1>
                    {/* <Sparkles className="w-5 h-5 text-yellow-400" /> */}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">Multiplayer Gaming Portal</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className="shrink-0 h-9 px-3 rounded-full border border-white/15 bg-card/70 hover:bg-card transition-colors text-xs font-semibold text-foreground flex items-center gap-2"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <span className="text-sm leading-none">{theme === "dark" ? "☀" : "☾"}</span>
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="play-layout-content relative container mx-auto px-4 sm:px-6 lg:pr-84 py-4 sm:py-6">
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Main content area */}
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
          </div>

          {/* Right panel rail (desktop) */}
          <aside className="play-layout-rail hidden lg:block fixed top-0 right-0 z-30 h-screen w-80 border-l border-cyan-400/15 bg-background/92 backdrop-blur-xl p-3 pr-2">
            {activeRightPanel}
          </aside>

          {/* Mobile/tablet bottom trigger */}
          <button
            type="button"
            onClick={() => setMobilePanelOpen(true)}
            className="lg:hidden fixed bottom-4 right-4 z-40 h-11 w-11 rounded-full border border-cyan-400/35 bg-card/90 backdrop-blur-md text-cyan-300 shadow-[0_0_18px_rgba(0,217,255,0.2)] hover:text-cyan-200 hover:border-cyan-300/55 transition-colors flex items-center justify-center"
            aria-label="Open right panel"
          >
            <Bars3BottomRightIcon className="h-5 w-5" />
          </button>

          {/* Mobile backdrop */}
          {mobilePanelOpen && (
            <button
              type="button"
              className="lg:hidden fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobilePanelOpen(false)}
              aria-label="Close right panel"
            />
          )}

          {/* Mobile slide-in right panel */}
          <aside
            className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[min(86vw,22rem)] border-l border-white/10 bg-background/95 backdrop-blur-xl transition-transform duration-300 ${
              mobilePanelOpen ? "translate-x-0" : "hidden translate-x-full"
            }`}
            aria-hidden={!mobilePanelOpen}
          >
            <button
              type="button"
              onClick={() => setMobilePanelOpen(false)}
              className="absolute bottom-4 -left-8 h-10 w-10 rounded-full border border-white/20 bg-background/95 text-white/80 hover:text-white hover:border-cyan-300/50 flex items-center justify-center shadow-lg"
              aria-label="Close right panel"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <div className="h-full overflow-y-auto p-4 panel-scrollbar">
              {activeRightPanel}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="border-t border-cyan-500/20 bg-linear-to-r from-background via-card to-background backdrop-blur-xl">
          <div className="container mx-auto px-4 sm:px-6 lg:pr-84 py-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
              <p className="text-muted-foreground">© {new Date().getFullYear()} ACOS Platform. All rights reserved.</p>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="text-cyan-400/80">Status: Online</span>
                <span>Build: Beta</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <MatchmakingQueueIndicator />
    </div>
  );
}