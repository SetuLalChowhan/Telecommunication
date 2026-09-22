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
    <section className="w-full border-b border-border/60 bg-muted/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <span className="eyebrow-text block text-primary">{content.badge}</span>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              {content.title}
            </h2>
            <p className="text-sm leading-relaxed text-secondary-text">
              {content.subtitle}
            </p>
          </div>

          <Button asChild variant="outline" className="shrink-0 gap-1.5">
            <Link href={content.ctaLink}>
              <span>{content.ctaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
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
