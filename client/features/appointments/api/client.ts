import { apiClient } from "@/lib/api/axios";
import {
  BookingSummaryCounts,
  EMPTY_BOOKING_SUMMARY,
} from "../types";

/**
 * Fetch per-status booking counts for the authenticated user (doctor or patient).
 * The backend scopes the counts by the caller's role — no client-side counting.
 */
export async function fetchBookingSummary(): Promise<BookingSummaryCounts> {
  const response = await apiClient.get<{ data: BookingSummaryCounts }>(
    "/appointments/summary"
  );
  return response.data?.data || EMPTY_BOOKING_SUMMARY;
}
