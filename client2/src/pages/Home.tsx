import { Link } from "react-router";
import { GameCard } from "../components/GameCard";
// import { games } from "../data/mockData";
import { blogPosts } from "../data/blogData";
import { useEffect, useState } from "react";
import { findGames } from "@/actions/game";
import { btGames } from "@/actions/buckets";
import { useLoading } from "@/actions/loading";

const panelClassName = "relative overflow-hidden rounded-[28px] shadow-md";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  let gamesMap = useLoading('games', btGames) || {};
  
  let game_slugs:any = Object.keys(gamesMap);
  // const filteredGames = games.filter(game =>
  //   game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   game.category.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  useEffect(() => {
    findGames();
  }, []);

  return (
    <div className="space-y-12 pb-10 flex-1 relative">
      {/* Radial gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-1">
        {/* <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-radial from-cyan-500/20 via-blue-400/10 to-transparent blur-3xl" /> */}
        {/* <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-radial from-orange-300/25 via-pink-300/10 to-transparent blur-3xl" /> */}
        {/* <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.18)_1px,transparent_0)] bg-size-[22px_22px]" /> */}
      </div>
      <section className={`${panelClassName} space-y-10 p-2 sm:p-7 lg:p-9 pt-0 sm:pt-0 lg:pt-0 text-slate-50`}>
      {/* <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-cyan-100/60 via-blue-50/30 to-transparent" /> */}
      {/* <div className="pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-full bg-cyan-200/35 blur-2xl" /> */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0">
        <div className="flex flex-col gap-0">
          <div className="mb-2">
          <span className="inline h-auto items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[12px] font-semibold tracking-wide text-cyan-700 uppercase">
            Curated Arena Picks
          </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-50">
            Featured Games
          </h1>
          <p className="text-slate-100 text-sm mt-1">Discover and play amazing multiplayer games</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-950">{game_slugs.length} live titles</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-950">ranked matchmaking</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-950">active community</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-white border border-slate-300 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-cyan-100 transition-colors shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
          />
        </div>
      </div>

      {/* Game grid */}
      {game_slugs.length > 0 ? ( 
        <div className="grid grid-cols-2 gap-4 sm:gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 ">
          {game_slugs.map((game_slug:string) => {
            return (
              <div key={game_slug} className="rounded-2xl border border-slate-200 bg-white p-2 shadow-md transition-transform duration-300 hover:-translate-y-1">
                <GameCard game_slug={game_slug} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <span className="text-4xl">🔍</span>
          <p className="text-slate-100">No games found for &ldquo;{searchQuery}&rdquo;</p>
        </div>
      )}
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
    <div className={`${panelClassName} mt-2 p-5 sm:p-7 lg:p-9 text-slate-50`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 " />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-28 -translate-x-1/2  blur-sm" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-50">Latest News</h2>
        <Link to="/blog" className="text-xs text-slate-100 hover:text-slate-50 transition-colors">View all →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {blogPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="group block rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_12px_25px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(15,23,42,0.12)]">
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
    <div className={`${panelClassName} mt-2 p-5 sm:p-7 lg:p-9 text-slate-50`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 " />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-28 -translate-x-1/2 bg-cyan-100/60 blur-sm" />
      <h2 className="text-lg font-semibold text-slate-50 mb-6">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
        {faqs.map(({ q, a }, index) => (
          <div key={q} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
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