import { useEffect, useState } from "react";
import type React from "react";
import { Link, Outlet, useLocation } from "react-router";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon, Cog6ToothIcon, QueueListIcon, UsersIcon } from "@heroicons/react/24/solid";
import { QueueList } from "./QueueList";
import { FriendsList } from "./FriendsList";
import { ChatPane } from "./ChatPane";
import { CompressedGamerCard } from "./CompressedGamerCard";
import { MatchmakingQueueIndicator } from "./MatchmakingQueueIndicator";
import { PowerBar } from "./PowerBar";
import { SettingsPane } from "./SettingsPane";
import { ScoreboardPane } from "./ScoreboardPane";
// Placeholder import for Scoreboard
// Replace with actual import if exists
// import { btToast } from "../actions/buckets";
import { hideToast } from "../actions/toast";
import { SignInPane } from "./SignInPane";
import { useBucket } from "@/actions/bucket";
import { btActivePowerTab, btIsDockedWide, btIsLargeScreen, btLoggedIn, btModalShow } from "@/actions/buckets";
// import { Gamepad2, Sparkles } from "lucide-react";


let layoutRenderCount = 0;

const screensPx: { [key: string]: number } = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};


export function Layout() {
    const location = useLocation();
    // const toast = useBucket(btToast);
    let toast = { open: false, title: "", description: "", status: "success", duration: 3000, isClosable: true, id: 1 };
    const activePowerTab = useBucket(btActivePowerTab);
    const isDockedWide = useBucket(btIsDockedWide);
    const isLargeScreen = useBucket(btIsLargeScreen);
    const loggedIn = useBucket(btLoggedIn);
    const isLoggedIn = !!loggedIn && loggedIn !== "LURKER" && loggedIn !== "CHECKING";

    useEffect(() => {
        if (!isLoggedIn) {
            btActivePowerTab.set(null);
            btIsDockedWide.set(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (!toast?.open) return;
        if (!toast.duration || toast.duration <= 0) return;

        const activeToastId = toast.id;
        const timeout = window.setTimeout(() => {
            hideToast(activeToastId);
        }, toast.duration);

        return () => window.clearTimeout(timeout);
    }, [toast]);


    useEffect(() => {
        // Use a window resize listener or a React useEffect hook to update dynamically
        // Example using a window listener:
        const updateLargeScreen = () => {
            btIsLargeScreen.set(window.screen.width >= screensPx['lg']);
        };

        updateLargeScreen();
        window.addEventListener('resize', updateLargeScreen);

        return () => {
            window.removeEventListener('resize', updateLargeScreen);
        };
    }, []);

    const isPlayRoute = /^\/game\/[^/]+\/play$/.test(location.pathname);
    const isPowerPanelOpen = activePowerTab !== null;
    const isDockedOpenWide = isLargeScreen && isDockedWide && isPowerPanelOpen;
    const openSignIn = () => btModalShow.assign("signIn", true);

    // let isLargeScreen = checkBreakpoint('lg');

    console.log("Layout Render Count:", ++layoutRenderCount);
    return (
        <>
            <SignInPane onSignIn={() => false} />
            {/* <div className="absolute inset-0 w-full h-full  overflow-hidden -z-2">
                <svg className="background-svg top" width="calc(100% + 160px)" height="100%">
                    <pattern id="pattern-aztec-top" x="0" y="0" width="160" height="78" patternUnits="userSpaceOnUse">
                        <path stroke="white" opacity="1"
                            strokeWidth="1" fill="none" d="m 0 32 h 28 v -20 h -10 v 10 h -10 v -20 h 30 v 30 h 30 v -20 h -10 v 10 h -10 v -20 h 30 v 30 h 30 v -20 h -10 v 10 h -10 v -20 h 30 v 30 h 30 v -20 h -10 v 10 h -10 v -20 h 30 v 32" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-aztec-top)"></rect>
                </svg>
                <svg className="background-svg bottom" width="calc(100% + 160px)" height="100%">
                    <pattern id="pattern-aztec-bottom" x="0" y="0" width="160" height="78" patternUnits="userSpaceOnUse">
                        <path stroke="white" opacity="1"
                            strokeWidth="1" fill="none" d="m 0 71 h 18 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 v -30 h 30 v 20 h -10 v -10 h -10 v 20 h 30 m -178 -30 h 8 v 20 h -8" />
                    </pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-aztec-bottom)"></rect>
                </svg>
            </div> */}
            <div className="w-full h-screen overflow-hidden flex flex-col play-layout-root">
                {toast?.open ? (
                    <div className="fixed top-4 right-4 z-90 w-[min(92vw,22rem)] rounded-md border border-white/15 bg-background/95 backdrop-blur-xl p-3 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p
                                    className={`text-sm font-semibold truncate ${toast.status === "success"
                                        ? "text-emerald-300"
                                        : toast.status === "warning"
                                            ? "text-amber-300"
                                            : toast.status === "error"
                                                ? "text-rose-300"
                                                : "text-cyan-300"
                                        }`}
                                >
                                    {toast.title}
                                </p>
                                {toast.description ? <p className="mt-1 text-xs text-muted-foreground">{toast.description}</p> : null}
                            </div>

                            {toast.isClosable ? (
                                <button
                                    type="button"
                                    onClick={() => hideToast(toast.id)}
                                    className="shrink-0 h-7 w-7 rounded-full border border-white/15 bg-black/20 text-white/70 hover:text-white hover:border-cyan-300/45 transition-colors flex items-center justify-center"
                                    aria-label="Close toast"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                <div 
                    className="relative flex flex-row w-full h-screen  panel-scrollbar  overflow-y-auto overflow-x-hidden transition-[padding-right] transition-duration-200"
                    style={{ 
                        paddingRight: isLargeScreen && isPowerPanelOpen ? "20rem" : undefined, 
                        // width: isPowerPanelOpen ? "calc(100% - 20rem)" : undefined 
                    }}
                    >

                    <div className="play-layout-main-shell flex-1 min-w-0 flex flex-col h-full pt-4">
                        {/* Header */}
                        <header 
                            className="play-layout-header fixed top-0 left-0 transition-[padding-right] transition-duration-200 z-50 w-full h-12.5 min-h-12.5 max-h-12.5 box-border  bg-slate-950"
                            style={{  
                                paddingRight: isLargeScreen && isPowerPanelOpen ? "20rem" : undefined, 
                                left: isLargeScreen && isPowerPanelOpen ? '-4px' : undefined,
                                // width: isPowerPanelOpen ? "calc(100% - 20rem)" : undefined
                            }}
                            >
                            <div className="absolute w-full inset-0  bg-linear-to-r transition-[padding-right] transition-duration-200 "
                            style={{  
                                paddingRight: isLargeScreen && isPowerPanelOpen ? "20rem" : undefined, 
                                // width: isPowerPanelOpen ? "calc(100% - 20rem)" : undefined
                            }}
                             />
                            <div className="w-full h-full container mx-auto px-2 sm:px-2 lg:px-24 relative">
                                <div className="w-full h-full flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Link to="/" className="flex items-center gap-2.5">
                                            <img
                                                src="https://assets.acos.games/acos-logo-2025.webp"
                                                alt="ACOS"
                                                className="h-8 w-auto object-contain"
                                            />
                                            <span className="font-acos-logo text-2xl font-semibold text-white leading-none">ACOS</span>
                                        </Link>
                                    </div>

                                    {isLoggedIn ? (
                                        <PowerBar />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={openSignIn}
                                            className="power-bar-btn"
                                            aria-label="Sign in"
                                            title="Sign in"
                                        >
                                            Sign In
                                        </button>
                                    )}
                                </div>
                            </div>
                        </header>

                        {/* Main content + footer — shift right when panel is docked */}
                        <div
                            className="flex-1 flex flex-col min-h-0 mt-12 min-w-0 transition-[padding-right] duration-200"
                            // style={{ paddingRight: isDockedOpenWide ? "20rem" : undefined }}
                        >

                        {/* Main content */}
                        <div className="flex-1 min-w-0 play-layout-content relative container mx-auto px-2 lg:px-20 ">
                            <div className="flex flex-col gap-4 lg:gap-6">
                                {/* Main content area */}
                                <div className="flex-1 min-w-0">
                                    <Outlet />
                                </div>
                            </div>


                        </div>

                        {/* Footer */}
                        <footer className="border-t border-cyan-500/20 bg-slate-950">
                            <div className="container mx-auto px-2  lg:px-20 py-3.5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                                    <p className="text-muted-foreground">© {new Date().getFullYear()} ACOS Platform. All rights reserved.</p>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <span className="text-cyan-400/80">Status: Online</span>
                                        <span>Build: Beta</span>
                                    </div>
                                </div>
                            </div>
                        </footer>
                        </div>{/* end padding wrapper */}
                    </div>

                </div>

                {isPowerPanelOpen && !isDockedOpenWide ? (
                    <button
                        type="button"
                        className="fixed inset-0 z-50 bg-black/80"
                        onClick={() => btActivePowerTab.set(null)}
                        aria-label="Close power panel"
                    />
                ) : null}

                <aside
                    className={`power-panel fixed py-1 transition-[right] duration-200 ${isPowerPanelOpen ? "power-panel-open right-1" : "-right-100"} ${isDockedOpenWide ? "docked bg-slate-950 bg-pink-500/5" : ""}`}
                    // aria-hidden={!isPowerPanelOpen}
                >
                    {isDockedOpenWide ? (
                        <div className="power-panel-sidebar-bar">
                            <PowerBar className="flex h-12.5 items-center justify-center gap-1.5 px-2" />
                        </div>
                    ) : null}
                    <PanelContent isPlayRoute={isPlayRoute} />
                </aside>

                <MatchmakingQueueIndicator />
            </div>

        </>
    );
}


type PanelSubTab = "chat" | "queue" | "friends" | "settings" | "scoreboard";

const BASE_PANEL_TABS: Array<{ key: PanelSubTab; label: string; Icon: React.ElementType }> = [
    { key: "chat",     label: "Chat",     Icon: ChatBubbleLeftRightIcon },
    { key: "queue",    label: "Queue",    Icon: QueueListIcon },
    { key: "friends",  label: "Friends",  Icon: UsersIcon },
    { key: "settings", label: "Settings", Icon: Cog6ToothIcon },
];

function PanelContent({ isPlayRoute }: { isPlayRoute: boolean }) {
    const loggedIn = useBucket(btLoggedIn);
    const [activeSubTab, setActiveSubTab] = useState<PanelSubTab>("chat");

    const isLoggedIn = !!loggedIn && loggedIn !== "LURKER" && loggedIn !== "CHECKING";

    // Detect if player is in game (use your own logic or state)
    // For now, use isPlayRoute as the indicator
    const inGame = isPlayRoute;

    // If inGame changes from false to true, auto-focus scoreboard
    useEffect(() => {
        if (inGame) setActiveSubTab("scoreboard");
    }, [inGame]);

   
    // Dynamically add scoreboard tab if in game
    const PANEL_TABS: Array<{ key: PanelSubTab; label: string; Icon: React.ElementType }> = inGame
        ? [
            { key: "scoreboard", label: "Scoreboard", Icon: QueueListIcon },
            ...BASE_PANEL_TABS.filter(tab => tab.key !== "scoreboard")
        ]
        : BASE_PANEL_TABS;

    if (!isLoggedIn) {
        return (
            <div className="power-panel-content panel-scrollbar flex flex-col p-2 sm:p-3">
                <SignInPane onSignIn={() => false} />
            </div>
        );
    }

    return (
        <div className="flex flex-1 min-h-0 flex-col gap-2  relative pl-2 pr-1 py-0 sm:gap-3 ">
            {/* Player card — shrink-0 ensures it never loses height */}
            <div className="shrink-0">
                <CompressedGamerCard />
            </div>

            {/* Compact sub-tab nav */}
            <div className="shrink-0 rounded-xl border border-slate-200/90 bg-slate-100 p-1 shadow-md">
                <div className="flex items-center gap-1">
                {PANEL_TABS.map(({ key, label, Icon }: { key: PanelSubTab; label: string; Icon: React.ElementType }) => {
                    const isActive = activeSubTab === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveSubTab(key)}
                            className={`flex h-8 flex-1 items-center justify-center rounded-lg transition-colors ${
                                isActive
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            }`}
                            aria-pressed={isActive}
                            aria-label={label}
                            title={label}
                        >
                            <Icon className="h-6 w-6 shrink-0" />
                        </button>
                    );
                })}
                </div>
            </div>

            {/* Sub-tab content — overflow-hidden: each tab owns its own internal scroll */}
            <div className="flex-1 min-h-0 overflow-hidden rounded-xl p-1 pr-0 bg-slate-100 shadow-md">
                {activeSubTab === "scoreboard" ? <ScoreboardPane matchType="team-based" /> : null}
                {activeSubTab === "chat"     ? <ChatPane /> : null}
                {activeSubTab === "queue"    ? <QueueList /> : null}
                {activeSubTab === "friends"  ? <FriendsList /> : null}
                {activeSubTab === "settings" ? <SettingsPane isPlayRoute={isPlayRoute} /> : null}
            </div>
        </div>
    );
}
