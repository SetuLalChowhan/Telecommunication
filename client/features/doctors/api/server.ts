import {
  buildQueryString,
  serverGet,
  serverGetPage,
  ServerFetchOptions,
} from "@/lib/api/server";
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

const emptyMeta = (limit: number): PaginationMeta => ({
  page: 1,
  limit,
  total: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
});

/* ------------------------------ Public reads ------------------------------ */

export async function getDoctorsServer(
  params?: DoctorQueryParams,
  options?: ServerFetchOptions
): Promise<DoctorsServerResponse> {
  try {
    const page = await serverGetPage<DoctorProfile>(
      `/doctors${buildQueryString(buildDoctorQuery(params))}`,
      { ...CACHE.doctors.server, ...options }
    );
    return { data: page.data, meta: page.meta };
  } catch (error) {
    console.error("Failed to fetch doctors on server:", error);
    return { data: [], meta: emptyMeta(params?.limit ?? 6) };
  }
}

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
    console.error(`Failed to fetch doctor (${idOrSlug}) on server:`, error);
    return null;
  }
}

export async function getDoctorAvailabilityServer(
  idOrSlug: string,
  options?: ServerFetchOptions
): Promise<DoctorAvailability[]> {
  try {
    return await serverGet<DoctorAvailability[]>(
      `/doctors/${encodeURIComponent(idOrSlug)}/availability`,
      { ...CACHE.doctorAvailability(idOrSlug).server, ...options }
    );
  } catch {
    return [];
  }
}

export async function getSpecialtiesServer(
  options?: ServerFetchOptions
): Promise<Specialty[]> {
  try {
    return await serverGet<Specialty[]>("/specialties", {
      ...CACHE.specialties.server,
      ...options,
    });
  } catch {
    return [];
  }
}

/* ------------------------------ Doctor self ------------------------------- */

export async function getDoctorDashboardServer(
  options?: ServerFetchOptions
): Promise<DoctorDashboardData | null> {
  try {
    return await serverGet<DoctorDashboardData>("/doctors/dashboard", {
      ...CACHE.private.server,
      ...options,
    });
  } catch (error) {
    console.error("Failed to fetch doctor dashboard on server:", error);
    return null;
  }
}

export async function getDoctorBookingsServer(
  params?: DoctorBookingsQueryParams,
  options?: ServerFetchOptions
): Promise<DoctorBookingsResponse> {
  try {
    return await serverGetPage<DoctorDashboardBooking>(
      `/appointments/my-bookings${buildQueryString(params)}`,
      { ...CACHE.private.server, ...options }
    );
  } catch (error) {
    console.error("Failed to fetch doctor bookings on server:", error);
    return { data: [] };
  }
}

export async function getMyDoctorScheduleServer(
  options?: ServerFetchOptions
): Promise<DoctorAvailability[]> {
  try {
    return await serverGet<DoctorAvailability[]>("/doctors/me/availability", {
      ...CACHE.private.server,
      ...options,
    });
  } catch (error) {
    console.error("Failed to fetch doctor schedule on server:", error);
    return [];
  }
}

export async function getMyDoctorDaysOffServer(
  options?: ServerFetchOptions
): Promise<DoctorDayOff[]> {
  try {
    return await serverGet<DoctorDayOff[]>("/doctors/me/days-off", {
      ...CACHE.private.server,
      ...options,
    });
  } catch (error) {
    console.error("Failed to fetch doctor days off on server:", error);
    return [];
  }
}

export async function getMyDoctorPatientsServer(
  search?: string,
  options?: ServerFetchOptions
): Promise<DoctorPatientRegistryItem[]> {
  try {
    return await serverGet<DoctorPatientRegistryItem[]>(
      `/doctors/me/patients${buildQueryString(
        search?.trim() ? { search: search.trim() } : undefined
      )}`,
      { ...CACHE.private.server, ...options }
    );
  } catch (error) {
    console.error("Failed to fetch doctor patient registry on server:", error);
    return [];
  }
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
    console.error("Failed to fetch doctor profile on server:", error);
    return null;
  }
}
