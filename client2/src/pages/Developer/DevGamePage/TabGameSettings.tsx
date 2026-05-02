import { useBucket } from "@/actions/bucket";
import { btDevGame } from "@/actions/buckets";
import FSGSwitch from "@/components/inputs/FSGSwitch";
import schema from "shared/model/schema.json";

function SettingRow({ title, value }: { title: string; value?: any }) {
    return (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{title}</span>
            <span className="text-sm font-medium text-slate-700">{value ?? "—"}</span>
        </div>
    );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={["bg-white rounded-xl shadow-md overflow-hidden", className || ""].join(" ")}>
            {children}
        </div>
    );
}

function CardHeader({ children }: { children: React.ReactNode }) {
    return <div className="px-5 py-4 border-b border-slate-100">{children}</div>;
}

function CardBody({ children }: { children: React.ReactNode }) {
    return <div className="px-5 py-4">{children}</div>;
}

export default function TabGameSettings() {
    return (
        <div className="flex flex-col gap-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-4">
                <LeaderboardSettings />
                <div className="flex flex-col gap-4">
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl  text-sm text-slate-500">
                        Note: These settings are configured in{" "}
                        <span className="font-medium text-slate-700">game-settings.json</span>
                    </div>
                    <GameSettings />
                    <PlayerSettings />
                    <TeamSettings />
                </div>
            </div>
        </div>
    );
}

function LeaderboardSettings() {
    const group = "update-game_info";
    const rules = (schema as any)[group];

    return (
        <Card>
            <CardHeader>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Leaderboard</h3>
            </CardHeader>
            <CardBody>
                <FSGSwitch
                    name="lbscore"
                    id="lbscore"
                    rules={group}
                    group={group}
                    title="Enable Highscore?"
                    required={rules?.["lbscore"]?.required}
                />
            </CardBody>
        </Card>
    );
}

function GameSettings() {
    const devgame = useBucket(btDevGame) as any;
    if (!devgame) return null;

    const screenTypeNames: Record<number, string> = {
        1: "Full Screen",
        2: "Fixed Resolution",
        3: "Scaled Resolution",
    };

    const screenheight =
        devgame?.screentype === 3
            ? (devgame?.resoh / devgame?.resow) * devgame?.screenwidth
            : undefined;

    return (
        <Card>
            <CardHeader>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Screen Settings</h3>
            </CardHeader>
            <CardBody>
                <SettingRow title="Screen Type" value={screenTypeNames[devgame?.screentype] || "—"} />
                {devgame?.screentype !== 1 && (
                    <>
                        <SettingRow title="Resolution Width" value={devgame?.resow} />
                        <SettingRow title="Resolution Height" value={devgame?.resoh} />
                    </>
                )}
                {devgame?.screentype === 3 && (
                    <>
                        <SettingRow title="Screen Width" value={devgame?.screenwidth} />
                        <SettingRow title="Screen Height (auto)" value={screenheight} />
                    </>
                )}
            </CardBody>
        </Card>
    );
}

function PlayerSettings() {
    const devgame = useBucket(btDevGame) as any;

    return (
        <Card>
            <CardHeader>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Player Settings</h3>
            </CardHeader>
            <CardBody>
                <SettingRow title="Min Players" value={devgame?.minplayers} />
                <SettingRow title="Max Players" value={devgame?.maxplayers} />
            </CardBody>
        </Card>
    );
}

function TeamSettings() {
    const devgame = useBucket(btDevGame) as any;

    return (
        <Card>
            <CardHeader>
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Team Settings</h3>
            </CardHeader>
            <CardBody>
                <SettingRow title="Min Teams" value={devgame?.minteams} />
                <SettingRow title="Max Teams" value={devgame?.maxteams} />
            </CardBody>
        </Card>
    );
}
