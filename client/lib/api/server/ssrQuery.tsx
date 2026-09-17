import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";



function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a QueryClient instance.
 * - In Server Components: Creates a new client per request to avoid cross-user data leakage.
 * - In Browser: Reuses a singleton client.
 */
export function getServerQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

/**
 * Hydration Boundary Component
 * Dehydrates the server QueryClient cache and passes it to the client HydrationBoundary.
 */
export function HydrateClient({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient?: QueryClient;
}) {
  const client = queryClient || getServerQueryClient();
  return (
    <HydrationBoundary state={dehydrate(client)}>
      {children}
    </HydrationBoundary>
  );
}

export default HydrateClient;
