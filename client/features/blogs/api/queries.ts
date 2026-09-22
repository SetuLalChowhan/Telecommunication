import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchBlogCategories,
  fetchBlogBySlug,
  fetchBlogs,
  fetchFeaturedBlogs,
  adminFetchBlogs,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog,
  adminTogglePublish,
} from "./client";
import {
  AdminBlogPayload,
  BlogCategory,
  BlogDetailResult,
  BlogListResult,
  BlogPost,
  BlogQueryParams,
  blogKeys,
} from "../types";
import { toast } from "react-toastify";

const FIVE_MINUTES = 1000 * 60 * 5;

// ─── Public hooks ─────────────────────────────────────────────────────────────

export function useBlogs(
  params?: BlogQueryParams,
  options?: { initialData?: BlogListResult }
) {
  return useQuery<BlogListResult>({
    queryKey: blogKeys.list(params ?? {}),
    queryFn: () => fetchBlogs(params),
    initialData: options?.initialData,
    placeholderData: keepPreviousData,
    staleTime: FIVE_MINUTES,
  });
}

export function useBlogDetail(
  slug: string,
  options?: { initialData?: BlogDetailResult }
) {
  return useQuery<BlogDetailResult>({
    queryKey: blogKeys.detail(slug),
    queryFn: () => fetchBlogBySlug(slug),
    initialData: options?.initialData,
    enabled: Boolean(slug),
    staleTime: FIVE_MINUTES,
  });
}

export function useFeaturedBlogs(options?: { initialData?: BlogPost[] }) {
  return useQuery<BlogPost[]>({
    queryKey: blogKeys.featured(),
    queryFn: () => fetchFeaturedBlogs(),
    initialData: options?.initialData,
    staleTime: FIVE_MINUTES,
  });
}

export function useBlogCategories(options?: { initialData?: BlogCategory[] }) {
  return useQuery<BlogCategory[]>({
    queryKey: blogKeys.categories(),
    queryFn: fetchBlogCategories,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 10,
  });
}

// ─── Admin / Doctor hooks ─────────────────────────────────────────────────────

const adminBlogKeys = {
  all: ["admin-blogs"] as const,
  list: (params?: BlogQueryParams) =>
    [...adminBlogKeys.all, "list", params ?? {}] as const,
};

export function useAdminBlogs(params?: BlogQueryParams) {
  return useQuery<BlogListResult>({
    queryKey: adminBlogKeys.list(params),
    queryFn: () => adminFetchBlogs(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useAdminCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminBlogPayload) => adminCreateBlog(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminBlogKeys.all });
      qc.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post created successfully");
    },
    onError: () => toast.error("Failed to create blog post"),
  });
}

export function useAdminUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminBlogPayload> }) =>
      adminUpdateBlog(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminBlogKeys.all });
      qc.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post updated");
    },
    onError: () => toast.error("Failed to update blog post"),
  });
}

export function useAdminDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteBlog(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminBlogKeys.all });
      qc.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog post deleted");
    },
    onError: () => toast.error("Failed to delete blog post"),
  });
}

export function useAdminTogglePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminTogglePublish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminBlogKeys.all });
      qc.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Publish status updated");
    },
    onError: () => toast.error("Failed to update publish status"),
  });
}
