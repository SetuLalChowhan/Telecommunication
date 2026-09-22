"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { appointmentKeys } from "@/features/appointments/types";
import {
  fetchDoctors,
  fetchDoctorByIdOrSlug,
  fetchDoctorAvailability,
  fetchMyDoctorProfile,
  updateMyDoctorProfile,
  fetchSpecialties,
  fetchDoctorDashboard,
  fetchDoctorDashboardStats,
  fetchDoctorBookings,
  confirmDoctorBooking,
  completeDoctorBooking,
  cancelDoctorBooking,
  fetchDoctorScheduleSlots,
  createDoctorScheduleSlot,
  updateDoctorScheduleSlot,
  deleteDoctorScheduleSlot,
  fetchDoctorDaysOff,
  createDoctorDayOff,
  deleteDoctorDayOff,
  fetchMyDoctorPatients,
  fetchGoogleConnectionStatus,
  fetchGoogleAuthUrl,
  disconnectGoogle,
  uploadDoctorDocument,
  fetchDoctorSuggestions,
  DoctorsListResponse,
} from "./client";
import {
  Specialty,
  DoctorProfile,
  DoctorQueryParams,
  DoctorAvailability,
  UpdateDoctorProfileInput,
  DoctorDashboardData,
  DoctorDashboardStats,
  DoctorBookingsQueryParams,
  DoctorBookingsResponse,
  DoctorDayOff,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
  CreateDayOffInput,
  DoctorPatientRegistryItem,
  GoogleConnectionStatus,
  DoctorSuggestion,
  toDoctorSuggestion,
  doctorKeys,
} from "../types";

/**
 * Extracts a human-readable message from a rejected mutation.
 */
function getMutationErrorMessage(error: unknown, fallback: string): string {
  const err = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const raw = err?.response?.data?.message || err?.message;
  if (Array.isArray(raw)) return raw.join(", ");
  return raw || fallback;
}

/**
 * Hook to query verified doctors with filters & pagination
 */
export function useDoctors(
  params?: DoctorQueryParams,
  options?: { initialData?: DoctorsListResponse }
) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => fetchDoctors(params),
    initialData: options?.initialData,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to query a single doctor's details by ID or Slug
 */
export function useDoctorDetails(
  idOrSlug: string,
  options?: { initialData?: DoctorProfile | null }
) {
  return useQuery({
    queryKey: doctorKeys.detail(idOrSlug),
    queryFn: () => fetchDoctorByIdOrSlug(idOrSlug),
    initialData: options?.initialData ?? undefined,
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to query a doctor's active weekly availability
 */
export function useDoctorAvailability(idOrSlug: string) {
  return useQuery<DoctorAvailability[]>({
    queryKey: doctorKeys.availability(idOrSlug),
    queryFn: () => fetchDoctorAvailability(idOrSlug),
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook to query current logged-in doctor profile
 */
export function useMyDoctorProfile() {
  return useQuery({
    queryKey: doctorKeys.me(),
    queryFn: fetchMyDoctorProfile,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to mutate/update current doctor profile
 */
export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | UpdateDoctorProfileInput) =>
      updateMyDoctorProfile(data),
    onSuccess: (updatedDoctor) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: doctorKeys.me() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      if (updatedDoctor?.id) {
        queryClient.invalidateQueries({
          queryKey: doctorKeys.detail(updatedDoctor.id),
        });
      }
      if (updatedDoctor?.slug) {
        queryClient.invalidateQueries({
          queryKey: doctorKeys.detail(updatedDoctor.slug),
        });
      }
    },
  });
}

/**
 * Hook to query all medical specialties.
 * Pass `initialData` from an RSC prefetch so the hero select renders from
 * server data and does not refetch on mount.
 */
export function useSpecialties(options?: { initialData?: Specialty[] }) {
  return useQuery<Specialty[]>({
    queryKey: doctorKeys.specialties(),
    queryFn: fetchSpecialties,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}

/**
 * Debounced-search autocomplete for doctors.
 *
 * Disabled below 2 characters so an empty hero input never hits the API, and
 * short-cached by term so backtracking through a query is instant.
 */
export function useDoctorSuggestions(term: string) {
  const trimmed = term.trim();

  return useQuery<DoctorSuggestion[]>({
    queryKey: doctorKeys.suggestions(trimmed),
    queryFn: async () =>
      (await fetchDoctorSuggestions(trimmed)).map(toDoctorSuggestion),
    enabled: trimmed.length >= 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previous) => previous,
  });
}

/**
 * Hook to query aggregated doctor dashboard data
 */
export function useDoctorDashboard(options?: {
  initialData?: DoctorDashboardData;
}) {
  return useQuery({
    queryKey: doctorKeys.dashboard(),
    queryFn: fetchDoctorDashboard,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to query doctor dashboard summary metrics
 */
export function useDoctorDashboardStats() {
  return useQuery({
    queryKey: [...doctorKeys.dashboard(), "stats"],
    queryFn: fetchDoctorDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to query doctor consultation queue
 */
export function useDoctorBookings(
  params?: DoctorBookingsQueryParams,
  options?: { initialData?: DoctorBookingsResponse }
) {
  return useQuery({
    queryKey: doctorKeys.myBookings(params),
    queryFn: () => fetchDoctorBookings(params),
    placeholderData: (prev) => prev,
    initialData: options?.initialData,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to confirm an appointment booking (generates Meet link & notifies patient)
 */
export function useConfirmDoctorBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => confirmDoctorBooking(bookingId),
    onSuccess: () => {
      toast.success("Appointment confirmed successfully");
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.summary() });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, "Failed to confirm appointment"));
    },
  });
}

/**
 * Hook to mark an appointment booking as completed
 */
export function useCompleteDoctorBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => completeDoctorBooking(bookingId),
    onSuccess: () => {
      toast.success("Consultation marked as completed");
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.summary() });
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, "Failed to complete consultation"));
    },
  });
}

/**
 * Hook to cancel an appointment booking
 */
export function useCancelDoctorBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelDoctorBooking(bookingId),
    onSuccess: () => {
      toast.success("Appointment cancelled successfully");
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.summary() });
    },
    onError: (error: unknown) => {
      toast.error(getMutationErrorMessage(error, "Failed to cancel appointment"));
    },
  });
}

/**
 * Hook to query doctor's weekly recurring availability schedule
 */
export function useMyDoctorSchedule() {
  return useQuery<DoctorAvailability[]>({
    queryKey: doctorKeys.mySchedule(),
    queryFn: fetchDoctorScheduleSlots,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to add a weekly recurring availability slot
 */
export function useCreateAvailabilitySlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAvailabilityInput) =>
      createDoctorScheduleSlot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.mySchedule() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
    },
  });
}

/**
 * Hook to update a weekly recurring availability slot (toggle active, change times)
 */
export function useUpdateAvailabilitySlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slotId,
      data,
    }: {
      slotId: string;
      data: UpdateAvailabilityInput;
    }) => updateDoctorScheduleSlot(slotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.mySchedule() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
    },
  });
}

/**
 * Hook to delete a weekly recurring availability slot
 */
export function useDeleteAvailabilitySlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: string) => deleteDoctorScheduleSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.mySchedule() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
    },
  });
}

/**
 * Hook to query doctor's scheduled days off & vacations
 */
export function useMyDoctorDaysOff() {
  return useQuery<DoctorDayOff[]>({
    queryKey: doctorKeys.myDaysOff(),
    queryFn: fetchDoctorDaysOff,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to schedule a new day off / vacation
 */
export function useCreateDoctorDayOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDayOffInput) => createDoctorDayOff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.myDaysOff() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
    },
  });
}

/**
 * Hook to delete a scheduled day off / vacation
 */
export function useDeleteDoctorDayOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dayOffId: string) => deleteDoctorDayOff(dayOffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.myDaysOff() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
    },
  });
}

/**
 * Hook to query doctor's patient registry list with optional search
 */
export function useMyDoctorPatients(search?: string) {
  return useQuery<DoctorPatientRegistryItem[]>({
    queryKey: doctorKeys.myPatients(search),
    queryFn: () => fetchMyDoctorPatients(search),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to query Google Calendar & Meet connection status
 */
export function useGoogleConnectionStatus() {
  return useQuery<GoogleConnectionStatus>({
    queryKey: doctorKeys.googleStatus(),
    queryFn: fetchGoogleConnectionStatus,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook to disconnect linked Google account
 */
export function useDisconnectGoogle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disconnectGoogle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.googleStatus() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.dashboard() });
    },
  });
}

/**
 * Hook to upload doctor verification document
 */
export function useUploadDoctorDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadDoctorDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.me() });
    },
  });
}



