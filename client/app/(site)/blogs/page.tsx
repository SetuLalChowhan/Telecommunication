import React from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { BlogsClient } from "@/components/site/blogs/BlogsClient";
import { CACHE } from "@/lib/cache/policy";
import { blogKeys } from "@/features/blogs";
import type { BlogQueryParams, BlogSortBy } from "@/features/blogs";
import {
  getBlogCategoriesServer,
  getBlogsServer,
} from "@/features/blogs/api/server";

const SORT_OPTIONS: BlogSortBy[] = ["newest", "oldest", "popular"];

interface BlogsPageProps {
  searchParams: Promise<{
    q?: string;
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: BlogsPageProps): Promise<Metadata> {
  const resolved = await searchParams;
  const search = (resolved.q || resolved.search || "").trim();
  const category = resolved.category;
  const isFiltered = Boolean(search || category);
  const page = Math.max(1, Number(resolved.page ?? "1") || 1);

  const baseTitle = "Health Articles & Medical Advice | DocConnect";
  const baseDescription =
    "Read health tips, clinical guidelines, and wellness articles written by certified medical professionals.";

  return {
    // Filtered and paginated views must not compete with the canonical list.
    title: search
      ? `Articles matching “${search}” | DocConnect`
      : category
        ? `${category} Articles | DocConnect`
        : page > 1
          ? `Health Articles & Medical Advice — Page ${page} | DocConnect`
          : baseTitle,
    description: baseDescription,
    keywords: [
      "health articles",
      "medical advice",
      "doctor blogs",
      "telehealth guidance",
      "wellness tips",
    ],
    alternates: { canonical: "/blogs" },
    ...(isFiltered
      ? { robots: { index: false, follow: true } }
      : {
          openGraph: {
            title: baseTitle,
            description: baseDescription,
            type: "website",
            url: "/blogs",
            siteName: "DocConnect",
          },
        }),
  };
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const resolved = await searchParams;

  // Must mirror BlogsClient's derivation exactly so the prefetched query key
  // matches the one the client asks for after hydration.
  const params: BlogQueryParams = {
    search: (resolved.q || resolved.search || "").trim(),
    category: resolved.category ?? "all",
    sortBy: SORT_OPTIONS.includes(resolved.sort as BlogSortBy)
      ? (resolved.sort as BlogSortBy)
      : "newest",
    page: Math.max(1, Number(resolved.page ?? "1") || 1),
  };

  const queryClient = new QueryClient();

  // `prefetchQuery` seeds the cache so `dehydrate` below carries exactly what
  // the matching client hooks look for after hydration. There is no separate
  // `initialData` path — a single source of truth for server-rendered data.
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: blogKeys.list(params),
      queryFn: () => getBlogsServer(params),
      staleTime: CACHE.blogs.client.staleTime,
    }),
    queryClient.prefetchQuery({
      queryKey: blogKeys.categories(),
      queryFn: () => getBlogCategoriesServer(),
      staleTime: CACHE.blogCategories.client.staleTime,
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Server-rendered hero: the H1 is in the initial HTML for crawlers. */}
      <section className="w-full border-b border-border/60 bg-muted/30 py-12 sm:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl space-y-3 text-center sm:space-y-4">
            <span className="eyebrow-text block text-primary">
              Health insights & articles
            </span>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              Healthcare articles &amp; blogs
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-secondary-text">
              Stay informed with verified medical advice, preventative care tips, and
              telehealth guidance from certified doctors.
            </p>
          </div>
        </div>
      </section>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogsClient />
      </HydrationBoundary>
    </div>
  );
}
