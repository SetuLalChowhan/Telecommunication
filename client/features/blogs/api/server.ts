import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import {
  BlogCategory,
  BlogDetailResult,
  BlogListMeta,
  BlogListResult,
  BlogPost,
  BlogQueryParams,
  DEFAULT_BLOG_META,
} from "../types";
import {
  normalizeBlogArray,
  normalizeBlogDetail,
  normalizeBlogList,
  toBlogPost,
} from "../utils";

function buildEndpoint(params?: BlogQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params?.search?.trim()) searchParams.set("search", params.search.trim());
  if (params?.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("limit", String(params?.limit ?? DEFAULT_BLOG_META.limit));

  const qs = searchParams.toString();
  return qs ? `/blogs?${qs}` : "/blogs";
}

function toMeta(raw: Record<string, unknown> | undefined): BlogListMeta {
  if (!raw) return DEFAULT_BLOG_META;

  return {
    page: Number(raw.page ?? DEFAULT_BLOG_META.page),
    limit: Number(raw.limit ?? DEFAULT_BLOG_META.limit),
    total: Number(raw.total ?? 0),
    totalPages: Number(raw.totalPages ?? 1),
    hasNextPage: Boolean(raw.hasNextPage),
    hasPreviousPage: Boolean(raw.hasPreviousPage),
  };
}

/**
 * Server-side blog list. Returns an empty result (never throws) so a backend
 * outage degrades to an empty state instead of a 500 page.
 */
export async function getBlogsServer(
  params?: BlogQueryParams,
  options?: ServerFetchOptions
): Promise<BlogListResult> {
  try {
    const response = await serverFetch<unknown>(buildEndpoint(params), {
      revalidate: 60,
      tags: ["blogs"],
      ...options,
    });

    const { items, meta } = normalizeBlogList(response);

    return { items: items.map(toBlogPost), meta: toMeta(meta) };
  } catch (error) {
    console.error("Failed to fetch blogs on server:", error);
    return { items: [], meta: { ...DEFAULT_BLOG_META, limit: params?.limit ?? DEFAULT_BLOG_META.limit } };
  }
}

/** Server-side single post + related posts. */
export async function getBlogBySlugServer(
  slug: string,
  options?: ServerFetchOptions
): Promise<BlogDetailResult> {
  try {
    const response = await serverFetch<unknown>(
      `/blogs/${encodeURIComponent(slug)}`,
      {
        revalidate: 300,
        tags: ["blogs", `blog-${slug}`],
        ...options,
      }
    );

    const { post, relatedPosts } = normalizeBlogDetail(response);

    return {
      post: post ? toBlogPost(post) : null,
      relatedPosts: relatedPosts.map(toBlogPost),
    };
  } catch (error) {
    console.error(`Failed to fetch blog (${slug}) on server:`, error);
    return { post: null, relatedPosts: [] };
  }
}

/** Server-side featured posts for the home page. */
export async function getFeaturedBlogsServer(
  options?: ServerFetchOptions
): Promise<BlogPost[]> {
  try {
    const response = await serverFetch<unknown>("/blogs/featured", {
      revalidate: 300,
      tags: ["blogs", "blogs-featured"],
      ...options,
    });

    return normalizeBlogArray(response).map(toBlogPost);
  } catch (error) {
    console.error("Failed to fetch featured blogs on server:", error);
    return [];
  }
}

/** Server-side category facets. */
export async function getBlogCategoriesServer(
  options?: ServerFetchOptions
): Promise<BlogCategory[]> {
  try {
    const response = await serverFetch<unknown>("/blogs/categories", {
      revalidate: 600,
      tags: ["blogs", "blog-categories"],
      ...options,
    });

    const raw = Array.isArray(response)
      ? response
      : ((response as { data?: unknown[] })?.data ?? []);

    return (raw as unknown[]).flatMap((item): BlogCategory[] => {
      if (!item || typeof item !== "object") return [];
      const value = item as { name?: string; count?: number };
      if (!value.name) return [];
      return [{ name: value.name, count: Number(value.count ?? 0) }];
    });
  } catch (error) {
    console.error("Failed to fetch blog categories on server:", error);
    return [];
  }
}
