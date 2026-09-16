"use client";

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BLOG_CATEGORIES } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

interface BlogSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: "latest" | "readTime" | "title";
  onSortChange: (sort: "latest" | "readTime" | "title") => void;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export const BlogSearchFilters: React.FC<BlogSearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const isFiltered = searchQuery.trim() !== "" || selectedCategory !== "All Articles";

  return (
    <div className="space-y-6">
      {/* Top Search Bar & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search articles by title, topic, condition, or author..."
            className="pl-10 pr-9 h-11 rounded-xl bg-card border-border shadow-xs text-sm placeholder:text-muted-foreground focus-visible:ring-primary/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Quick Stats */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "latest" | "readTime" | "title")}
            className="h-10 px-3 py-1 text-xs sm:text-sm font-medium rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-xs"
          >
            <option value="latest">Latest Published</option>
            <option value="readTime">Shortest Read Time</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {BLOG_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 border cursor-pointer",
                isSelected
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Results status and clear button */}
      {isFiltered && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5 text-xs">
          <span className="text-secondary-text">
            Showing <strong className="text-foreground">{filteredCount}</strong> of{" "}
            {totalCount} articles
            {selectedCategory !== "All Articles" && (
              <> in <strong className="text-primary">{selectedCategory}</strong></>
            )}
            {searchQuery && (
              <> matching &ldquo;<strong className="text-primary">{searchQuery}</strong>&rdquo;</>
            )}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs font-semibold text-primary hover:text-primary-dark p-0 hover:bg-transparent"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogSearchFilters;
