import { BlogQueryParams, DEFAULT_BLOG_META } from "./types";

/**
 * One serialization of the blog list filters, shared by the browser client and
 * the server fetcher so the prefetched entry and the client query key describe
 * the same request.
 */
export function buildBlogQuery(
  params?: BlogQueryParams
): Record<string, string | number> {
  const query: Record<string, string | number> = {};

  if (params?.search?.trim()) query.search = params.search.trim();
  if (params?.category && params.category !== "all") {
    query.category = params.category;
  }
  if (params?.sortBy) query.sortBy = params.sortBy;

  query.page = params?.page ?? 1;
  query.limit = params?.limit ?? DEFAULT_BLOG_META.limit;

  return query;
}
