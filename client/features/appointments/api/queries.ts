"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBookingSummary } from "./client";
import { appointmentKeys, BookingSummaryCounts } from "../types";
import { CACHE } from "@/lib/cache/policy";

/**
 * Query hook for backend-computed booking status counts.
 * Shared by the doctor and patient appointment views.
 */
export function useBookingSummary() {
  return useQuery<BookingSummaryCounts>({
    queryKey: appointmentKeys.summary(),
    queryFn: fetchBookingSummary,
    staleTime: CACHE.privateFast.client.staleTime,
  });
}
