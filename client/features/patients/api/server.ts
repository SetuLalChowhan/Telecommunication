import { buildQueryString, serverGet, serverGetPage, ServerFetchOptions } from "@/lib/api/server";
import { isNotFound } from "@/lib/api/error";
import { CACHE } from "@/lib/cache/policy";
import {
  PatientDashboardData,
  PatientBookingsQueryParams,
  PatientBookingsResponse,
  PatientProfileData,
} from "../types";

/**
 * Server-Side fetcher for patient dashboard overview data.
 *
 * Returns `null` only when the patient has no dashboard yet (404); outages
 * propagate to the route error boundary.
 */
export async function getPatientDashboardServer(
  options?: ServerFetchOptions
): Promise<PatientDashboardData | null> {
  try {
    return await serverGet<PatientDashboardData>("/patients/dashboard", {
      ...CACHE.private.server,
      ...options,
    });
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

/**
 * Server-Side fetcher for patient bookings list.
 *
 * Reuses the canonical paginated server helper so the response envelope is
 * unwrapped in exactly one place.
 */
export async function getPatientBookingsServer(
  params?: PatientBookingsQueryParams,
  options?: ServerFetchOptions
): Promise<PatientBookingsResponse> {
  return serverGetPage("/appointments/my-bookings" + buildQueryString(params), {
    ...CACHE.private.server,
    ...options,
  });
}

/**
 * Server-Side fetcher for patient profile.
 *
 * Returns `null` for a genuine 404 (profile not created yet); every other
 * failure propagates.
 */
export async function getPatientProfileServer(
  options?: ServerFetchOptions
): Promise<PatientProfileData | null> {
  try {
    return await serverGet<PatientProfileData>("/patients/me", {
      ...CACHE.private.server,
      ...options,
    });
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}
