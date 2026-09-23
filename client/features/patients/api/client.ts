import { http } from "@/lib/api/client";
import {
  AvailableSlotsData,
  CreateBookingInput,
  PatientBookingsQueryParams,
  PatientBookingsResponse,
  PatientDashboardData,
  PatientProfileData,
  RawBooking,
  UpdatePatientProfilePayload,
} from "../types";

/** Fetch the patient dashboard aggregated data. */
export async function fetchPatientDashboard(): Promise<PatientDashboardData> {
  return http.get<PatientDashboardData>("/patients/dashboard");
}

/** Fetch the patient's bookings with optional status filter and pagination. */
export async function fetchPatientBookings(
  params?: PatientBookingsQueryParams
): Promise<PatientBookingsResponse> {
  return http.getPage<RawBooking>("/appointments/my-bookings", { params });
}

/** Cancel a patient booking by id. */
export async function cancelPatientBooking(
  bookingId: string,
  reason?: string
): Promise<RawBooking> {
  return http.patch<RawBooking>(`/appointments/${bookingId}/cancel`, { reason });
}

/** Fetch the authenticated patient profile. */
export async function fetchPatientProfile(): Promise<PatientProfileData> {
  return http.get<PatientProfileData>("/patients/me");
}

/** Update the authenticated patient profile (FormData for image upload, or JSON). */
export async function updatePatientProfile(
  payload: FormData | UpdatePatientProfilePayload
): Promise<PatientProfileData> {
  const headers =
    payload instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : undefined;

  return http.patch<PatientProfileData>("/patients/me", payload, { headers });
}

/** Fetch concrete available slots for a doctor on a specific date (YYYY-MM-DD). */
export async function fetchAvailableSlots(
  doctorId: string,
  date: string
): Promise<AvailableSlotsData> {
  return http.get<AvailableSlotsData>("/appointments/slots", {
    params: { doctorId, date },
  });
}

/** Book an appointment for an available slot. */
export async function createAppointmentBooking(
  input: CreateBookingInput
): Promise<RawBooking> {
  return http.post<RawBooking>("/appointments", input);
}
