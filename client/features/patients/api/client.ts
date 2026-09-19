import { apiClient } from "@/lib/api/axios";
import {
  PatientDashboardData,
  PatientBookingsQueryParams,
  PatientBookingsResponse,
  RawBooking,
} from "../types";

/**
 * Fetch patient dashboard aggregated data (stats, next consultation, recent visits, recommendations)
 */
export async function fetchPatientDashboard(): Promise<PatientDashboardData> {
  const response = await apiClient.get<{ data: PatientDashboardData }>(
    "/patients/dashboard"
  );
  return response.data.data;
}

/**
 * Fetch patient's bookings with optional status filtering and pagination
 */
interface BackendPaginatedBookingsResponse {
  success?: boolean;
  data?: RawBooking[];
  meta?: PatientBookingsResponse["meta"];
}

export async function fetchPatientBookings(
  params?: PatientBookingsQueryParams
): Promise<PatientBookingsResponse> {
  const response = await apiClient.get<BackendPaginatedBookingsResponse | RawBooking[]>(
    "/appointments/my-bookings",
    { params }
  );
  const body = response.data;
  if (body && typeof body === "object" && "data" in body && Array.isArray(body.data)) {
    return {
      data: body.data,
      meta: body.meta || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: body.data.length,
        totalPages: 1,
      },
    };
  }
  return {
    data: Array.isArray(body) ? body : [],
    meta: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: Array.isArray(body) ? body.length : 0,
      totalPages: 1,
    },
  };
}

/**
 * Cancel a patient booking by ID
 */
export async function cancelPatientBooking(
  bookingId: string,
  reason?: string
): Promise<RawBooking> {
  const response = await apiClient.patch<{ data: RawBooking }>(
    `/appointments/${bookingId}/cancel`,
    { reason }
  );
  return response.data.data;
}
