import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import { cookies } from "next/headers";
import {
  PatientDashboardData,
  PatientBookingsQueryParams,
  PatientBookingsResponse,
} from "../types";

/**
 * Server-Side fetcher for patient dashboard overview data
 */
export async function getPatientDashboardServer(
  options?: ServerFetchOptions
): Promise<PatientDashboardData | null> {
  try {
    let cookieHeader = "";
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {}

    const response = await serverFetch<{
      success: boolean;
      data: PatientDashboardData;
    }>("/patients/dashboard", {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      // Do not cache personalized dashboard data across users
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
    let cookieHeader = "";
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {}

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
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
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
): Promise<import("../types").PatientProfileData | null> {
  try {
    let cookieHeader = "";
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {}

    const response = await serverFetch<{
      success: boolean;
      data: import("../types").PatientProfileData;
    }>("/patients/me", {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
      ...options,
    });

    return response.data || null;
  } catch (error) {
    console.error("Failed to fetch patient profile on server:", error);
    return null;
  }
}
