import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { toApiError } from '../api/error';
import { reportError } from '../observability/reportError';
import { retryDelay, shouldRetry } from './retry-policy';

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Show toast ONLY when a background refetch fails while stale data is already on screen
        if (query.state.data !== undefined) {
          toast.error(toApiError(error).message);
        }
        reportError(error, { queryKey: query.queryKey });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 2 * 60_000, // 2 mins default
        gcTime: 10 * 60_000, // 10 mins
        retry: shouldRetry,
        retryDelay,
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Mutations must never auto-retry to prevent duplicate side effects
        retry: 0,
      },
    },
  });
}
