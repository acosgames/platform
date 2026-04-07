import { Link, useParams } from "react-router";
import { blogPosts } from "../data/blogData";

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 flex-1">
        <p className="text-lg font-semibold text-foreground">Post not found</p>
        <Link to="/blog" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const paragraphs = post.content.split("\n\n");

  return (
    <article className="py-8 flex-1 max-w-2xl mx-auto w-full">
      {/* Back link */}
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors mb-6">
        ← Back to Blog
      </Link>

      {/* Hero image */}
      <div className="aspect-video overflow-hidden rounded-md mb-6">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400">
          {post.category}
        </span>
        <span className="text-[10px] text-muted-foreground">{post.date}</span>
        <span className="text-[10px] text-muted-foreground">· {post.readTime}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground leading-snug mb-6">{post.title}</h1>

      {/* Content */}
      <div className="space-y-4">
        {paragraphs.map((block, i) => {
          if (block.startsWith("**") && block.endsWith("**")) {
            return (
              <h2 key={i} className="text-lg font-semibold text-foreground mt-6">
                {block.slice(2, -2)}
              </h2>
            );
          }
          // Inline bold: replace **text** with <strong>
          const parts = block.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className="text-base text-muted-foreground leading-relaxed">
              {parts.map((part, j) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={j} className="text-foreground font-medium">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        })}
      </div>
    </article>
  );
}
