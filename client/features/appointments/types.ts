/**
 * Shared Appointment Types & Query Keys
 *
 * Status counts are produced by the backend (`GET /appointments/summary`) so the
 * status tabs are never derived from client-side filtering logic.
 */

export type BookingStatusValue =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type BookingStatusFilter = "ALL" | BookingStatusValue;

export interface BookingSummaryCounts {
  all: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export const EMPTY_BOOKING_SUMMARY: BookingSummaryCounts = {
  all: 0,
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
};

export const BOOKING_STATUS_FILTERS: readonly BookingStatusFilter[] = [
  "ALL",
  "CONFIRMED",
  "PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;

/**
 * Normalizes an arbitrary status string coming from the URL into a valid filter.
 */
export function normalizeStatusFilter(value?: string | null): BookingStatusFilter {
  const upper = (value || "ALL").toUpperCase();
  return (BOOKING_STATUS_FILTERS as readonly string[]).includes(upper)
    ? (upper as BookingStatusFilter)
    : "ALL";
}

/**
 * Appointment view model rendered by the patient & doctor dashboard cards.
 * Produced by `mapBookingToAppointment` (patients) and by the doctor booking
 * endpoints, so both portals share one row contract.
 */
export interface DashboardAppointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  doctorHospital?: string;
  doctorDegrees?: string[];
  doctorPhone?: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientAvatar?: string;
  patientPhone?: string;
  dateFormatted: string;
  timeFormatted: string;
  consultationType: "Video Consultation" | "In-Person Consultation" | "Audio Consultation";
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
  meetLink?: string;
  symptoms?: string;
  fee: number;
  notes?: string;
  isToday?: boolean;
}

/**
 * A single entry in the doctor's "today's schedule" table.
 */
export interface DoctorScheduleItem {
  id: string;
  time: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAvatar: string;
  patientPhone?: string;
  consultationType: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
  symptoms: string;
  meetLink?: string;
  fee: number;
}

/**
 * Unified Appointment Query Keys (shared across doctor & patient views so server
 * prefetch and client hooks hydrate the exact same cache entry).
 */
export const appointmentKeys = {
  all: ["appointments"] as const,
  summary: () => [...appointmentKeys.all, "summary"] as const,
};
