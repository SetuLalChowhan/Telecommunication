"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosPublic } from "./useAxiosPublic";
import { axiosSecure } from "./useAxiosSecure";

export interface UseClientProps<T = any> {
  queryKey: any[];
  url: string;
  isPrivate?: boolean;
  params?: Record<string, any>;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * =============================================================================
 * useClient
 * =============================================================================
 * Purpose:
 *   Universal TanStack Query hook for GET requests in Client Components (CSR).
 *
 * Usage:
 *   const { data, isLoading, error } = useClient<Doctor[]>({
 *     queryKey: ["doctors", { specialty: "cardiology" }],
 *     url: "/doctors",
 *     params: { specialty: "cardiology" },
 *     isPrivate: false, // true for authenticated routes
 *   });
 * =============================================================================
 */
export const useClient = <T = any>({
  queryKey,
  url,
  isPrivate = false,
  params,
  enabled = true,
  staleTime = 60 * 1000,
}: UseClientProps<T>) => {
  const client = isPrivate ? axiosSecure : axiosPublic;

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<T>({
    queryKey: [...queryKey, params],
    enabled,
    staleTime,
    retry: 1,
    queryFn: async () => {
      const res = await client.get(url, { params });
      // If backend wrapped in { success, data }, extract data property
      const resData = (res as any)?.data !== undefined ? (res as any).data : res;
      return resData as T;
    },
  });

  return {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

export default useClient;
