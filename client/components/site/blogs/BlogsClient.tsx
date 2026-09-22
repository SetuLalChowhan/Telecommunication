"use client";

import React, { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOG_POSTS } from "@/lib/blog-data";
import BlogCard from "@/components/site/blogs/BlogCard";

const ITEMS_PER_PAGE = 6;

export function BlogsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    let result = [...BLOG_POSTS];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.author.name.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    }

    return result;
  }, [searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <section className="w-full bg-muted/30 py-12 sm:py-16 border-b border-border/60">
        <div className="container-page">
          <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <span className="eyebrow-text block text-primary">
              Health insights & articles
            </span>
            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-foreground">
              Healthcare articles & blogs
            </h1>
            <p className="text-sm text-secondary-text max-w-lg mx-auto leading-relaxed">
              Stay informed with verified medical advice, preventative care tips, and telehealth guidance from certified doctors.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container-page pt-10 sm:pt-12 space-y-8 sm:space-y-10">
        {/* Simple Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search blogs by title, topic, or author..."
              className="w-full h-11 rounded-lg border border-border bg-card pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
                aria-label="Clear search"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Sort:</span>
            </div>
            <Select
              value={sortBy}
              onValueChange={(val: "newest" | "oldest") => {
                setSortBy(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 w-[160px] rounded-lg border border-border bg-card text-foreground px-3.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl border border-border bg-popover p-1.5 shadow-lg">
                <SelectItem value="newest" className="rounded-lg text-xs sm:text-sm cursor-pointer">
                  Newest first
                </SelectItem>
                <SelectItem value="oldest" className="rounded-lg text-xs sm:text-sm cursor-pointer">
                  Oldest first
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blog Post 3-Column Grid */}
        {paginatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <FileQuestion className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">No articles found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;.
              </p>
            </div>
            <Button onClick={handleReset} variant="outline" className="rounded-lg text-xs h-9">
              Clear search
            </Button>
          </div>
        )}

        {/* Simple Clean Pagination */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredPosts.length} total blogs)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg h-9 px-3 gap-1 text-xs border-border"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-lg h-9 px-3 gap-1 text-xs border-border"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
