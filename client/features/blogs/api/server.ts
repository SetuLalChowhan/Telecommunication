import { buildQueryString, serverGet, ServerFetchOptions } from "@/lib/api/server";
import { isNotFound } from "@/lib/api/error";
import { CACHE } from "@/lib/cache/policy";
import { buildBlogQuery } from "../query";
import { toBlogPost } from "../mapper";
import {
  BlogCategory,
  BlogDetailResult,
  BlogListMeta,
  BlogListResult,
  BlogPost,
  BlogPostDto,
  BlogQueryParams,
  DEFAULT_BLOG_META,
} from "../types";

interface BlogListPayload {
  items: BlogPostDto[];
  meta: BlogListMeta;
}

interface BlogDetailPayload {
  post: BlogPostDto | null;
  relatedPosts: BlogPostDto[];
}

/** Server-side blog list. Backend failures propagate to the route error boundary. */
export async function getBlogsServer(
  params?: BlogQueryParams,
  options?: ServerFetchOptions
): Promise<BlogListResult> {
  const { items, meta } = await serverGet<BlogListPayload>(
    `/blogs${buildQueryString(buildBlogQuery(params))}`,
    { ...CACHE.blogs.server, ...options }
  );
  return { items: (items ?? []).map(toBlogPost), meta: meta ?? DEFAULT_BLOG_META };
}

/**
 * Server-side single post + related posts. Returns `{ post: null }` only for a
 * genuine 404 so the page can call `notFound()`; other failures propagate.
 */
export async function getBlogBySlugServer(
  slug: string,
  options?: ServerFetchOptions
): Promise<BlogDetailResult> {
  try {
    const { post, relatedPosts } = await serverGet<BlogDetailPayload>(
      `/blogs/${encodeURIComponent(slug)}`,
      { ...CACHE.blogDetail(slug).server, ...options }
    );
    return {
      post: post ? toBlogPost(post) : null,
      relatedPosts: (relatedPosts ?? []).map(toBlogPost),
    };
  } catch (error) {
    if (isNotFound(error)) {
      return { post: null, relatedPosts: [] };
    }
    throw error;
  }
}

/** Server-side featured posts for the home page. */
export async function getFeaturedBlogsServer(
  options?: ServerFetchOptions
): Promise<BlogPost[]> {
  const posts = await serverGet<BlogPostDto[]>("/blogs/featured", {
    ...CACHE.blogs.server,
    ...options,
  });
  return (posts ?? []).map(toBlogPost);
}

/** Server-side admin blog list (published + drafts) for the doctor console. */
export async function getAdminBlogsServer(
  params?: BlogQueryParams,
  options?: ServerFetchOptions
): Promise<BlogListResult> {
  const { items, meta } = await serverGet<BlogListPayload>(
    `/blogs/admin/all${buildQueryString(buildBlogQuery(params))}`,
    { ...CACHE.private.server, ...options }
  );
  return { items: (items ?? []).map(toBlogPost), meta: meta ?? DEFAULT_BLOG_META };
}

/** Server-side category facets. */
export async function getBlogCategoriesServer(
  options?: ServerFetchOptions
): Promise<BlogCategory[]> {
  return (
    (await serverGet<BlogCategory[]>("/blogs/categories", {
      ...CACHE.blogCategories.server,
      ...options,
    })) ?? []
  );
}
