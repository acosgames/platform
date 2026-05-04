import { Link } from "react-router";
import { blogPosts } from "../data/blogData";

export function BlogIndex() {
  return (
    <div className="space-y-8 py-8 flex-1 container mx-auto px-2 lg:px-8 xl:px-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Blog</h1>
        <p className="text-muted-foreground text-sm mt-1">News, features, and deep dives from the ACOS team</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`} className="group block">
            <div className="aspect-video overflow-hidden rounded-md mb-3">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
                {post.category}
              </span>
              <span className="text-[10px] text-muted-foreground">{post.date}</span>
              <span className="text-[10px] text-muted-foreground">· {post.readTime}</span>
            </div>
            <p className="text-sm font-medium text-foreground leading-snug group-hover:text-cyan-400 transition-colors">
              {post.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-3">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
