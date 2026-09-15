import React from "react";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * =============================================================================
 * ssrQuery (React Query Server Prefetching & Hydration)
 * =============================================================================
 * Purpose:
 *   Enables React Query queries to be prefetched on the server (SSR, SSG, or ISR)
 *   and hydrated seamlessly into Client Components on the browser with zero loading flicker.
 *
 * How to use in any Server Component (e.g. app/doctors/page.tsx):
 *
 *   import { getServerQueryClient, HydrateClient } from "@/lib/api/server/ssrQuery";
 *   import { serverFetch } from "@/lib/api/server/serverApi";
 *   import DoctorListClient from "./DoctorListClient";
 *
 *   // Optional ISR revalidation:
 *   export const revalidate = 3600; // revalidate every 1 hour
 *
 *   export default async function DoctorsPage() {
 *     const queryClient = getServerQueryClient();
 *
 *     // Prefetch on server
 *     await queryClient.prefetchQuery({
 *       queryKey: ["doctors"],
 *       queryFn: () => serverFetch("/doctors", { revalidate: 3600, tags: ["doctors"] }),
 *     });
 *
 *     // Hydrate to client
 *     return (
 *       <HydrateClient queryClient={queryClient}>
 *         <DoctorListClient />
 *       </HydrateClient>
 *     );
 *   }
 *
 * Inside DoctorListClient ("use client"):
 *   const { data } = useClient({ queryKey: ["doctors"], url: "/doctors" });
 *   // `data` is already available on initial render! No loading spinner needed!
 * =============================================================================
 */

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
