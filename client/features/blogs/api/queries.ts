import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CACHE } from "@/lib/cache/policy";
import {
  adminCreateBlog,
  adminDeleteBlog,
  adminFetchBlogs,
  adminTogglePublish,
  adminUpdateBlog,
  fetchBlogBySlug,
  fetchBlogCategories,
  fetchBlogs,
  fetchFeaturedBlogs,
} from "./client";
import {
  AdminBlogPayload,
  BlogCategory,
  BlogDetailResult,
  BlogListResult,
  BlogPost,
  BlogQueryParams,
  adminBlogKeys,
  blogKeys,
} from "../types";

/* ------------------------------- Public hooks ------------------------------ */

export function useBlogs(params?: BlogQueryParams) {
  return useQuery<BlogListResult>({
    queryKey: blogKeys.list(params ?? {}),
    queryFn: () => fetchBlogs(params),
    placeholderData: keepPreviousData,
    staleTime: CACHE.blogs.client.staleTime,
  });
}

export function useBlogDetail(slug: string) {
  return useQuery<BlogDetailResult>({
    queryKey: blogKeys.detail(slug),
    queryFn: () => fetchBlogBySlug(slug),
    enabled: Boolean(slug),
    staleTime: CACHE.blogDetail(slug).client.staleTime,
  });
}

export function useFeaturedBlogs() {
  return useQuery<BlogPost[]>({
    queryKey: blogKeys.featured(),
    queryFn: () => fetchFeaturedBlogs(),
    staleTime: CACHE.blogs.client.staleTime,
  });
}

export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: blogKeys.categories(),
    queryFn: fetchBlogCategories,
    staleTime: CACHE.blogCategories.client.staleTime,
  });
}

/* -------------------------- Admin / doctor hooks -------------------------- */

export function useAdminBlogs(params?: BlogQueryParams) {
  return useQuery<BlogListResult>({
    queryKey: adminBlogKeys.list(params),
    queryFn: () => adminFetchBlogs(params),
    placeholderData: keepPreviousData,
    staleTime: CACHE.privateFast.client.staleTime,
  });
}

export function useAdminCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminBlogPayload) => adminCreateBlog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBlogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post created successfully");
    },
    onError: () => toast.error("Failed to create blog post"),
  });
}

export function useAdminUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<AdminBlogPayload>;
    }) => adminUpdateBlog(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBlogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post updated");
    },
    onError: () => toast.error("Failed to update blog post"),
  });
}

export function useAdminDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBlogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post deleted");
    },
    onError: () => toast.error("Failed to delete blog post"),
  });
}

export function useAdminTogglePublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminTogglePublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminBlogKeys.all });
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Publish status updated");
    },
    onError: () => toast.error("Failed to update publish status"),
  });
}
