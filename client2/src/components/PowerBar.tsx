import { useBucket } from "@/actions/bucket";
import { btActivePowerTab, btIsDockedWide, btIsLargeScreen, btUser, type PowerTabKey } from "@/actions/buckets";
import config from "../config";

export type { PowerTabKey };

type PowerBarProps = {
    className?: string;
};

export function PowerBar({ className }: PowerBarProps) {
    const activePowerTab = useBucket(btActivePowerTab);
    const isLargeScreen = useBucket(btIsLargeScreen);
    const user = useBucket(btUser);

    const avatarUrl = `${config.https.cdn}images/portraits/assorted-${user?.portraitid || 1}-medium.webp`;
    const isPanelOpen = activePowerTab !== null;

    const handleAvatarClick = () => {
        if (isPanelOpen) {
            btActivePowerTab.set(null);
            btIsDockedWide.set(false);
        } else {
            btActivePowerTab.set("profile");
            if (isLargeScreen) {
                btIsDockedWide.set(true);
            }
        }
    };

    return (
        <div className={className ?? "flex h-full items-center gap-3 shrink-0"}>
            {user?.level != null ? (
                <span className="text-[11px] font-bold text-white/70 tabular-nums tracking-wide select-none">
                    LVL <span className="text-white">{user.level}</span>
                </span>
            ) : null}
            <button
                type="button"
                onClick={handleAvatarClick}
                className="shrink-0 rounded-full p-0 border-0 bg-transparent focus:outline-none"
                aria-label={isPanelOpen ? "Close panel" : "Open panel"}
                aria-pressed={isPanelOpen}
            >
                <img
                    src={avatarUrl}
                    alt={user?.displayname ?? "Profile"}
                    className={`h-9 w-9 rounded-full object-cover border-2 transition-all duration-200 ${
                        isPanelOpen ? "border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "border-white/30 hover:border-white/60"
                    }`}
                />
            </button>
        </div>
    );
}