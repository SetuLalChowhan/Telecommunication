import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import BlogCard from "@/components/site/blogs/BlogCard";
import { Button } from "@/components/ui/button";

export const BlogSection: React.FC = () => {
  const homePosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="w-full bg-muted/30 py-16 sm:py-20 border-b border-border/60">
      <div className="container-page">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="max-w-2xl space-y-3">
            <span className="eyebrow-text block text-primary">
              Health insights & medical articles
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-foreground">
              Latest healthcare articles & tips
            </h2>
            <p className="text-sm text-secondary-text leading-relaxed">
              Stay informed with verified medical advice, preventative care tips, and telehealth guidance written and reviewed by certified physicians.
            </p>
          </div>

          <Link href="/blogs" className="shrink-0">
            <Button variant="outline" className="h-10 px-4 text-sm font-semibold gap-1.5">
              <span>Explore all articles</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {homePosts.map((blog) => (
            <BlogCard key={blog.id} post={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

