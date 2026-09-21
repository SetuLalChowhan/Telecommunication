import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { toApiError } from '../http/api-error';
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
        staleTime: 60_000, // 1 min default
        gcTime: 5 * 60_000, // 5 mins
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
