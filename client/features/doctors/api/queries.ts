"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDoctors,
  fetchDoctorByIdOrSlug,
  fetchDoctorAvailability,
  fetchMyDoctorProfile,
  updateMyDoctorProfile,
  fetchSpecialties,
  DoctorsListResponse,
} from "./client";
import {
  Specialty,
  DoctorProfile,
  DoctorQueryParams,
  DoctorAvailability,
  UpdateDoctorProfileInput,
  doctorKeys,
} from "../types";

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
    mutationFn: (data: UpdateDoctorProfileInput) => updateMyDoctorProfile(data),
    onSuccess: (updatedDoctor) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: doctorKeys.me() });
      queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
      if (updatedDoctor.id) {
        queryClient.invalidateQueries({
          queryKey: doctorKeys.detail(updatedDoctor.id),
        });
      }
      if (updatedDoctor.slug) {
        queryClient.invalidateQueries({
          queryKey: doctorKeys.detail(updatedDoctor.slug),
        });
      }
    },
  });
}

/**
 * Hook to query all medical specialties
 */
export function useSpecialties() {
  return useQuery<Specialty[]>({
    queryKey: doctorKeys.specialties(),
    queryFn: fetchSpecialties,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
}
