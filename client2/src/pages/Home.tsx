import { Link } from "react-router";
import { GameCard } from "../components/GameCard";
// import { games } from "../data/mockData";
import { blogPosts } from "../data/blogData";
import { useEffect, useState } from "react";
import { findGames } from "@/actions/game";
import { btGames } from "@/actions/buckets";
import { useLoading } from "@/actions/loading";

const panelClassName = "relative overflow-hidden rounded-xl shadow-md";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  let gamesMap = useLoading('games', btGames) || {};
  
  let game_slugs:any = Object.keys(gamesMap);

  useEffect(() => {
    findGames();
  }, []);

  return (
    <div className="space-y-4 py-4 flex-1 relative container mx-auto px-2 lg:px-8 xl:px-20">
      {/* Featured Games */}
      <section className="overflow-hidden rounded-xl bg-white p-2 shadow-md">
        {/* Dark hero header — matches GameDetail hero */}
        <div className="bg-slate-950 px-5 py-6 rounded-lg ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <div className="mb-2">
                <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-[12px] font-semibold tracking-wide text-cyan-300 uppercase">
                  Curated Picks
                </span>
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                Featured Games
              </h1>
              <p className="text-slate-300 text-sm mt-1">Discover and play amazing multiplayer games</p>
              {/* <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-2.5 py-1 font-semibold text-white">{game_slugs.length} live titles</span>
                <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-2.5 py-1 font-semibold text-white">ranked matchmaking</span>
                <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-2.5 py-1 font-semibold text-white">active community</span>
              </div> */}
            </div>
            {/* Search */}
            {/* <div className="relative shrink-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-white/8 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-colors"
              />
            </div> */}
          </div>
        </div>

        {/* White game grid — matches GameDetail white stats + content panels */}
        <div className="bg-white p-3 sm:p-5 lg:p-7">
          {game_slugs.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {game_slugs.map((game_slug:string) => (
                <div key={game_slug} className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <GameCard game_slug={game_slug} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <p className="text-slate-500">No games found for &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog */}
      <Blog />

      {/* FAQ */}
      <FAQ />
    </div>
  );
}

function Blog() {
  return (
    <div className={`${panelClassName} bg-white p-5 sm:p-7 lg:p-9`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Latest News</h2>
        <Link to="/blog" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">View all →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {blogPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="group block rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="aspect-video overflow-hidden rounded-xl mb-3 border border-slate-200/80 group-hover:border-blue-400">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover  group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-800">{post.category}</span>
              <span className="text-[10px] text-slate-600">{post.date}</span>
              <span className="text-[10px] text-slate-600">· {post.readTime}</span>
            </div>
            <p className="text-sm font-medium text-slate-950 leading-snug group-hover:text-slate-900 transition-colors">{post.title}</p>
            <p className="text-xs text-slate-900 mt-1 leading-relaxed line-clamp-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "What is ACOS.games for players?",
    a: "ACOS.games is a place to discover competitive multiplayer games, queue into fair matches, track your progress, and stay connected with a growing game community in one portal.",
  },
  {
    q: "Is ACOS free to use?",
    a: "Yes. Creating an account, browsing games, and playing supported titles on ACOS is free. Some individual games may include optional in-game purchases, depending on the game creator.",
  },
  {
    q: "How does matchmaking work for players?",
    a: "When you queue, ACOS tries to pair you with players of similar skill for balanced matches. If the queue is quiet, the match range expands gradually so you still get games in a reasonable time.",
  },
  {
    q: "Are rankings and leaderboards fair?",
    a: "Rank and rating updates are based on match outcomes, so progress reflects your performance over time. Leaderboards and highscores update automatically after completed games.",
  },
  {
    q: "Can I play with friends?",
    a: "Yes. Depending on the game, you can join the same queue, share lobby details, and compete together or against each other. Social and party features continue to expand over time.",
  },
  {
    q: "How secure is my gameplay session?",
    a: "ACOS uses secure network communication and platform safeguards to protect sessions and reduce abuse. We continuously improve protections so players can focus on fair, stable matches.",
  },
  {
    q: "Where can I report bugs or get help?",
    a: "You can submit feedback through ACOS channels and join the community Discord for support, updates, and direct communication with the team and other players.",
  },
  {
    q: "How do I get started quickly?",
    a: "Create an account, pick a game from Featured Games, and jump into queue. You can track rank, highscores, and recent activity as you play more matches.",
  },
];

function FAQ() {
  return (
    <div className={`${panelClassName} bg-white p-5 sm:p-7 lg:p-9`}>
      <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-6">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
        {faqs.map(({ q, a }, index) => (
          <div key={q} className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-md">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <p className="text-sm font-medium text-slate-950">{q}</p>
            </div>
            <p className="text-sm text-slate-900 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}