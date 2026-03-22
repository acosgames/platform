export type LeaderboardSubtab = "division" | "rank" | "stats";
export type StatsMetric = "score" | "wins" | "win-rate";
export type TimeWindow = "season" | "monthly" | "weekly";
export type SeasonKey = "s12" | "s11" | "s10";

export type SeasonOption = {
  key: SeasonKey;
  label: string;
};
