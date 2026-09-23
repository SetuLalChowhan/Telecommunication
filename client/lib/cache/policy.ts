/**
 * The single cache policy for the entire client.
 *
 * Every public read goes through these presets so caching is never ad-hoc:
 *
 * - `server` -> Next.js data cache: ISR `revalidate` (seconds) + cache `tags`
 *   for on-demand revalidation (`revalidateTag("cms")` after an admin edit).
 * - `client` -> TanStack Query freshness: `staleTime` (ms) and optional
 *   `refetchInterval`.
 *
 * Private / user-specific data is never shared-cached: it uses `no-store` on
 * the server and a short client `staleTime`.
 */

const SECOND = 1_000;
const MINUTE = 60_000;

export interface ServerCachePolicy {
  revalidate?: number;
  tags?: string[];
  cache?: RequestCache;
}

export interface ClientCachePolicy {
  staleTime: number;
  refetchInterval?: number;
}

export interface CachePolicy {
  server: ServerCachePolicy;
  client: ClientCachePolicy;
}

/** Public, cacheable content. */
export const CACHE = {
  doctors: {
    server: { revalidate: 60, tags: ["doctors"] },
    client: { staleTime: 2 * MINUTE },
  },
  doctorDetail: (idOrSlug: string): CachePolicy => ({
    server: { revalidate: 300, tags: ["doctors", `doctor-${idOrSlug}`] },
    client: { staleTime: 5 * MINUTE },
  }),
  doctorAvailability: (idOrSlug: string): CachePolicy => ({
    server: { revalidate: 30, tags: [`doctor-availability-${idOrSlug}`] },
    client: { staleTime: 30 * SECOND },
  }),
  specialties: {
    server: { revalidate: 3600, tags: ["specialties"] },
    client: { staleTime: 10 * MINUTE },
  },
  blogs: {
    server: { revalidate: 300, tags: ["blogs"] },
    client: { staleTime: 5 * MINUTE },
  },
  blogDetail: (slug: string): CachePolicy => ({
    server: { revalidate: 900, tags: ["blogs", `blog-${slug}`] },
    client: { staleTime: 5 * MINUTE },
  }),
  blogCategories: {
    server: { revalidate: 1800, tags: ["blogs", "blog-categories"] },
    client: { staleTime: 10 * MINUTE },
  },
  cms: {
    server: { revalidate: 3600, tags: ["cms"] },
    client: { staleTime: 10 * MINUTE },
  },

  /** Highly dynamic public data — must stay fresh to avoid booking conflicts. */
  slots: {
    server: { cache: "no-store" as const },
    client: { staleTime: 15 * SECOND },
  },

  /** Private / user-specific — never shared-cached on the server. */
  private: {
    server: { cache: "no-store" as const },
    client: { staleTime: 2 * MINUTE },
  },
  privateFast: {
    server: { cache: "no-store" as const },
    client: { staleTime: 60 * SECOND },
  },
  profile: {
    server: { cache: "no-store" as const },
    client: { staleTime: 5 * MINUTE },
  },
  notifications: {
    server: { cache: "no-store" as const },
    client: { staleTime: 0, refetchInterval: 30 * SECOND },
  },
};
