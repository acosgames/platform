import { Link } from "react-router";
import config from "../../config";
import { PencilIcon, ArrowTopRightOnSquareIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

interface DevGameListItemProps {
    gameid?: string;
    name: string;
    totalPlays?: number;
    totalVotes?: number;
    version?: number;
    latest_version?: number;
    game_slug: string;
    preview_images?: string;
}

export default function DevGameListItem({
    name,
    totalPlays,
    totalVotes,
    version,
    latest_version,
    game_slug,
    preview_images,
}: DevGameListItemProps) {
    const imgUrl =
        preview_images && preview_images.length > 0
            ? `${config.https.cdn}g/${game_slug}/preview/${preview_images}`
            : config.https.cdn + "placeholder.png";

    return (
        <div className="relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Top action bar */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <a
                    href={`https://github.com/acosgames/${game_slug}`}
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                >
                    <CodeBracketIcon className="w-3.5 h-3.5" />
                </a>
                <Link
                    to={`/game/${game_slug}`}
                    title="View public page"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </Link>
                <Link
                    to={"/dev/game/" + game_slug}
                    title="Edit"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 hover:bg-slate-700 text-white transition"
                >
                    <PencilIcon className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Image + title */}
            <Link to={"/dev/game/" + game_slug} className="flex items-center gap-3 px-4 pt-4 pb-3 pr-28">
                <img
                    src={imgUrl}
                    alt={"Icon for " + name}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = config.https.cdn + "placeholder.png";
                    }}
                />
                <div className="min-w-0">
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900 truncate">{name}</h3>
                    <p className="text-[11px] font-medium text-slate-400 truncate">{game_slug}</p>
                </div>
            </Link>

            {/* Stats bar */}
            <div className="grid grid-cols-4 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50">
                {[
                    { label: "Plays", value: totalPlays ?? 0 },
                    { label: "Favs", value: totalVotes ?? 0 },
                    { label: "Live", value: version ?? 0 },
                    { label: "Latest", value: latest_version ?? 0 },
                ].map((stat) => (
                    <div key={stat.label} className="px-2 py-2 text-center">
                        <p className="text-sm font-black text-slate-800">{stat.value}</p>
                        <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
