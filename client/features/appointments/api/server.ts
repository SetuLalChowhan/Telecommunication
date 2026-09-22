import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import {
  BookingSummaryCounts,
  EMPTY_BOOKING_SUMMARY,
} from "../types";

/**
 * Server-Side fetcher for per-status booking counts, used to hydrate the
 * status tabs during SSR with the same query key as `useBookingSummary`.
 */
export async function getBookingSummaryServer(
  options?: ServerFetchOptions
): Promise<BookingSummaryCounts> {
  try {
    const response = await serverFetch<{
      success: boolean;
      data: BookingSummaryCounts;
    }>("/appointments/summary", {
      cache: "no-store",
      ...options,
    });

    return response.data || EMPTY_BOOKING_SUMMARY;
  } catch (error) {
    console.error("Failed to fetch booking summary on server:", error);
    return EMPTY_BOOKING_SUMMARY;
  }
}
