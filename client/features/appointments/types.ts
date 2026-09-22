/**
 * Shared Appointment Types & Query Keys
 *
 * Status counts are produced by the backend (`GET /appointments/summary`) so the
 * status tabs are never derived from client-side filtering logic.
 */

export type BookingStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type BookingStatusFilter = "ALL" | BookingStatusValue;

export interface BookingSummaryCounts {
  all: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export const EMPTY_BOOKING_SUMMARY: BookingSummaryCounts = {
  all: 0,
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
};

export const BOOKING_STATUS_FILTERS: readonly BookingStatusFilter[] = [
  "ALL",
  "CONFIRMED",
  "PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;

/**
 * Normalizes an arbitrary status string coming from the URL into a valid filter.
 */
export function normalizeStatusFilter(value?: string | null): BookingStatusFilter {
  const upper = (value || "ALL").toUpperCase();
  return (BOOKING_STATUS_FILTERS as readonly string[]).includes(upper)
    ? (upper as BookingStatusFilter)
    : "ALL";
}

/**
 * Unified Appointment Query Keys (shared across doctor & patient views so server
 * prefetch and client hooks hydrate the exact same cache entry).
 */
export const appointmentKeys = {
  all: ["appointments"] as const,
  summary: () => [...appointmentKeys.all, "summary"] as const,
};
