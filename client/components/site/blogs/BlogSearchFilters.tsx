"use client";

import React from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BlogCategory, BlogSortBy } from "@/features/blogs";
import { cn } from "@/lib/utils";

interface BlogSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: BlogSortBy;
  onSortChange: (sort: BlogSortBy) => void;
  categories: BlogCategory[];
  /** Total matches reported by the API for the current query. */
  totalCount: number;
  isLoading: boolean;
  onReset: () => void;
}

const ALL = "all";

export const BlogSearchFilters: React.FC<BlogSearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  categories,
  totalCount,
  isLoading,
  onReset,
}) => {
  const isFiltered =
    searchQuery.trim() !== "" || (selectedCategory !== ALL && selectedCategory !== "");

  return (
    <div className="space-y-5">
      {/* Search + sort */}
      <div className="flex flex-col items-stretch justify-between gap-3 border-b border-border pb-5 sm:flex-row sm:items-center">
        <div className="relative max-w-xl flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="blog-search" className="sr-only">
            Search articles
          </label>
          <Input
            id="blog-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search articles by title, topic, condition, or author..."
            className="h-10 pl-9 pr-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2.5 sm:justify-end">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            Sort
          </span>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as BlogSortBy)}
          >
            <SelectTrigger className="h-10 w-[170px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="popular">Most read</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => onSelectCategory(ALL)}
            className={cn(
              "shrink-0 cursor-pointer rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              selectedCategory === ALL || selectedCategory === ""
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            All articles
          </button>

          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => onSelectCategory(category.name)}
              className={cn(
                "shrink-0 cursor-pointer rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                selectedCategory === category.name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {category.name}
              <span className="ml-1.5 text-[10px] opacity-70">{category.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Updating results…
            </>
          ) : (
            <>
              <strong className="font-semibold text-foreground">{totalCount}</strong>
              {totalCount === 1 ? "article" : "articles"}
              {selectedCategory !== ALL && selectedCategory !== "" && (
                <>
                  {" in "}
                  <strong className="font-semibold text-foreground">
                    {selectedCategory}
                  </strong>
                </>
              )}
            </>
          )}
        </span>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs font-semibold"
          >
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default BlogSearchFilters;
