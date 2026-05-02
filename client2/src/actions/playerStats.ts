import { btPlayerStatHistory, btPlayerStats } from "./buckets";
import { POST } from "./http";

/**
 * Fetches all global stats for a player for a given game_slug.
 * Results are stored in btPlayerStats keyed by game_slug.
 */
export async function getPlayerGlobalStats({ shortid, game_slug }: { shortid: string; game_slug: string }) {
  const response = await POST(`/api/v1/player/globalstats/${game_slug}`, { shortid });
  btPlayerStats.assign({ [game_slug]: { ...btPlayerStats.get()?.[game_slug], global: response.data } });
  return response.data;
}

/**
 * Fetches the stat history for a player for a given stat_slug and game_slug.
 * @param {Object} params
 * @param {string} params.shortid - The player's shortid
 * @param {string} params.game_slug - The game slug
 * @param {string} params.stat_slug - The stat slug to fetch
 * @param {number} [params.days=30] - Number of days of history to fetch
 * @returns {Promise<Array<{ tsinsert: string, value: number }>>}
 */
export async function getPlayerStatHistory({ shortid, game_slug, stat_slug, days = 30 }: { shortid: string; game_slug: string; stat_slug: string; days?: number }) {
  const response = await POST(`/api/v1/player/stats/${game_slug}`, {
    shortid,
    game_slug,
    stat_slug,
    days,
  });
  btPlayerStatHistory.set(response.data);
  return response.data;
}
