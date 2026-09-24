import {
  buildQueryString,
  serverGet,
  serverGetPage,
  ServerFetchOptions,
} from "@/lib/api/server";
import { isNotFound } from "@/lib/api/error";
import { CACHE } from "@/lib/cache/policy";
import { buildDoctorQuery } from "../query";
import {
  DoctorAvailability,
  DoctorBookingsQueryParams,
  DoctorBookingsResponse,
  DoctorDashboardBooking,
  DoctorDashboardData,
  DoctorDayOff,
  DoctorPatientRegistryItem,
  DoctorProfile,
  DoctorQueryParams,
  PaginationMeta,
  Specialty,
} from "../types";

export interface DoctorsServerResponse {
  data: DoctorProfile[];
  meta: PaginationMeta;
}

/* ------------------------------ Public reads ------------------------------ */

export async function getDoctorsServer(
  params?: DoctorQueryParams,
  options?: ServerFetchOptions
): Promise<DoctorsServerResponse> {
  const page = await serverGetPage<DoctorProfile>(
    `/doctors${buildQueryString(buildDoctorQuery(params))}`,
    { ...CACHE.doctors.server, ...options }
  );
  return { data: page.data, meta: page.meta };
}

/**
 * Returns `null` only for a genuine 404 (so the page can render its
 * not-found state); every other failure propagates as an `ApiError`.
 */
export async function getDoctorByIdOrSlugServer(
  idOrSlug: string,
  options?: ServerFetchOptions
): Promise<DoctorProfile | null> {
  try {
    return await serverGet<DoctorProfile>(
      `/doctors/${encodeURIComponent(idOrSlug)}`,
      { ...CACHE.doctorDetail(idOrSlug).server, ...options }
    );
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function getDoctorAvailabilityServer(
  idOrSlug: string,
  options?: ServerFetchOptions
): Promise<DoctorAvailability[]> {
  return serverGet<DoctorAvailability[]>(
    `/doctors/${encodeURIComponent(idOrSlug)}/availability`,
    { ...CACHE.doctorAvailability(idOrSlug).server, ...options }
  );
}

export async function getSpecialtiesServer(
  options?: ServerFetchOptions
): Promise<Specialty[]> {
  return serverGet<Specialty[]>("/specialties", {
    ...CACHE.specialties.server,
    ...options,
  });
}

/* ------------------------------ Doctor self ------------------------------- */

export async function getDoctorDashboardServer(
  options?: ServerFetchOptions
): Promise<DoctorDashboardData> {
  return serverGet<DoctorDashboardData>("/doctors/dashboard", {
    ...CACHE.private.server,
    ...options,
  });
}

export async function getDoctorBookingsServer(
  params?: DoctorBookingsQueryParams,
  options?: ServerFetchOptions
): Promise<DoctorBookingsResponse> {
  return serverGetPage<DoctorDashboardBooking>(
    `/appointments/my-bookings${buildQueryString(params)}`,
    { ...CACHE.private.server, ...options }
  );
}

export async function getMyDoctorScheduleServer(
  options?: ServerFetchOptions
): Promise<DoctorAvailability[]> {
  return serverGet<DoctorAvailability[]>("/doctors/me/availability", {
    ...CACHE.private.server,
    ...options,
  });
}

export async function getMyDoctorDaysOffServer(
  options?: ServerFetchOptions
): Promise<DoctorDayOff[]> {
  return serverGet<DoctorDayOff[]>("/doctors/me/days-off", {
    ...CACHE.private.server,
    ...options,
  });
}

export async function getMyDoctorPatientsServer(
  search?: string,
  options?: ServerFetchOptions
): Promise<DoctorPatientRegistryItem[]> {
  return serverGet<DoctorPatientRegistryItem[]>(
    `/doctors/me/patients${buildQueryString(
      search?.trim() ? { search: search.trim() } : undefined
    )}`,
    { ...CACHE.private.server, ...options }
  );
}

export async function getMyDoctorProfileServer(
  options?: ServerFetchOptions
): Promise<DoctorProfile | null> {
  try {
    return await serverGet<DoctorProfile>("/doctors/me", {
      ...CACHE.private.server,
      ...options,
    });
  } catch (error) {
    // An unverified/absent doctor profile is a normal state, not an outage.
    if (isNotFound(error)) return null;
    throw error;
  }
}
