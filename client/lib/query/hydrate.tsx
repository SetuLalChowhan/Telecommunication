import type { ReactNode } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query";

/**
 * One React Query cache entry a page wants rendered on the server.
 *
 * `queryKey` MUST be built with the same key factory the client hook uses —
 * hydration is a cache-key lookup, so a drifted key silently discards the
 * server render and the page refetches on mount.
 */
export interface PrefetchSpec {
  queryKey: QueryKey;
  queryFn: () => Promise<unknown>;
  /** Cache lifetime for this entry; omit to use the query client default. */
  staleTime?: number;
}

interface HydrationProviderProps {
  prefetch: PrefetchSpec[];
  children: ReactNode;
}

/**
 * Server-renders preloaded React Query data for its children.
 *
 * This is the single hydration path for the whole app. It replaces the
 * `new QueryClient()` + `prefetchQuery` loop + `dehydrate` + `HydrationBoundary`
 * block that every page used to repeat:
 *
 * ```tsx
 * <HydrationProvider
 *   prefetch={[
 *     { queryKey: doctorKeys.list(params), queryFn: () => getDoctorsServer(params) },
 *   ]}
 * >
 *   <DoctorList />
 * </HydrationProvider>
 * ```
 */
export async function HydrationProvider({
  prefetch,
  children,
}: HydrationProviderProps) {
  // A bare client on purpose: the app's shared client attaches toast + error
  // reporting hooks that must never run during a server render.
  const queryClient = new QueryClient();

  await Promise.all(
    prefetch.map(({ queryKey, queryFn, staleTime }) =>
      queryClient.prefetchQuery({ queryKey, queryFn, staleTime })
    )
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
