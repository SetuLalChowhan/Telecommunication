import { buildQueryString, serverGet, ServerFetchOptions } from "@/lib/api/server";
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

/**
 * Server-side blog list. A backend outage degrades to an empty state here
 * because the surrounding page renders a full, valid empty UI — see the
 * project's error-boundary policy before changing this to throw.
 */
export async function getBlogsServer(
  params?: BlogQueryParams,
  options?: ServerFetchOptions
): Promise<BlogListResult> {
  try {
    const { items, meta } = await serverGet<BlogListPayload>(
      `/blogs${buildQueryString(buildBlogQuery(params))}`,
      { ...CACHE.blogs.server, ...options }
    );
    return { items: (items ?? []).map(toBlogPost), meta: meta ?? DEFAULT_BLOG_META };
  } catch (error) {
    console.error("Failed to fetch blogs on server:", error);
    return {
      items: [],
      meta: { ...DEFAULT_BLOG_META, limit: params?.limit ?? DEFAULT_BLOG_META.limit },
    };
  }
}

/** Server-side single post + related posts. */
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
    console.error(`Failed to fetch blog (${slug}) on server:`, error);
    return { post: null, relatedPosts: [] };
  }
}

/** Server-side featured posts for the home page. */
export async function getFeaturedBlogsServer(
  options?: ServerFetchOptions
): Promise<BlogPost[]> {
  try {
    const posts = await serverGet<BlogPostDto[]>("/blogs/featured", {
      ...CACHE.blogs.server,
      ...options,
    });
    return (posts ?? []).map(toBlogPost);
  } catch (error) {
    console.error("Failed to fetch featured blogs on server:", error);
    return [];
  }
}

/** Server-side admin blog list (published + drafts) for the doctor console. */
export async function getAdminBlogsServer(
  params?: BlogQueryParams,
  options?: ServerFetchOptions
): Promise<BlogListResult> {
  try {
    const { items, meta } = await serverGet<BlogListPayload>(
      `/blogs/admin/all${buildQueryString(buildBlogQuery(params))}`,
      { ...CACHE.private.server, ...options }
    );
    return { items: (items ?? []).map(toBlogPost), meta: meta ?? DEFAULT_BLOG_META };
  } catch (error) {
    console.error("Failed to fetch admin blogs on server:", error);
    return { items: [], meta: DEFAULT_BLOG_META };
  }
}

/** Server-side category facets. */
export async function getBlogCategoriesServer(
  options?: ServerFetchOptions
): Promise<BlogCategory[]> {
  try {
    return (
      (await serverGet<BlogCategory[]>("/blogs/categories", {
        ...CACHE.blogCategories.server,
        ...options,
      })) ?? []
    );
  } catch (error) {
    console.error("Failed to fetch blog categories on server:", error);
    return [];
  }
}
