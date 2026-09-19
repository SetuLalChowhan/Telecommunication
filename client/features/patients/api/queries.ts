"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  fetchPatientDashboard,
  fetchPatientBookings,
  cancelPatientBooking,
} from "./client";
import {
  PatientDashboardData,
  PatientBookingsQueryParams,
  PatientBookingsResponse,
  patientKeys,
} from "../types";

/**
 * Query hook for patient dashboard overview data
 */
export function usePatientDashboard() {
  return useQuery<PatientDashboardData>({
    queryKey: patientKeys.dashboard(),
    queryFn: fetchPatientDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Query hook for patient bookings list
 */
export function usePatientBookings(params?: PatientBookingsQueryParams) {
  return useQuery<PatientBookingsResponse>({
    queryKey: patientKeys.bookings(params),
    queryFn: () => fetchPatientBookings(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Mutation hook to cancel a patient booking
 */
export function useCancelPatientBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason?: string;
    }) => cancelPatientBooking(bookingId, reason),
    onSuccess: () => {
      toast.success("Appointment cancelled successfully");
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel appointment. Please try again.";
      toast.error(message);
    },
  });
}
