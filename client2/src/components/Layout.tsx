import { useEffect, useRef, useState } from "react";
import type React from "react";
import { Link, Outlet, useLocation } from "react-router";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ChatBubbleLeftRightIcon, Cog6ToothIcon, BoltIcon, PlayIcon } from "@heroicons/react/24/solid";
import { QueueList } from "./QueueList";
import { ChatPane } from "./ChatPane";
import { CompressedGamerCard } from "./CompressedGamerCard";
import { HeaderQueueSearchIndicator } from "./HeaderQueueSearchIndicator";
import { HeaderMatchSnapshot } from "./HeaderMatchSnapshot";
import { PowerBar } from "./PowerBar";
import { SettingsPane } from "./SettingsPane";
import { ScoreboardPane } from "./ScoreboardPane";
// Placeholder import for Scoreboard
// Replace with actual import if exists
// import { btToast } from "../actions/buckets";
import { hideToast } from "../actions/toast";
import { SignInPane } from "./SignInPane";
import { useBucket } from "@/actions/bucket";
import { btActivePowerTab, btDisplayMode, btIsDockedWide, btIsLargeScreen, btIsMobile, btLoggedIn, btMainScrollRef, btModalShow, btPrimaryGamePanel, btScreenBreakpoint } from "@/actions/buckets";
// import { Gamepad2, Sparkles } from "lucide-react";


let layoutRenderCount = 0;

const screensPx: { [key: string]: number } = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

const mediaQuery = window.matchMedia('(pointer: coarse)');

export function Layout() {

    const mainScrollRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const [mounted, setMounted] = useState(false);
    // const toast = useBucket(btToast);
    let toast = { open: false, title: "", description: "", status: "success", duration: 3000, isClosable: true, id: 1 };
    const activePowerTab = useBucket(btActivePowerTab);
    const isLargeScreen = useBucket(btIsLargeScreen);
    const loggedIn = useBucket(btLoggedIn);
    const isLoggedIn = !!loggedIn && loggedIn !== "LURKER" && loggedIn !== "CHECKING";

    const displayMode = useBucket(btDisplayMode);
    const isTheaterMode = displayMode === "theatre";
    const isFullscreen = displayMode === "fullscreen";
    const isMobile = useBucket(btIsMobile);

    const mainContentRef = useRef<HTMLDivElement>(null);
    const headerContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            btActivePowerTab.set(null);
            btIsDockedWide.set(false);
        } else {
            // Always dock wide on large screens
            if (isLargeScreen) {
                btIsDockedWide.set(true);
            } else {
                btIsDockedWide.set(false);
            }
            if (btActivePowerTab.get() === null) {
                btActivePowerTab.set("chat");
            }
        }
    }, [isLoggedIn, isLargeScreen]);

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
            btIsLargeScreen.set(window.innerWidth >= screensPx['sm']);

            if (window.innerWidth >= screensPx['xl']) {
                btScreenBreakpoint.set('xl');
            }
            else if (window.innerWidth >= screensPx['lg']) {
                btScreenBreakpoint.set('lg');
            }
            else if (window.innerWidth >= screensPx['md']) {
                btScreenBreakpoint.set('md');
            }
            else if (window.innerWidth >= screensPx['sm']) {
                btScreenBreakpoint.set('sm');
            }
            else {
                btScreenBreakpoint.set('xs');
            }

        };

        const handleTabletChange = (e: MediaQueryListEvent | any) => {
            btIsMobile.set(e.matches);
        };


        mediaQuery.addEventListener('change', handleTabletChange);
        handleTabletChange(mediaQuery);

        updateLargeScreen();
        window.addEventListener('resize', updateLargeScreen);

        return () => {
            window.removeEventListener('resize', updateLargeScreen);
            mediaQuery.removeEventListener('change', handleTabletChange);
        };
    }, []);

    const isPlayRoute = /^\/game\/[^/]+\/play$/.test(location.pathname);
    const isPowerPanelOpen = activePowerTab !== null;
    // Always show side panel on large screens
    const isDockedOpenWide = isLargeScreen;
    const openSignIn = () => btModalShow.assign("signIn", true);

    // let isLargeScreen = checkBreakpoint('lg');

    console.log("Layout Render Count:", ++layoutRenderCount);

    let headerRect = null;
    if (headerContentRef.current) {
        headerRect = headerContentRef.current.getBoundingClientRect();
        console.log("Header Content Rect:", headerRect);
    }

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
            <div className="w-full h-screen  flex flex-col play-layout-root">
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

                <div className="relative flex flex-row w-full h-full justify-center px-2 lg:px-3 panel-scrollbar2 overflow-y-auto overflow-x-hidden">

                    <div
                        ref={(element) => {
                            mainScrollRef.current = element;
                            btMainScrollRef.set(mainScrollRef);
                        }}
                        className={`play-layout-main-shell container h-full mx-auto flex-1 min-w-0 flex flex-col   ${mounted ? "transition-[margin-right] duration-200" : ""}`}
                        style={{
                            // paddingRight: isDockedOpenWide ? "20rem" : 0,
                            // paddingTop: isTheaterMode || isFullscreen ? 0 : isDockedOpenWide ? "50px" : undefined,
                        }}
                    >
                        {/* Header */}

                        <header
                            ref={headerContentRef}
                            className={`play-layout-header ${isMobile ?  'left-0 pl-2 pr-2 md:pr-2' : '-left-1.5 pl-4 pr-3 md:pr-3.5'}  fixed top-0  z-50 ${mounted ? "transition-[padding-right] transition-duration-200" : ""}  w-full h-12.5 min-h-12.5 max-h-12.5 box-border  `}
                            style={{
                                // paddingRight: isDockedOpenWide ? "calc(20rem + 12px)" : "8px",
                            }}
                        >
                            {/* <div className="absolute  w-full -z-50    transition-[padding-right] transition-duration-200 "
                                style={{
                                    // paddingRight: isLargeScreen && isPowerPanelOpen ? "calc(20rem - 8px)" : undefined,
                                    // width: isPowerPanelOpen ? "calc(100% - 20rem)" : undefined
                                }}
                            /> */}
                            <div className="container h-12 relative grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_16rem] md:grid-cols-[minmax(0,1fr)_20rem] gap-4">
                                <div className="relative bg-white rounded-b-xl shadow-md h-full  px-2 ">
                                    <HeaderQueueSearchIndicator />
                                    <div className="w-full h-full flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Link to="/" className="flex items-center gap-2.5">
                                                <img
                                                    src="https://assets.acos.games/acos-logo-2025.webp"
                                                    alt="ACOS"
                                                    className="h-8 w-auto object-contain"
                                                />
                                                <span className="font-acos-logo text-xl font-semibold text-slate-700 leading-none">ACOS</span>
                                            </Link>
                                        </div>

                                        {isLoggedIn ? (
                                            <></>
                                            // <HeaderMatchSnapshot />
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={openSignIn}
                                                className="button bg-blue-500 hover:bg-blue-700 cursor-pointer text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                                aria-label="Sign in"
                                                title="Sign in"
                                            >
                                                Create Account
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {isLargeScreen && isPowerPanelOpen && isDockedOpenWide && (
                                    <div className={`w-full h-1 relative ${isPlayRoute ? 'top-0' : 'top-0'} transition-all duration-200`}>
                                    <aside
                                        className="sticky right-0 z-20 w-83 h-[calc(100vh)] flex flex-col"
                                        style={{ alignSelf: 'start' }}
                                    >
                                        <div className="w-[20rem] sm:w-[16rem] md:w-[20rem] flex flex-col flex-1 min-h-0">
                                            {!isTheaterMode && !isFullscreen && isDockedOpenWide ? (
                                                <div className="power-panel-sidebar-bar">
                                                    <PowerBar className="flex h-12.5 items-center justify-center gap-1.5 px-2" />
                                                </div>
                                            ) : null}
                                            <PanelContent isPlayRoute={isPlayRoute} />
                                        </div>
                                    </aside>
                                    </div>
                                )}
                            </div>

                        </header>

                        {/* Main content + footer */}
                        <div

                            className={`relative left-0 flex-1  flex flex-col min-h-0 ${isTheaterMode || isFullscreen ? "mt-0" : isDockedOpenWide ? "pt-16" : " pt-16 sm:mt-12.5"} ${isTheaterMode || isFullscreen ? "mt-0" : ""} min-w-0 relative`}
                            style={{

                            }}
                        >
                            {/* Persistent rounded-corner overlay at top right */}

                            {/* Main content */}
                            <div
                                ref={mainContentRef}
                                className=" flex-1 w-full items-start min-w-0 play-layout-content relative grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_16rem] md:grid-cols-[minmax(0,1fr)_20rem] gap-4">
                                <div className="w-full h-full flex flex-col ">
                                    {/* Main content area */}
                                    <div className="flex-1 min-w-0">
                                        <Outlet />
                                    </div>

                                    <footer className="w-full h-full text-[11px] px-1 flex items-end justify-center">
                                        <div className="w-full bg-white rounded-t-xl shadow-md px-2  lg:px-4 p-3.5  ">
                                            <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <p className="text-slate-700">© {new Date().getFullYear()} ACOS Platform. All rights reserved.</p>
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    <span className="text-green-400">Status: Online</span>
                                                    {/* <span>Build: Beta</span> */}
                                                </div>
                                            </div>
                                        </div>

                                    </footer>
                                </div>
                                {/* Right rail: flush 20rem column; scrollbar gutter floats outside rail width */}
                                


                            </div>

                        </div>{/* end padding wrapper */}
                    </div>

                </div>
                {/* Footer */}

                {!isLargeScreen && isPowerPanelOpen && !isDockedOpenWide && (
                    <>
                    <aside
                        className={`power-panel top-16 right-2 w-83  h-[calc(100vh-4.5rem)] max-h-[calc(100vh-20px)] fixed z-55 pt-0 pb-2 transition-[right] duration-200 ${mounted ? "" : ""} ${isPowerPanelOpen ? "power-panel-open right-2" : "-right-50"} ${isDockedOpenWide ? "docked  " : ""}`}
                    // aria-hidden={!isPowerPanelOpen}

                    >
                        {/* {!isTheaterMode && !isFullscreen && isDockedOpenWide ? (
                            <div className="power-panel-sidebar-bar">
                                <PowerBar className="flex h-12.5 items-center justify-center gap-1.5 px-2" />
                            </div>
                        ) : null} */}
                        <PanelContent isPlayRoute={isPlayRoute} />
                    </aside>
                    <button
                        type="button"
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        onClick={() => btActivePowerTab.set(null)}
                        aria-label="Close power panel"
                    />
                    </>
                )}


                {isTheaterMode && (
                    <div className="fixed top-4 right-4 z-100">
                        <PowerBar minimal={true} />
                    </div>
                )}



                {/* Rounded concave corner — fixed sibling so it escapes the aside's stacking context */}
                {/* {!(isTheaterMode || isFullscreen) ? (
                    <div
                        className={`pointer-events-none overflow-hidden border-0 fixed z-9 bg-slate-300 ${mounted ? "transition-[right] duration-200" : ""}`}
                        style={{
                            top: '50px',
                            right: isDockedOpenWide && isMobile ? 'calc(20rem + 0px)' : isDockedOpenWide ? 'calc(20rem + 10px)' : '-100rem',
                            width: '0.5rem',
                            height: '0.5rem',
                            opacity: '0.99',
                            // inset: '0',
                            // mask:`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" preserveAspectRatio="none"><circle cx="5" cy="5" r="2" stroke="black" stroke-width="0" fill="red" /></svg>') 0/100% 100%`,
                            clipPath: ' polygon(100% 0, 100% 100%, 83% 40%, 59% 20%, 0 0)',
                        }}
                    >
                        <div className="w-full h-full bg-slate-300 rounded-tr-lg" />
                    </div>
                ) : null} */}
                {/* <MatchmakingQueueIndicator /> */}
            </div>

        </>
    );
}


type PanelSubTab = "chat" | "queue" | "friends" | "settings" | "scoreboard";

const BASE_PANEL_TABS: Array<{ key: PanelSubTab; label: string; Icon: React.ElementType }> = [
    { key: "chat", label: "Chat", Icon: ChatBubbleLeftRightIcon },
    { key: "queue", label: "Queue", Icon: BoltIcon },
    // { key: "friends", label: "Friends", Icon: UsersIcon },
    { key: "settings", label: "Settings", Icon: Cog6ToothIcon },
];

function PanelContent({ isPlayRoute }: { isPlayRoute: boolean }) {
    const loggedIn = useBucket(btLoggedIn);
    const [activeSubTab, setActiveSubTab] = useState<PanelSubTab>(isPlayRoute ? "scoreboard" : "chat");

    const isLoggedIn = !!loggedIn && loggedIn !== "LURKER" && loggedIn !== "CHECKING";

    // Detect if player is in game (use your own logic or state)
    // For now, use isPlayRoute as the indicator
    const inGame = isPlayRoute;

    const primary = useBucket(btPrimaryGamePanel);
    console.log("Primary Game Panel:", primary);
    // If inGame changes from false to true, auto-focus scoreboard
    useEffect(() => {
        if (typeof primary == "number") setActiveSubTab("scoreboard");
    }, [primary]);

    // If we leave the play route, switch away from scoreboard
    useEffect(() => {
        if (!inGame && activeSubTab === "scoreboard") setActiveSubTab("chat");
    }, [inGame]);


    // Dynamically add scoreboard tab if in game
    const PANEL_TABS: Array<{ key: PanelSubTab; label: string; Icon: React.ElementType }> = inGame
        ? [
            { key: "scoreboard", label: "Scoreboard", Icon: PlayIcon },
            ...BASE_PANEL_TABS.filter(tab => tab.key !== "scoreboard")
        ]
        : BASE_PANEL_TABS;

    if (!isLoggedIn) {
        return (
            <div className="power-panel-content panel-scrollbar2 flex flex-col p-2 sm:p-3">
                <SignInPane onSignIn={() => false} />
            </div>
        );
    }

    return (
        <div className="flex flex-1 z-10 min-h-0 h-full flex-col gap-4  relative  sm:gap-4 ">
            {/* Player card — shrink-0 ensures it never loses height */}
            {/* {!isPlayRoute && ( */}
                <div className={`shrink-0 ${isPlayRoute ? 'opacity-60' : ''}`}>
                    <CompressedGamerCard isPlayRoute={isPlayRoute} />
                </div>
            {/* )} */}
            

            


            {/* Compact sub-tab nav */}
            <div className={`shrink-0 h-full space-y-4 `}>
                <div className={`flex items-center gap-1  rounded-xl ${isPlayRoute ? 'opacity-80' : ''}  bg-white p-1 shadow-md`}>
                    {PANEL_TABS.map(({ key, label, Icon }: { key: PanelSubTab; label: string; Icon: React.ElementType }) => {
                        const isActive = activeSubTab === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveSubTab(key)}
                                className={`flex h-8 flex-1 items-center justify-center rounded-xl transition-colors ${isActive
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


            
            {/* Sub-tab content — stretches to bottom with pb-4 */}
            <div className="flex-1 min-h-0 h-[calc(100vh-10rem)]">
                {activeSubTab === "scoreboard" ? <ScoreboardPane roomSlug={null} /> : null}
                {activeSubTab === "chat" ? <ChatPane /> : null}
                {activeSubTab === "queue" ? <QueueList /> : null}
                {/* {activeSubTab === "friends" ? <FriendsList /> : null} */}
                {activeSubTab === "settings" ? <SettingsPane isPlayRoute={isPlayRoute} /> : null}
            </div>
            </div>
        </div>
    );
}
