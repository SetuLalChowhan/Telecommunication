import { serverGet, ServerFetchOptions } from "@/lib/api/server";
import { CACHE } from "@/lib/cache/policy";
import { BookingSummaryCounts } from "../types";

/**
 * Server-side fetcher for per-status booking counts, used to hydrate the
 * status tabs during SSR with the same query key as `useBookingSummary`.
 *
 * Failures propagate to the route error boundary instead of rendering every
 * tab as zero.
 */
export async function getBookingSummaryServer(
  options?: ServerFetchOptions
): Promise<BookingSummaryCounts> {
  return serverGet<BookingSummaryCounts>("/appointments/summary", {
    ...CACHE.private.server,
    ...options,
  });
}
