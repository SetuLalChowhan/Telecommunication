import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/site/blogs/BlogCard";
import { Button } from "@/components/ui/button";
import { resolveBlogSection } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";
import {
  getBlogsServer,
  getFeaturedBlogsServer,
} from "@/features/blogs/api/server";

/**
 * Home page "Latest healthcare articles".
 *
 * Reads the featured selection from the API first; if editors have not marked
 * anything as featured, it falls back to the newest published posts, and only
 * then to an empty state.
 */
const BlogSection = async () => {
  const store = await getCmsSectionsServer();
  const content = resolveBlogSection(store);

  const featured = await getFeaturedBlogsServer();
  const posts =
    featured.length > 0
      ? featured.slice(0, content.limit)
      : (await getBlogsServer({ page: 1, limit: content.limit, sortBy: "newest" })).items;

  if (posts.length === 0) return null;

  return (
    <section className="w-full border-b border-border/60 bg-background py-16 sm:py-24">
      <div className="container-page">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center rounded-[30px] border border-border bg-[#dddcdd]/60 px-3.5 py-1 text-xs font-medium tracking-[0.24px] text-foreground">
              {content.badge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal leading-tight tracking-[-0.03em] text-foreground">
              {content.title}
            </h2>
            <p className="text-sm leading-relaxed text-secondary-text">
              {content.subtitle}
            </p>
          </div>

          <Link
            href={content.ctaLink}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[100px] border border-border bg-card px-5 py-2.5 text-sm font-normal text-foreground transition-colors hover:border-[#cbcbcb]"
          >
            <span>{content.ctaText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
