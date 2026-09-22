"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  fetchBlogCategories,
  fetchBlogBySlug,
  fetchBlogs,
  fetchFeaturedBlogs,
} from "./client";
import {
  BlogCategory,
  BlogDetailResult,
  BlogListResult,
  BlogPost,
  BlogQueryParams,
  blogKeys,
} from "../types";

const FIVE_MINUTES = 1000 * 60 * 5;

/**
 * Blog list hook. Pass `initialData` from the RSC prefetch so the first paint
 * uses server data instead of firing a duplicate request after hydration.
 */
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
