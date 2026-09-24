import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/error";
import { DEFAULT_QUERY_STALE_TIME } from "./policy";

/**
 * The single TanStack Query client for server state.
 *
 * Retries are disabled for 4xx (a 403 will never succeed on retry) and limited
 * to one for 5xx/network failures.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_QUERY_STALE_TIME,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status !== null && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
    mutations: {
      retry: 0,
    },
  },
});
