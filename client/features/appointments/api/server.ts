import { serverGet, ServerFetchOptions } from "@/lib/api/server";
import { BookingSummaryCounts, EMPTY_BOOKING_SUMMARY } from "../types";

/**
 * Server-side fetcher for per-status booking counts, used to hydrate the
 * status tabs during SSR with the same query key as `useBookingSummary`.
 */
export async function getBookingSummaryServer(
  options?: ServerFetchOptions
): Promise<BookingSummaryCounts> {
  try {
    const summary = await serverGet<BookingSummaryCounts>(
      "/appointments/summary",
      { cache: "no-store", ...options }
    );
    return summary ?? EMPTY_BOOKING_SUMMARY;
  } catch (error) {
    console.error("Failed to fetch booking summary on server:", error);
    return EMPTY_BOOKING_SUMMARY;
  }
}
