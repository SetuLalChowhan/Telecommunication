import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import type { BlogPost } from "@/features/blogs";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      {/* Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            No cover image
          </span>
        )}

        <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-card/95 px-2 py-0.5 text-[11px] font-semibold text-primary">
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-secondary-text">
            <span className="font-semibold text-foreground">{post.author.name}</span>
            <span aria-hidden="true">&bull;</span>
            <time
              dateTime={post.publishedAtIso ?? undefined}
              className="inline-flex items-center gap-1"
            >
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              {post.publishedAt}
            </time>
          </div>

          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="line-clamp-3 text-xs leading-relaxed text-secondary-text sm:text-sm">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {post.readTime}
          </span>

          <Link
            href={`/blogs/${post.slug}`}
            className="group/link inline-flex items-center text-xs font-semibold text-primary transition-colors hover:text-primary-dark sm:text-sm"
          >
            <span>Read article</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
