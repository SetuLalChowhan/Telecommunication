"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, FileQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/site/blogs/BlogCard";
import BlogSearchFilters from "@/components/site/blogs/BlogSearchFilters";
import { useBlogCategories, useBlogs } from "@/features/blogs";
import type { BlogCategory, BlogListResult, BlogSortBy } from "@/features/blogs";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

const SEARCH_DEBOUNCE_MS = 400;
const SORT_OPTIONS: BlogSortBy[] = ["newest", "oldest", "popular"];

interface BlogsClientProps {
  /**
   * Prefetched on the server for the current URL, then handed to React Query as
   * `initialData`. The first paint is fully server-rendered — the client does
   * not refetch on mount.
   */
  initialData: BlogListResult;
  initialCategories: BlogCategory[];
}

export function BlogsClient({ initialData, initialCategories }: BlogsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- URL is the single source of truth for every filter -------------------
  const urlSearch = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const sortParam = searchParams.get("sort");
  const sortBy: BlogSortBy = SORT_OPTIONS.includes(sortParam as BlogSortBy)
    ? (sortParam as BlogSortBy)
    : "newest";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  // `lastPushed` is the query string this client last wrote to the URL. It is
  // what lets us tell "the user typed" apart from "the user hit Back", so the
  // input and the URL can sync in both directions without an update loop.
  const lastPushedRef = useRef(urlSearch);
  const skipNextPushRef = useRef(false);

  const applyParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  // URL -> input (Back/Forward, or arriving from a shared link).
  useEffect(() => {
    if (urlSearch === lastPushedRef.current) return;
    lastPushedRef.current = urlSearch;
    skipNextPushRef.current = true;
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // input -> URL, debounced so typing does not navigate on every keystroke.
  useEffect(() => {
    if (skipNextPushRef.current) {
      skipNextPushRef.current = false;
      return;
    }

    const trimmed = debouncedSearch.trim();
    if (trimmed === lastPushedRef.current.trim()) return;

    lastPushedRef.current = trimmed;
    applyParams({ q: trimmed || null, page: null });
  }, [debouncedSearch, applyParams]);

  const { data, isFetching, isPlaceholderData } = useBlogs(
    { search: urlSearch, category, sortBy, page },
    { initialData }
  );

  const { data: categories = initialCategories } = useBlogCategories({
    initialData: initialCategories,
  });

  const posts = data?.items ?? [];
  const meta = data?.meta ?? initialData.meta;
  const totalPages = Math.max(1, meta.totalPages);
  const showSpinner = isFetching && isPlaceholderData;

  const handleCategoryChange = (next: string) => {
    applyParams({ category: next === "all" ? null : next, page: null });
  };

  const handleSortChange = (next: BlogSortBy) => {
    applyParams({ sort: next === "newest" ? null : next, page: null });
  };

  const handleReset = () => {
    lastPushedRef.current = "";
    setSearchInput("");
    applyParams({ q: null, category: null, sort: null, page: null });
  };

  return (
    <main className="container-page space-y-8 pb-20 pt-10 sm:pt-12">
      <BlogSearchFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        selectedCategory={category}
        onSelectCategory={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        categories={categories}
        totalCount={meta.total}
        isLoading={isFetching && isPlaceholderData}
        onReset={handleReset}
      />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            {showSpinner ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <FileQuestion className="h-6 w-6" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {showSpinner ? "Loading articles" : "No articles found"}
            </h3>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {showSpinner
                ? "Fetching the latest matching articles…"
                : `We couldn't find articles matching the current filters.`}
            </p>
          </div>
          {!showSpinner && (
            <Button onClick={handleReset} variant="outline" className="h-9 text-xs">
              Clear filters
            </Button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <span className="text-xs text-muted-foreground">
            Page <strong className="font-semibold text-foreground">{meta.page}</strong> of{" "}
            <strong className="font-semibold text-foreground">{totalPages}</strong> ·{" "}
            {meta.total} {meta.total === 1 ? "article" : "articles"}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyParams({ page: page > 2 ? String(page - 1) : null })}
              disabled={page <= 1}
              className="h-9 gap-1 px-3 text-xs"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => applyParams({ page: value > 1 ? String(value) : null })}
                  aria-current={value === page ? "page" : undefined}
                  className={`h-9 w-9 cursor-pointer rounded-lg text-xs font-semibold transition-colors ${
                    value === page
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => applyParams({ page: String(page + 1) })}
              disabled={page >= totalPages}
              className="h-9 gap-1 px-3 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

export default BlogsClient;
