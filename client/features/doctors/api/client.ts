import { apiClient } from "@/lib/api/axios";
import {
  Specialty,
  DoctorProfile,
  DoctorQueryParams,
  DoctorAvailability,
  UpdateDoctorProfileInput,
  DoctorsListResponse,
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
  const url = queryStr ? `/doctors?${queryStr}` : "/doctors";

  const response = await apiClient.get(url);
  return response.data;
}

/**
 * Fetch public doctor profile details by ID or SEO slug
 */
export async function fetchDoctorByIdOrSlug(
  idOrSlug: string
): Promise<DoctorProfile> {
  const response = await apiClient.get(`/doctors/${encodeURIComponent(idOrSlug)}`);
  return response.data?.data || response.data;
}

/**
 * Fetch doctor's weekly active availability slots
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
  data: UpdateDoctorProfileInput
): Promise<DoctorProfile> {
  const response = await apiClient.patch("/doctors/me", data);
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
