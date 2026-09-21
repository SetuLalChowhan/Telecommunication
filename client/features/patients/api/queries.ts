"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  fetchPatientDashboard,
  fetchPatientBookings,
  cancelPatientBooking,
  fetchPatientProfile,
  updatePatientProfile,
  fetchAvailableSlots,
  createAppointmentBooking,
} from "./client";
import {
  PatientDashboardData,
  PatientBookingsQueryParams,
  PatientBookingsResponse,
  AvailableSlotsData,
  CreateBookingInput,
  RawBooking,
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
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2, // 2 minutes
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

/**
 * Query hook for authenticated patient profile
 */
export function usePatientProfile() {
  return useQuery<import("../types").PatientProfileData>({
    queryKey: patientKeys.profile(),
    queryFn: fetchPatientProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Mutation hook to update patient profile
 */
export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: FormData | import("../types").UpdatePatientProfilePayload
    ) => updatePatientProfile(payload),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update profile. Please check your details.";
      toast.error(message);
    },
  });
}

/**
 * Query hook to fetch real-time concrete slots for a doctor on a specific date (YYYY-MM-DD)
 */
export function useAvailableSlots(doctorId?: string, date?: string) {
  return useQuery<AvailableSlotsData>({
    queryKey: patientKeys.slots(doctorId || "", date || ""),
    queryFn: () => fetchAvailableSlots(doctorId!, date!),
    enabled: Boolean(doctorId && date),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Mutation hook to book an appointment with a doctor
 */
export function useCreateAppointmentBooking() {
  const queryClient = useQueryClient();

  return useMutation<RawBooking, Error, CreateBookingInput>({
    mutationFn: (input: CreateBookingInput) => createAppointmentBooking(input),
    onSuccess: (booking) => {
      toast.success("Appointment request submitted successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      queryClient.invalidateQueries({
        queryKey: ["appointments", "slots", booking.doctorId],
      });
    },
    onError: (error: any) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to book appointment. Please try again.";
      toast.error(message);
    },
  });
}

