import { apiClient } from "@/lib/api/axios";
import {
  Specialty,
  DoctorProfile,
  DoctorQueryParams,
  DoctorAvailability,
  UpdateDoctorProfileInput,
  DoctorsListResponse,
  DoctorDashboardData,
  DoctorDashboardStats,
  DoctorBookingsQueryParams,
  DoctorBookingsResponse,
  DoctorDashboardBooking,
  DoctorDayOff,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
  CreateDayOffInput,
  DoctorPatientRegistryItem,
  GoogleConnectionStatus,
} from "../types";

export type { DoctorsListResponse };

/**
 * Fetch verified doctors with optional search, specialty slug, fee, sorting, and pagination
 */
export async function fetchDoctors(
  params?: DoctorQueryParams
): Promise<DoctorsListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.search) queryParams.set("search", params.search);
  if (params?.specialtySlug) queryParams.set("specialtySlug", params.specialtySlug);
  if (params?.minFee !== undefined) queryParams.set("minFee", String(params.minFee));
  if (params?.maxFee !== undefined) queryParams.set("maxFee", String(params.maxFee));
  if (params?.minExperience !== undefined) queryParams.set("minExperience", String(params.minExperience));
  else if (params?.experience !== undefined && params.experience !== "") queryParams.set("minExperience", String(params.experience));
  if (params?.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));

  const queryStr = queryParams.toString();
  const endpoint = queryStr ? `/doctors?${queryStr}` : "/doctors";

  const response = await apiClient.get<DoctorsListResponse>(endpoint);
  return response.data;
}

/**
 * Fetch a short list of doctors matching a search term, for autocomplete.
 * Capped at 6 results — this backs a dropdown, not a results page.
 */
export async function fetchDoctorSuggestions(
  term: string
): Promise<DoctorProfile[]> {
  const trimmed = term.trim();
  if (!trimmed) return [];

  const response = await fetchDoctors({
    search: trimmed,
    limit: 6,
    page: 1,
    sortBy: "rating",
  });

  return Array.isArray(response?.data) ? response.data : [];
}

/**
 * Fetch a single verified doctor by CUID ID or SEO slug
 */
export async function fetchDoctorById(idOrSlug: string): Promise<DoctorProfile> {
  const response = await apiClient.get(`/doctors/${encodeURIComponent(idOrSlug)}`);
  return response.data?.data || response.data;
}

export const fetchDoctorByIdOrSlug = fetchDoctorById;

/**
 * Fetch active availability slots for a doctor by ID or slug
 */
export async function fetchDoctorAvailability(
  idOrSlug: string
): Promise<DoctorAvailability[]> {
  const response = await apiClient.get(
    `/doctors/${encodeURIComponent(idOrSlug)}/availability`
  );
  return response.data?.data || response.data;
}

/**
 * Fetch currently logged-in doctor profile
 */
export async function fetchMyDoctorProfile(): Promise<DoctorProfile> {
  const response = await apiClient.get("/doctors/me");
  return response.data?.data || response.data;
}

/**
 * Update currently logged-in doctor's profile, qualifications, clinic info, and specialties
 */
export async function updateMyDoctorProfile(
  data: FormData | UpdateDoctorProfileInput
): Promise<DoctorProfile> {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const response = await apiClient.patch("/doctors/me", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data?.data || response.data;
}

/**
 * Fetch all available medical specialties
 */
export async function fetchSpecialties(): Promise<Specialty[]> {
  const response = await apiClient.get("/specialties");
  const data = response.data?.data || response.data;
  return Array.isArray(data) ? data : data?.data || [];
}

/**
 * Fetch aggregated doctor dashboard data (stats, next up visit, today's schedule, availability summary)
 */
export async function fetchDoctorDashboard(): Promise<DoctorDashboardData> {
  const response = await apiClient.get<{ data: DoctorDashboardData }>("/doctors/dashboard");
  return response.data?.data || response.data;
}

/**
 * Fetch doctor dashboard summary metrics
 */
export async function fetchDoctorDashboardStats(): Promise<DoctorDashboardStats> {
  const response = await apiClient.get<{ data: { stats: DoctorDashboardStats } }>(
    "/doctors/dashboard/stats"
  );
  const body = response.data?.data || response.data;
  return "stats" in body ? body.stats : body;
}

/**
 * Fetch doctor consultation bookings with status filtering and pagination
 */
export async function fetchDoctorBookings(
  params?: DoctorBookingsQueryParams
): Promise<DoctorBookingsResponse> {
  const response = await apiClient.get<{ data: DoctorDashboardBooking[]; meta?: any }>(
    "/appointments/my-bookings",
    { params }
  );
  const body = response.data;
  if (body && typeof body === "object" && "data" in body && Array.isArray(body.data)) {
    return {
      data: body.data,
      meta: body.meta,
    };
  }
  return {
    data: Array.isArray(body) ? body : [],
  };
}

/**
 * Confirm a pending consultation booking (generates Google Meet link & notifies patient)
 */
export async function confirmDoctorBooking(
  bookingId: string
): Promise<DoctorDashboardBooking> {
  const response = await apiClient.patch<{ data: DoctorDashboardBooking }>(
    `/appointments/${bookingId}/confirm`
  );
  return response.data?.data || response.data;
}

/**
 * Mark a consultation booking as completed
 */
export async function completeDoctorBooking(
  bookingId: string
): Promise<DoctorDashboardBooking> {
  const response = await apiClient.patch<{ data: DoctorDashboardBooking }>(
    `/appointments/${bookingId}/complete`
  );
  return response.data?.data || response.data;
}

/**
 * Cancel a consultation booking
 */
export async function cancelDoctorBooking(
  bookingId: string
): Promise<DoctorDashboardBooking> {
  const response = await apiClient.patch<{ data: DoctorDashboardBooking }>(
    `/appointments/${bookingId}/cancel`
  );
  return response.data?.data || response.data;
}

/**
 * Fetch doctor's weekly recurring availability slots
 */
export async function fetchDoctorScheduleSlots(): Promise<DoctorAvailability[]> {
  const response = await apiClient.get<{ data: DoctorAvailability[] }>(
    "/doctors/me/availability"
  );
  const body = response.data?.data || response.data;
  return Array.isArray(body) ? body : [];
}

/**
 * Create a new weekly availability slot
 */
export async function createDoctorScheduleSlot(
  data: CreateAvailabilityInput
): Promise<DoctorAvailability> {
  const response = await apiClient.post<{ data: DoctorAvailability }>(
    "/doctors/me/availability",
    data
  );
  return response.data?.data || response.data;
}

/**
 * Update an existing weekly availability slot (active toggle, hours, duration)
 */
export async function updateDoctorScheduleSlot(
  slotId: string,
  data: UpdateAvailabilityInput
): Promise<DoctorAvailability> {
  const response = await apiClient.patch<{ data: DoctorAvailability }>(
    `/doctors/me/availability/${slotId}`,
    data
  );
  return response.data?.data || response.data;
}

/**
 * Delete a weekly availability slot
 */
export async function deleteDoctorScheduleSlot(
  slotId: string
): Promise<{ success: boolean; message?: string }> {
  const response = await apiClient.delete<{ success: boolean; message?: string }>(
    `/doctors/me/availability/${slotId}`
  );
  return response.data;
}

/**
 * Fetch doctor's scheduled days off & vacation leaves
 */
export async function fetchDoctorDaysOff(): Promise<DoctorDayOff[]> {
  const response = await apiClient.get<{ data: DoctorDayOff[] }>(
    "/doctors/me/days-off"
  );
  const body = response.data?.data || response.data;
  return Array.isArray(body) ? body : [];
}

/**
 * Schedule a new day off / vacation
 */
export async function createDoctorDayOff(
  data: CreateDayOffInput
): Promise<DoctorDayOff> {
  const response = await apiClient.post<{ data: DoctorDayOff }>(
    "/doctors/me/days-off",
    data
  );
  return response.data?.data || response.data;
}

/**
 * Remove a scheduled day off / vacation
 */
export async function deleteDoctorDayOff(
  dayOffId: string
): Promise<{ success: boolean; message?: string }> {
  const response = await apiClient.delete<{ success: boolean; message?: string }>(
    `/doctors/me/days-off/${dayOffId}`
  );
  return response.data;
}

/**
 * Fetch doctor's patient registry list with optional search query
 */
export async function fetchMyDoctorPatients(
  search?: string
): Promise<DoctorPatientRegistryItem[]> {
  const params = search && search.trim() ? { search: search.trim() } : undefined;
  const response = await apiClient.get<{ data: DoctorPatientRegistryItem[] }>(
    "/doctors/me/patients",
    { params }
  );
  const body = response.data?.data || response.data;
  return Array.isArray(body) ? body : [];
}

/**
 * Fetch Google Calendar & Meet connection status
 */
export async function fetchGoogleConnectionStatus(): Promise<GoogleConnectionStatus> {
  const response = await apiClient.get<{ data: GoogleConnectionStatus }>("/google/status");
  return response.data?.data || response.data;
}

/**
 * Fetch Google OAuth consent authorization URL
 */
export async function fetchGoogleAuthUrl(): Promise<{ url: string }> {
  const response = await apiClient.get<{ data: { url: string } }>("/google/auth-url");
  return response.data?.data || response.data;
}

/**
 * Disconnect linked Google account
 */
export async function disconnectGoogle(): Promise<{ message: string }> {
  const response = await apiClient.delete<{ data: { message: string } }>("/google/disconnect");
  return response.data?.data || response.data;
}

/**
 * Upload doctor verification document (BMDC License, Degree, NID, etc.)
 */
export async function uploadDoctorDocument(
  formData: FormData
): Promise<{ success: boolean; message?: string; data?: any }> {
  const response = await apiClient.post("/doctors/me/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

