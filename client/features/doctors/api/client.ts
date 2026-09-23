import { http } from "@/lib/api/client";
import { buildDoctorQuery } from "../query";
import {
  CreateAvailabilityInput,
  CreateDayOffInput,
  DoctorAvailability,
  DoctorBookingsQueryParams,
  DoctorBookingsResponse,
  DoctorDashboardBooking,
  DoctorDashboardData,
  DoctorDashboardStats,
  DoctorDayOff,
  DoctorPatientRegistryItem,
  DoctorProfile,
  DoctorQueryParams,
  DoctorSuggestion,
  DoctorsListResponse,
  GoogleConnectionStatus,
  SlugAvailability,
  Specialty,
  UpdateAvailabilityInput,
  UpdateDoctorProfileInput,
  toDoctorSuggestion,
} from "../types";

export type { DoctorsListResponse };

/* ------------------------------- Public read ------------------------------ */

/** Verified doctors with search, specialty, fee, sort and pagination. */
export function fetchDoctors(
  params?: DoctorQueryParams
): Promise<DoctorsListResponse> {
  return http.getPage<DoctorProfile>("/doctors", {
    params: buildDoctorQuery(params),
  });
}

/** Compact doctor list for the hero/header autocomplete. */
export async function fetchDoctorSuggestions(
  term: string
): Promise<DoctorSuggestion[]> {
  const trimmed = term.trim();
  if (trimmed.length < 2) return [];

  const { data } = await fetchDoctors({
    search: trimmed,
    limit: 6,
    page: 1,
    sortBy: "rating",
  });
  return data.map(toDoctorSuggestion);
}

/** A single verified doctor by CUID id or SEO slug. */
export function fetchDoctorByIdOrSlug(idOrSlug: string): Promise<DoctorProfile> {
  return http.get<DoctorProfile>(`/doctors/${encodeURIComponent(idOrSlug)}`);
}

export const fetchDoctorById = fetchDoctorByIdOrSlug;

/** A doctor's active weekly availability. */
export function fetchDoctorAvailability(
  idOrSlug: string
): Promise<DoctorAvailability[]> {
  return http.get<DoctorAvailability[]>(
    `/doctors/${encodeURIComponent(idOrSlug)}/availability`
  );
}

/** All medical specialties. */
export function fetchSpecialties(): Promise<Specialty[]> {
  return http.get<Specialty[]>("/specialties");
}

/* ------------------------------- Doctor self ------------------------------ */

export function fetchMyDoctorProfile(): Promise<DoctorProfile> {
  return http.get<DoctorProfile>("/doctors/me");
}

export function updateMyDoctorProfile(
  data: FormData | UpdateDoctorProfileInput
): Promise<DoctorProfile> {
  const headers =
    data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : undefined;
  return http.patch<DoctorProfile>("/doctors/me", data, { headers });
}

/**
 * Real-time check for the public-URL field: is this slug free, and if not what
 * should the doctor use instead?
 */
export function fetchSlugAvailability(rawSlug: string): Promise<SlugAvailability> {
  return http.get<SlugAvailability>("/doctors/me/slug-availability", {
    params: { slug: rawSlug },
  });
}

export function fetchDoctorDashboard(): Promise<DoctorDashboardData> {
  return http.get<DoctorDashboardData>("/doctors/dashboard");
}

export async function fetchDoctorDashboardStats(): Promise<DoctorDashboardStats> {
  const dashboard = await http.get<DoctorDashboardData>(
    "/doctors/dashboard/stats"
  );
  return dashboard.stats;
}

export function fetchDoctorBookings(
  params?: DoctorBookingsQueryParams
): Promise<DoctorBookingsResponse> {
  return http.getPage<DoctorDashboardBooking>("/appointments/my-bookings", {
    params,
  });
}

export function confirmDoctorBooking(
  bookingId: string
): Promise<DoctorDashboardBooking> {
  return http.patch<DoctorDashboardBooking>(
    `/appointments/${bookingId}/confirm`
  );
}

export function completeDoctorBooking(
  bookingId: string
): Promise<DoctorDashboardBooking> {
  return http.patch<DoctorDashboardBooking>(
    `/appointments/${bookingId}/complete`
  );
}

export function cancelDoctorBooking(
  bookingId: string
): Promise<DoctorDashboardBooking> {
  return http.patch<DoctorDashboardBooking>(
    `/appointments/${bookingId}/cancel`
  );
}

export function fetchDoctorScheduleSlots(): Promise<DoctorAvailability[]> {
  return http.get<DoctorAvailability[]>("/doctors/me/availability");
}

export function createDoctorScheduleSlot(
  data: CreateAvailabilityInput
): Promise<DoctorAvailability> {
  return http.post<DoctorAvailability>("/doctors/me/availability", data);
}

export function updateDoctorScheduleSlot(
  slotId: string,
  data: UpdateAvailabilityInput
): Promise<DoctorAvailability> {
  return http.patch<DoctorAvailability>(
    `/doctors/me/availability/${slotId}`,
    data
  );
}

export function deleteDoctorScheduleSlot(slotId: string): Promise<void> {
  return http.delete<void>(`/doctors/me/availability/${slotId}`);
}

export function fetchDoctorDaysOff(): Promise<DoctorDayOff[]> {
  return http.get<DoctorDayOff[]>("/doctors/me/days-off");
}

export function createDoctorDayOff(
  data: CreateDayOffInput
): Promise<DoctorDayOff> {
  return http.post<DoctorDayOff>("/doctors/me/days-off", data);
}

export function deleteDoctorDayOff(dayOffId: string): Promise<void> {
  return http.delete<void>(`/doctors/me/days-off/${dayOffId}`);
}

export function fetchMyDoctorPatients(
  search?: string
): Promise<DoctorPatientRegistryItem[]> {
  return http.get<DoctorPatientRegistryItem[]>("/doctors/me/patients", {
    params: search?.trim() ? { search: search.trim() } : undefined,
  });
}

export function fetchGoogleConnectionStatus(): Promise<GoogleConnectionStatus> {
  return http.get<GoogleConnectionStatus>("/google/status");
}

export function fetchGoogleAuthUrl(): Promise<{ url: string }> {
  return http.get<{ url: string }>("/google/auth-url");
}

export function disconnectGoogle(): Promise<{ message: string }> {
  return http.delete<{ message: string }>("/google/disconnect");
}

export function connectGoogle(
  code: string,
  redirectUri = "postmessage"
): Promise<{ message?: string }> {
  return http.post<{ message?: string }>("/google/connect", {
    code,
    redirectUri,
  });
}

export function uploadDoctorDocument(formData: FormData) {
  return http.post<{ message?: string }>("/doctors/me/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
