import { useBucket } from "@/actions/bucket";
import { btActivePowerTab, btIsDockedWide, btIsLargeScreen, btUser, type PowerTabKey } from "@/actions/buckets";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import config from "../config";
import { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/react";
import { motion } from "motion/react"

export type { PowerTabKey };

type PowerBarProps = {
    className?: string;
    minimal?: boolean;
};

export function PowerBar({ className, minimal = false }: PowerBarProps) {
    const activePowerTab = useBucket(btActivePowerTab);
    const isLargeScreen = useBucket(btIsLargeScreen);
    const user = useBucket(btUser);


    const rawLevel = Number(user?.level ?? 1);
    const level = Number.isFinite(rawLevel) ? Math.max(1, rawLevel) : 1;
    const levelInt = Math.trunc(level);

    const avatarUrl = `${config.https.cdn}images/portraits/assorted-${user?.portraitid || 1}-medium.webp`;
    const isPanelOpen = activePowerTab !== null;

    let [dragging, setDragging] = useState(false);
    const onDragStart = () => {
        setDragging(true);
    }

    const handleAvatarClick = () => {
        if (dragging) return;
        if (isPanelOpen) {
            btActivePowerTab.set(null);
            btIsDockedWide.set(false);
        } else {
            btActivePowerTab.set("chat");
            if (isLargeScreen) {
                btIsDockedWide.set(true);
            }
        }
    };

    // const handleMouseDown = (e: React.MouseEvent) => {
    //     if (!minimal) return;
    //     const rect = buttonRef.current?.getBoundingClientRect();
    //     if (rect) {
    //         setDragOffset({
    //             x: e.clientX - rect.left,
    //             y: e.clientY - rect.top,
    //         });
    //     }
    //     setIsDragging(true);
    //     e.preventDefault();
    // };

    // const handleMouseMove = (e: MouseEvent) => {
    //     const x = e.clientX - dragOffset.x;
    //     const y = e.clientY - dragOffset.y;
    //     livePosition.current = { x, y };
    //     if (buttonRef.current) {
    //         buttonRef.current.style.transform = `translate(${x}px, ${y}px)`;
    //     }
    // };

    // const handleMouseUp = () => {
    //     setIsDragging(false);
    //     setPosition(livePosition.current); // Save final position in React state
    // };

    // useEffect(() => {
    //     if (!isDragging || !minimal) return;

    //     window.addEventListener("mousemove", handleMouseMove);
    //     window.addEventListener("mouseup", handleMouseUp);

    //     return () => {
    //         window.removeEventListener("mousemove", handleMouseMove);
    //         window.removeEventListener("mouseup", handleMouseUp);
    //     };
    // }, [isDragging, dragOffset, minimal]);

    // Minimal mode: only show portrait button (for theater mode)
    if (minimal) {
        return (
            <>
                {dragging && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 99,
                            background: "transparent",
                            pointerEvents: "all"
                        }}
                    />
                )}
                <motion.div drag dragElastic={0} dragMomentum={false} onDragStart={onDragStart} onDragEnd={() => setDragging(false)} style={{ position: "fixed", top: 0, right: '4rem', zIndex: 100 }}>
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        className={`h-10 w-10 rounded-xl p-0 border-0 bg-transparent focus:outline-none transition-transform duration-200 ${dragging ? "cursor-grabbing" : "cursor-grab hover:scale-110"}`}
                        aria-label="Open panel"
                        title="Open panel - drag to move"
                        style={{
                            position: "fixed",
                            top: 0,
                            right: '4rem',
                            zIndex: 100,
                        }}
                    >
                        <img
                            src={avatarUrl}
                            alt={user?.displayname ?? "Profile"}
                            className="h-10 w-10 rounded-xl object-cover border-2 border-white/30 hover:border-cyan-400 transition-[border-color] duration-200 pointer-events-none"
                        />
                    </button>
                </motion.div>
            </>
        );
    }

    return (
        <div className={className ?? "flex h-full items-center gap-3 shrink-0"}>
            {/* Level label — fades out when panel is open */}
            {user?.level != null ? (
                <span
                    className={`text-[11px] font-bold tabular-nums tracking-wide select-none transition-all duration-200 ${isPanelOpen && false ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-70 text-slate-700"
                        }`}
                >
                    LVL <span className="text-slate-700">{levelInt}</span>
                </span>
            ) : null}

            {/* Button wrapper — both states rendered, cross-faded via opacity/scale */}
            <div className="relative h-12 w-12 shrink-0">
                {/* Portrait button */}
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    className={`absolute inset-0 rounded-xl p-0 border-0 bg-transparent focus:outline-none transition-all duration-200 ${isPanelOpen && false ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
                        }`}
                    aria-label="Open panel"
                    aria-pressed={false}
                    tabIndex={isPanelOpen ? -1 : 0}
                >
                    <img
                        src={avatarUrl}
                        alt={user?.displayname ?? "Profile"}
                        className="h-12 w-12 rounded-xl object-cover border-2 border-white/30 hover:border-cyan-400 transition-[border-color] duration-200"
                    />
                </button>

                {/* Close panel button */}
                {/* <button
                    type="button"
                    onClick={handleAvatarClick}
                    className={`absolute inset-0 flex items-center justify-center rounded-full text-slate-100 hover:bg-slate-700 hover:text-white focus:outline-none transition-all duration-200 ${isPanelOpen ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                        }`}
                    aria-label="Close panel"
                    aria-pressed={true}
                    tabIndex={isPanelOpen ? 0 : -1}
                >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                </button> */}
            </div>
        </div>
    );
}