import { Link } from "react-router";
import { GameCard } from "../components/GameCard";
// import { games } from "../data/mockData";
import { blogPosts } from "../data/blogData";
import { useEffect, useState } from "react";
import { findGames } from "@/actions/game";
import { btGames } from "@/actions/buckets";
import { useLoading } from "@/actions/loading";

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
    <div className="space-y-20 py-10 flex-1 relative">
      {/* Radial gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-1">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-radial from-cyan-500/15 via-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-radial from-pink-500/15 via-purple-500/10 to-transparent blur-3xl" />
      </div>
      <section className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Featured Games
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Discover and play amazing multiplayer games</p>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 rounded-md bg-card border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          />
        </div>
      </div>

      {/* Game grid */}
      {game_slugs.length > 0 ? ( 
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {game_slugs.map((game_slug:string) => {
            return <GameCard key={game_slug} game_slug={game_slug} />
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <span className="text-4xl">🔍</span>
          <p className="text-muted-foreground">No games found for &ldquo;{searchQuery}&rdquo;</p>
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
    <div className="mt-6 pt-12 relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-200/75 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-28 -translate-x-1/2 bg-blue-100/60 blur-sm" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Latest News</h2>
        <Link to="/blog" className="text-xs text-slate-200 hover:text-blue-300 transition-colors">View all →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {blogPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="group block ">
            <div className="aspect-video overflow-hidden rounded-lg mb-3 border-2 group-hover:border-secondary">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover  group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">{post.category}</span>
              <span className="text-[10px] text-muted-foreground">{post.date}</span>
              <span className="text-[10px] text-muted-foreground">· {post.readTime}</span>
            </div>
            <p className="text-sm font-medium text-foreground leading-snug group-hover:text-secondary transition-colors">{post.title}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{post.excerpt}</p>
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
    <div className="mt-8 pt-12 relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-200/75 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-28 -translate-x-1/2 bg-cyan-100/60 blur-sm" />
      <h2 className="text-lg font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
        {faqs.map(({ q, a }) => (
          <div key={q}>
            <p className="text-sm font-medium text-foreground mb-1.5">{q}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}