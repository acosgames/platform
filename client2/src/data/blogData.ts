export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Season 3 Ranked Reset — What You Need to Know",
    excerpt:
      "The new season kicks off April 1st. Here's a breakdown of rating resets, new rank tiers, and what rewards carry over from Season 2.",
    category: "News",
    date: "Mar 24, 2026",
    readTime: "3 min read",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80",
    content: `Season 3 of ACOS Ranked is just around the corner, and with it comes a full rating reset alongside a brand-new tier structure. Here's everything you need to know before the season goes live on April 1st.

**Rating Reset**

All player ratings will undergo a soft reset. If you finished Season 2 in Platinum or above, your new starting Elo will be anchored closer to Gold rather than dropping you all the way to Bronze. Placement matches (5 games) at the start of the season will calibrate your final starting rank.

**New Rank Tiers**

We're introducing a new tier between Diamond and Master: *Emerald*. This gives top players a clearer ladder to climb before reaching the highly competitive Master bracket. The full tier order is now: Bronze → Silver → Gold → Platinum → Emerald → Diamond → Master → Grandmaster.

**Carry-Over Rewards**

Cosmetic rewards earned in Season 2 — including profile borders, animated banners, and exclusive avatars — are yours to keep permanently. Season 3 will introduce its own reward track with new cosmetics tied to end-of-season rank.

**What's New in Season 3**

Beyond the structural changes, Season 3 introduces map voting in ranked queues, a new ban phase for select titles, and improved post-game stat breakdowns. Detailed patch notes will be published on March 31st.

Good luck in placements — see you on the leaderboard.`,
  },
  {
    id: "2",
    title: "Introducing Custom Lobbies",
    excerpt:
      "You can now create private lobbies for any game on the platform, set custom rules, and invite friends directly with a shareable link.",
    category: "Feature",
    date: "Mar 19, 2026",
    readTime: "2 min read",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
    content: `We're excited to roll out Custom Lobbies — one of our most requested features since the platform launched.

**How It Works**

From any game's detail page, click *Create Custom Lobby*. You'll get a unique shareable link and a 6-character join code. Share either with friends; they don't need to be on your friends list to join.

**Custom Rules**

Depending on the game, lobby creators can adjust settings like match duration, team size, score limits, and friendly-fire rules. Not every game supports every option, but we're working with developers to expand the ruleset over time.

**Private vs. Public Lobbies**

By default, custom lobbies are private (invite-only). You can toggle them to *Public* to let anyone searching for a lobby join — great for community events and tournaments.

**Spectator Mode**

Custom lobbies support up to 10 spectators. Spectators can watch in real-time but cannot interact with the match. Replays of custom lobby games are saved the same way ranked matches are.

Custom Lobbies are available today for all games on the platform. Let us know what you think in the community Discord.`,
  },
  {
    id: "3",
    title: "Behind the Matchmaker: How ACOS Finds Your Perfect Match",
    excerpt:
      "A deep dive into the skill-based matchmaking algorithm powering ACOS — from Elo adjustments to latency-aware server selection.",
    category: "Deep Dive",
    date: "Mar 12, 2026",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=1200&q=80",
    content: `Good matchmaking is invisible. When it works, you barely notice it — you just end up in close, competitive games. When it doesn't, every loss feels unfair. Here's an inside look at how the ACOS matchmaker works.

**The Core: Elo with Uncertainty**

At its heart, ACOS uses a modified Elo rating system. Each player has a rating (μ) and an uncertainty value (σ). New accounts start with high σ, meaning the system isn't confident in their rating yet, so it moves their μ aggressively in early matches. As σ falls, rating changes stabilise.

This is similar to the TrueSkill system used by Microsoft — but we've made adjustments for our specific game types, particularly around team-based games where individual contribution is harder to isolate.

**Queue Windows**

When you enter a queue, the matchmaker creates a search window around your rating. Every 15 seconds without a match, the window expands slightly. This balances match quality against wait time — most matches are found within the first two expansions.

**Latency-Aware Server Selection**

Rating is only half the equation. Once the matchmaker has found a compatible group, it pings regional servers and selects the one with the lowest average latency across all players. If the best server would give one player >150ms, the group is held briefly to see if a better server becomes available.

**Smurfing Detection**

We track behavioural signals beyond just win/loss — including in-game performance metrics provided by game developers — to detect accounts playing significantly below their true skill level. Detected smurfs are fast-tracked through the rating system, and repeat offenders face account restrictions.

**What We're Working On**

Our next matchmaking update will introduce role-based matching for games that support hero or class selection, and a transparency dashboard so players can see roughly where they are in the queue at any given moment. Stay tuned.`,
  },
];
