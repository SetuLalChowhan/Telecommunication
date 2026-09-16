import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import BlogCard from "@/components/site/blogs/BlogCard";
import { Button } from "@/components/ui/button";

export const BlogSection: React.FC = () => {
  const homePosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="w-full bg-slate-50/60 dark:bg-slate-900/20 py-14 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-4">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
              Health Insights & Medical Articles
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground">
              Latest Healthcare Articles & Tips
            </h2>
            <p className="text-sm sm:text-[15px] text-secondary-text leading-relaxed">
              Stay informed with verified medical advice, preventative care tips, and telehealth guidance written and reviewed by certified physicians.
            </p>
          </div>

          <Link href="/blogs" className="shrink-0">
            <Button variant="outline" className="rounded-xl h-10 px-4 text-xs sm:text-sm font-semibold gap-1.5 border-border hover:border-primary/40 hover:text-primary">
              <span>Explore All Articles</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homePosts.map((blog) => (
            <BlogCard key={blog.id} post={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

