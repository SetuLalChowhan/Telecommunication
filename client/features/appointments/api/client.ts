import { http } from "@/lib/api/client";
import { BookingSummaryCounts, EMPTY_BOOKING_SUMMARY } from "../types";

/**
 * Fetch per-status booking counts for the authenticated user (doctor or patient).
 * The backend scopes the counts by the caller's role — no client-side counting.
 */
export async function fetchBookingSummary(): Promise<BookingSummaryCounts> {
  const summary = await http.get<BookingSummaryCounts>("/appointments/summary");
  return summary ?? EMPTY_BOOKING_SUMMARY;
}
