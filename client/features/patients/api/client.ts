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

/**
 * Fetch authenticated patient profile details
 */
export async function fetchPatientProfile(): Promise<import("../types").PatientProfileData> {
  const response = await apiClient.get<{ data: import("../types").PatientProfileData }>(
    "/patients/me"
  );
  return response.data.data;
}

/**
 * Update authenticated patient profile (handles both FormData for image upload and json)
 */
export async function updatePatientProfile(
  payload: FormData | import("../types").UpdatePatientProfilePayload
): Promise<import("../types").PatientProfileData> {
  const headers =
    payload instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : undefined;

  const response = await apiClient.patch<{ data: import("../types").PatientProfileData }>(
    "/patients/me",
    payload,
    { headers }
  );
  return response.data.data;
}

/**
 * Fetch concrete available slots for a doctor on a specific date (YYYY-MM-DD)
 */
export async function fetchAvailableSlots(
  doctorId: string,
  date: string
): Promise<import("../types").AvailableSlotsData> {
  const response = await apiClient.get<{
    success: boolean;
    data: import("../types").AvailableSlotsData;
  }>("/appointments/slots", {
    params: { doctorId, date },
  });
  return response.data.data;
}

/**
 * Patient books an appointment for an available slot
 */
export async function createAppointmentBooking(
  input: import("../types").CreateBookingInput
): Promise<RawBooking> {
  const response = await apiClient.post<{
    success: boolean;
    message?: string;
    data: RawBooking;
  }>("/appointments", input);
  return response.data.data;
}
