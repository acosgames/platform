import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import {  Settings2, UserRound, Users } from "lucide-react";

import { useBucket } from "@/actions/bucket";
import { btUser } from "@/actions/buckets";
import config from "../config";

export type PowerTabKey = "profile" | "queue" | "friends" | "chat" | "settings";

type PowerBarProps = {
    activePowerTab: PowerTabKey | null;
    setActivePowerTab: React.Dispatch<React.SetStateAction<PowerTabKey | null>>;
    isLargeScreen: boolean;
    isDockedWide: boolean;
    setIsDockedWide: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
};

const powerItems = [
    { key: "profile", label: "Profile", Icon: UserRound },
    // { key: "queue", label: "Game Queue", Icon: Waypoints },
    { key: "friends", label: "Friends", Icon: Users },
    // { key: "chat", label: "Chat", Icon: MessageSquare },
    { key: "settings", label: "Settings", Icon: Settings2 },
] as const;

export function PowerBar({
    activePowerTab,
    setActivePowerTab,
    isLargeScreen,
    isDockedWide,
    setIsDockedWide,
    className,
}: PowerBarProps) {

    let user = useBucket(btUser);
    if (!user) {
        return null;
    }
    const avatarUrl = `${config.https.cdn}images/portraits/assorted-${user.portraitid || 1}-medium.webp`;
    
    return (
        <div className={className ?? "flex h-full items-center gap-1.5 shrink-0"}>
            {isLargeScreen ? (
                <button
                    type="button"
                    onClick={() => setIsDockedWide((prev) => !prev)}
                    className={`power-bar-btn ${isDockedWide ? "power-bar-btn-active" : ""}`}
                    aria-label={isDockedWide ? "Undock sidebar" : "Dock sidebar"}
                    title={isDockedWide ? "Undock sidebar" : "Dock sidebar"}
                    aria-pressed={isDockedWide}
                >
                    <ArrowsRightLeftIcon className="h-4 w-4" />
                </button>
            ) : null}
            {powerItems.map(({ key, label, Icon }) => {
                const isActive = activePowerTab === key;
                return (
                    <button
                        key={`powerbar-${key}`}
                        type="button"
                        onClick={() => setActivePowerTab((prev) => (prev === key ? null : key))}
                        className={`power-bar-btn ${isActive ? "power-bar-btn-active" : ""}`}
                        aria-label={label}
                        title={label}
                        aria-pressed={isActive}
                    >
                        {key === "profile" ? (
                            <img
                                src={avatarUrl}
                                alt={user.name}
                                className={`h-10 w-10 rounded-full object-cover border ${isActive ? "border-cyan-300" : "border-white/30"}`}
                            />
                        ) : (
                            <Icon className="h-4 w-4" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}