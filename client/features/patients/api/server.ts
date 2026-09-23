import { serverFetch, ServerFetchOptions } from "@/lib/api/server";
import {
  PatientDashboardData,
  PatientBookingsQueryParams,
  PatientBookingsResponse,
  PatientProfileData,
} from "../types";

/**
 * Server-Side fetcher for patient dashboard overview data
 */
export async function getPatientDashboardServer(
  options?: ServerFetchOptions
): Promise<PatientDashboardData | null> {
  try {
    const response = await serverFetch<{
      success: boolean;
      data: PatientDashboardData;
    }>("/patients/dashboard", {
      cache: "no-store",
      ...options,
    });

    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch patient dashboard on server:", error);
    return null;
  }
}

/**
 * Server-Side fetcher for patient bookings list
 */
export async function getPatientBookingsServer(
  params?: PatientBookingsQueryParams,
  options?: ServerFetchOptions
): Promise<PatientBookingsResponse> {
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
      data: PatientBookingsResponse["data"];
      meta: PatientBookingsResponse["meta"];
    }>(endpoint, {
      cache: "no-store",
      ...options,
    });

    return {
      data: response.data || [],
      meta: response.meta || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data?.length || 0,
        totalPages: 1,
      },
    };
  } catch (error) {
    console.error("Failed to fetch patient bookings on server:", error);
    return {
      data: [],
      meta: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  }
}

/**
 * Server-Side fetcher for patient profile
 */
export async function getPatientProfileServer(
  options?: ServerFetchOptions
): Promise<PatientProfileData | null> {
  try {
    const response = await serverFetch<{
      success: boolean;
      data: PatientProfileData;
    }>("/patients/me", {
      cache: "no-store",
      ...options,
    });

    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch patient profile on server:", error);
    return null;
  }
}
