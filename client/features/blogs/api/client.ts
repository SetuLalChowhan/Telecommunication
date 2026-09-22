import { apiClient } from "@/lib/api/axios";
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

export interface BlogQueryOptions {
  signal?: AbortSignal;
}

function toRequestParams(params?: BlogQueryParams) {
  if (!params) return undefined;

  return {
    ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    ...(params.category && params.category !== "all"
      ? { category: params.category }
      : {}),
    ...(params.sortBy ? { sortBy: params.sortBy } : {}),
    page: params.page ?? 1,
    limit: params.limit ?? DEFAULT_BLOG_META.limit,
  };
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
 * Fetch published blog posts with search, category, sorting and pagination.
 */
export async function fetchBlogs(
  params?: BlogQueryParams,
  options?: BlogQueryOptions
): Promise<BlogListResult> {
  const response = await apiClient.get("/blogs", {
    params: toRequestParams(params),
    signal: options?.signal,
  });

  const { items, meta } = normalizeBlogList(response.data);

  return {
    items: items.map(toBlogPost),
    meta: toMeta(meta),
  };
}

/**
 * Fetch a single published post plus related posts from the same category.
 */
export async function fetchBlogBySlug(
  slug: string,
  options?: BlogQueryOptions
): Promise<BlogDetailResult> {
  const response = await apiClient.get(`/blogs/${encodeURIComponent(slug)}`, {
    signal: options?.signal,
  });

  const { post, relatedPosts } = normalizeBlogDetail(response.data);

  return {
    post: post ? toBlogPost(post) : null,
    relatedPosts: relatedPosts.map(toBlogPost),
  };
}

/**
 * Fetch the featured (editor-picked) posts, used by the home page.
 */
export async function fetchFeaturedBlogs(
  options?: BlogQueryOptions
): Promise<BlogPost[]> {
  const response = await apiClient.get("/blogs/featured", {
    signal: options?.signal,
  });

  return normalizeBlogArray(response.data).map(toBlogPost);
}

/**
 * Fetch category facets with published post counts.
 */
export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const response = await apiClient.get("/blogs/categories");

  const raw = Array.isArray(response.data)
    ? response.data
    : (response.data?.data as unknown[] | undefined) ?? [];

  return raw.flatMap((item): BlogCategory[] => {
    if (!item || typeof item !== "object") return [];
    const value = item as { name?: string; count?: number };
    if (!value.name) return [];
    return [{ name: value.name, count: Number(value.count ?? 0) }];
  });
}
