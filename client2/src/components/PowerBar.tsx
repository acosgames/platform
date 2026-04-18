import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { Settings2, UserRound, Users } from "lucide-react";
import { useBucket } from "@/actions/bucket";
import { btActivePowerTab, btIsDockedWide, btIsLargeScreen, btUser, type PowerTabKey } from "@/actions/buckets";
import config from "../config";

export type { PowerTabKey };

type PowerBarProps = {
    className?: string;
};

const powerItems = [
    { key: "profile", label: "Profile", Icon: UserRound },
    // { key: "queue", label: "Game Queue", Icon: Waypoints },
    { key: "friends", label: "Friends", Icon: Users },
    // { key: "chat", label: "Chat", Icon: MessageSquare },
    { key: "settings", label: "Settings", Icon: Settings2 },
] as const;

export function PowerBar({ className }: PowerBarProps) {
    const activePowerTab = useBucket(btActivePowerTab);
    const isDockedWide = useBucket(btIsDockedWide);
    const isLargeScreen = useBucket(btIsLargeScreen);
    const user = useBucket(btUser);

    const avatarUrl = `${config.https.cdn}images/portraits/assorted-${user?.portraitid || 1}-medium.webp`;

    return (
        <div className={className ?? "flex h-full items-center gap-1.5 shrink-0"}>
            {isLargeScreen ? (
                <button
                    type="button"
                    onClick={() => btIsDockedWide.set((prev) => !prev)}
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
                        onClick={() => btActivePowerTab.set((prev) => (prev === key ? null : (key as PowerTabKey)))}
                        className={`power-bar-btn ${isActive ? "power-bar-btn-active" : ""}`}
                        aria-label={label}
                        title={label}
                        aria-pressed={isActive}
                    >
                        {key === "profile" ? (
                            <img
                                src={avatarUrl}
                                alt={user?.displayname ?? "Profile"}
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