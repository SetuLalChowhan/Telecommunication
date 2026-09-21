import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import {
  Specialty,
  DoctorProfile,
  DoctorQueryParams,
  DoctorAvailability,
  PaginationMeta,
  DoctorDashboardData,
  DoctorBookingsQueryParams,
  DoctorBookingsResponse,
  DoctorDayOff,
  DoctorPatientRegistryItem,
} from "../types";

export interface DoctorsServerResponse {
  data: DoctorProfile[];
  meta: PaginationMeta;
}

/**
 * Server-Side fetcher for verified doctors list (usable in Server Components / RSC)
 */
export async function getDoctorsServer(
  params?: DoctorQueryParams,
  options?: ServerFetchOptions
): Promise<DoctorsServerResponse> {
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

  interface ApiResponse<T> {
    success: boolean;
    data: T;
    meta?: PaginationMeta;
  }

  try {
    const response = await serverFetch<ApiResponse<DoctorProfile[]>>(endpoint, {
      revalidate: 60, // 60s cache ISR
      tags: ["doctors"],
      ...options,
    });

    return {
      data: response.data || [],
      meta: response.meta || {
        page: params?.page || 1,
        limit: params?.limit || 6,
        total: response.data?.length || 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  } catch (error) {
    console.error("Failed to fetch doctors on server:", error);
    return {
      data: [],
      meta: {
        page: params?.page || 1,
        limit: params?.limit || 6,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

/**
 * Server-Side fetcher for single doctor profile details by ID or Slug
 */
export async function getDoctorByIdOrSlugServer(
  idOrSlug: string,
  options?: ServerFetchOptions
): Promise<DoctorProfile | null> {
  try {
    const response = await serverFetch<{ success: boolean; data: DoctorProfile }>(
      `/doctors/${encodeURIComponent(idOrSlug)}`,
      {
        revalidate: 60,
        tags: [`doctor-${idOrSlug}`],
        ...options,
      }
    );
    return response.data || null;
  } catch (error) {
    console.error(`Failed to fetch doctor (${idOrSlug}) on server:`, error);
    return null;
  }
}

/**
 * Server-Side fetcher for doctor's availability slots
 */
export async function getDoctorAvailabilityServer(
  idOrSlug: string,
  options?: ServerFetchOptions
): Promise<DoctorAvailability[]> {
  try {
    const response = await serverFetch<{ success: boolean; data: DoctorAvailability[] }>(
      `/doctors/${encodeURIComponent(idOrSlug)}/availability`,
      {
        revalidate: 30,
        tags: [`doctor-availability-${idOrSlug}`],
        ...options,
      }
    );
    return response.data || [];
  } catch {
    return [];
  }
}

/**
 * Server-Side fetcher for all medical specialties
 */
export async function getSpecialtiesServer(
  options?: ServerFetchOptions
): Promise<Specialty[]> {
  try {
    const response = await serverFetch<{ success: boolean; data: Specialty[] }>(
      "/specialties",
      {
        revalidate: 300, // 5 min ISR
        tags: ["specialties"],
        ...options,
      }
    );
    const data = response.data || [];
    return Array.isArray(data)
      ? data
      : (data as unknown as { data?: Specialty[] })?.data || [];
  } catch {
    return [];
  }
}

/**
 * Server-Side fetcher for doctor dashboard overview data
 */
export async function getDoctorDashboardServer(
  options?: ServerFetchOptions
): Promise<DoctorDashboardData | null> {
  try {
    const response = await serverFetch<{
      success: boolean;
      data: DoctorDashboardData;
    }>("/doctors/dashboard", {
      cache: "no-store",
      ...options,
    });

    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch doctor dashboard on server:", error);
    return null;
  }
}

/**
 * Server-Side fetcher for doctor consultation bookings
 */
export async function getDoctorBookingsServer(
  params?: DoctorBookingsQueryParams,
  options?: ServerFetchOptions
): Promise<DoctorBookingsResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set("status", params.status);
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.limit) queryParams.set("limit", String(params.limit));

    const queryStr = queryParams.toString();
    const endpoint = queryStr
      ? `/appointments/my-bookings?${queryStr}`
      : "/appointments/my-bookings";

    const response = await serverFetch<{
      success: boolean;
      data: any;
      meta?: any;
    }>(endpoint, {
      cache: "no-store",
      ...options,
    });

    const body = response.data;
    if (body && typeof body === "object" && "data" in body && Array.isArray(body.data)) {
      return {
        data: body.data,
        meta: body.meta,
      };
    }

    return {
      data: Array.isArray(body) ? body : [],
      meta: response.meta,
    };
  } catch (error) {
    console.error("Failed to fetch doctor bookings on server:", error);
    return {
      data: [],
    };
  }
}

/**
 * Server-Side fetcher for doctor's own recurring availability schedule
 */
export async function getMyDoctorScheduleServer(
  options?: ServerFetchOptions
): Promise<DoctorAvailability[]> {
  try {
    const response = await serverFetch<{
      success: boolean;
      data: DoctorAvailability[];
    }>("/doctors/me/availability", {
      cache: "no-store",
      ...options,
    });

    const body = response.data;
    if (Array.isArray(body)) return body;
    if (body && typeof body === "object" && "data" in body && Array.isArray((body as any).data)) {
      return (body as any).data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch doctor schedule on server:", error);
    return [];
  }
}

/**
 * Server-Side fetcher for doctor's planned days off
 */
export async function getMyDoctorDaysOffServer(
  options?: ServerFetchOptions
): Promise<DoctorDayOff[]> {
  try {
    const response = await serverFetch<{
      success: boolean;
      data: DoctorDayOff[];
    }>("/doctors/me/days-off", {
      cache: "no-store",
      ...options,
    });

    const body = response.data;
    if (Array.isArray(body)) return body;
    if (body && typeof body === "object" && "data" in body && Array.isArray((body as any).data)) {
      return (body as any).data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch doctor days off on server:", error);
    return [];
  }
}

/**
 * Server-Side fetcher for doctor's patient registry list
 */
export async function getMyDoctorPatientsServer(
  search?: string,
  options?: ServerFetchOptions
): Promise<DoctorPatientRegistryItem[]> {
  try {
    const queryParams = new URLSearchParams();
    if (search && search.trim()) queryParams.set("search", search.trim());
    const queryStr = queryParams.toString();
    const endpoint = queryStr
      ? `/doctors/me/patients?${queryStr}`
      : "/doctors/me/patients";

    const response = await serverFetch<{
      success: boolean;
      data: DoctorPatientRegistryItem[];
    }>(endpoint, {
      cache: "no-store",
      ...options,
    });

    const body = response.data;
    if (Array.isArray(body)) return body;
    if (body && typeof body === "object" && "data" in body && Array.isArray((body as any).data)) {
      return (body as any).data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch doctor patient registry on server:", error);
    return [];
  }
}

/**
 * Server-Side fetcher for currently logged-in doctor's own profile
 */
export async function getMyDoctorProfileServer(
  options?: ServerFetchOptions
): Promise<DoctorProfile | null> {
  try {
    const response = await serverFetch<{
      success: boolean;
      data: DoctorProfile;
    }>("/doctors/me", {
      cache: "no-store",
      ...options,
    });

    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch doctor profile on server:", error);
    return null;
  }
}
