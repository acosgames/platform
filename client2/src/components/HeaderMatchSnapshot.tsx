import { SignalIcon, BoltIcon, ClockIcon } from "@heroicons/react/24/solid";

type SnapshotData = {
  status: "Starting" | "Live" | "Queueing" | "Post Match";
  mode: string;
  map: string;
  region: string;
  pingMs: number;
  etaLabel: string;
};

const EXAMPLE_SNAPSHOT: SnapshotData = {
  status: "Starting",
  mode: "Ranked 3v3",
  map: "Neo Citadel",
  region: "NA-East",
  pingMs: 28,
  etaLabel: "00:02",
};

function statusClasses(status: SnapshotData["status"]) {
  if (status === "Live") return "bg-emerald-100 text-emerald-700 border-emerald-300";
  if (status === "Starting") return "bg-amber-100 text-amber-700 border-amber-300";
  if (status === "Queueing") return "bg-cyan-100 text-cyan-700 border-cyan-300";
  return "bg-slate-100 text-slate-700 border-slate-300";
}

export function HeaderMatchSnapshot({ data = EXAMPLE_SNAPSHOT }: { data?: SnapshotData }) {
  return (
    <div className="h-10 min-w-[16rem] max-w-108 rounded-xl   px-2.5 ">
      <div className="flex h-full items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClasses(data.status)}`}>
              {data.status}
            </span>
            <p className="truncate text-[11px] font-semibold text-slate-700">{data.mode}</p>
          </div>
          <p className="truncate text-[11px] text-slate-500">{data.map} • {data.region}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-semibold text-slate-600">
            <SignalIcon className="h-3 w-3 text-cyan-600" />
            {data.pingMs}ms
          </div>
          <div className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-semibold text-slate-600">
            <ClockIcon className="h-3 w-3 text-amber-600" />
            {data.etaLabel}
          </div>
          <div className="hidden sm:inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1 text-slate-500">
            <BoltIcon className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
