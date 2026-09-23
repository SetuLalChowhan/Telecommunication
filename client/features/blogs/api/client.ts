import { http } from "@/lib/api/client";
import { buildBlogQuery } from "../query";
import { toBlogPost } from "../mapper";
import {
  AdminBlogPayload,
  BlogCategory,
  BlogDetailResult,
  BlogListMeta,
  BlogListResult,
  BlogPost,
  BlogPostDto,
  BlogQueryParams,
} from "../types";

interface BlogListPayload {
  items: BlogPostDto[];
  meta: BlogListMeta;
}

interface BlogDetailPayload {
  post: BlogPostDto | null;
  relatedPosts: BlogPostDto[];
}

/* ------------------------------- Public API ------------------------------- */

/** Published posts with search, category, sorting and pagination. */
export async function fetchBlogs(
  params?: BlogQueryParams
): Promise<BlogListResult> {
  const { items, meta } = await http.get<BlogListPayload>("/blogs", {
    params: buildBlogQuery(params),
  });
  return { items: items.map(toBlogPost), meta };
}

/** A single published post plus related posts. */
export async function fetchBlogBySlug(slug: string): Promise<BlogDetailResult> {
  const { post, relatedPosts } = await http.get<BlogDetailPayload>(
    `/blogs/${encodeURIComponent(slug)}`
  );
  return {
    post: post ? toBlogPost(post) : null,
    relatedPosts: (relatedPosts ?? []).map(toBlogPost),
  };
}

/** Editor-picked featured posts for the home page. */
export async function fetchFeaturedBlogs(): Promise<BlogPost[]> {
  const posts = await http.get<BlogPostDto[]>("/blogs/featured");
  return (posts ?? []).map(toBlogPost);
}

/** Category facets with published post counts. */
export function fetchBlogCategories(): Promise<BlogCategory[]> {
  return http.get<BlogCategory[]>("/blogs/categories");
}

/* ------------------------- Admin / doctor management ---------------------- */

export async function adminFetchBlogs(
  params?: BlogQueryParams
): Promise<BlogListResult> {
  const { items, meta } = await http.get<BlogListPayload>("/blogs/admin/all", {
    params: buildBlogQuery(params),
  });
  return { items: items.map(toBlogPost), meta };
}

export function adminCreateBlog(
  payload: AdminBlogPayload
): Promise<BlogPostDto> {
  return http.post<BlogPostDto>("/blogs/admin/create", payload);
}

export function adminUpdateBlog(
  id: string,
  payload: Partial<AdminBlogPayload>
): Promise<BlogPostDto> {
  return http.patch<BlogPostDto>(`/blogs/admin/${id}`, payload);
}

export async function adminDeleteBlog(id: string): Promise<void> {
  await http.delete<void>(`/blogs/admin/${id}`);
}

export function adminTogglePublish(id: string): Promise<BlogPostDto> {
  return http.patch<BlogPostDto>(`/blogs/admin/${id}/toggle-publish`);
}
