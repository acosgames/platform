import { useBucket } from "@/actions/bucket";
import { btActivePowerTab, btIsDockedWide, btIsLargeScreen, btUser, type PowerTabKey } from "@/actions/buckets";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import config from "../config";

export type { PowerTabKey };

type PowerBarProps = {
    className?: string;
};

export function PowerBar({ className }: PowerBarProps) {
    const activePowerTab = useBucket(btActivePowerTab);
    const isLargeScreen = useBucket(btIsLargeScreen);
    const user = useBucket(btUser);

    const rawLevel = Number(user?.level ?? 1);
    const level = Number.isFinite(rawLevel) ? Math.max(1, rawLevel) : 1;
    const levelInt = Math.trunc(level);

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
            {/* Level label — fades out when panel is open */}
            {user?.level != null ? (
                <span
                    className={`text-[11px] font-bold tabular-nums tracking-wide select-none transition-all duration-200 ${
                        isPanelOpen ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-70 text-white/70"
                    }`}
                >
                    LVL <span className="text-white">{levelInt}</span>
                </span>
            ) : null}

            {/* Button wrapper — both states rendered, cross-faded via opacity/scale */}
            <div className="relative h-9 w-9 shrink-0">
                {/* Portrait button */}
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    className={`absolute inset-0 rounded-full p-0 border-0 bg-transparent focus:outline-none transition-all duration-200 ${
                        isPanelOpen ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
                    }`}
                    aria-label="Open panel"
                    aria-pressed={false}
                    tabIndex={isPanelOpen ? -1 : 0}
                >
                    <img
                        src={avatarUrl}
                        alt={user?.displayname ?? "Profile"}
                        className="h-9 w-9 rounded-full object-cover border-2 border-white/30 hover:border-cyan-400 transition-[border-color] duration-200"
                    />
                </button>

                {/* Close panel button */}
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    className={`absolute inset-0 flex items-center justify-center rounded-full text-slate-100 hover:bg-slate-700 hover:text-white focus:outline-none transition-all duration-200 ${
                        isPanelOpen ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
                    }`}
                    aria-label="Close panel"
                    aria-pressed={true}
                    tabIndex={isPanelOpen ? 0 : -1}
                >
                    <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}