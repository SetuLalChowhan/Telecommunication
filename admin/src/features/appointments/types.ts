export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface AppointmentParty {
  id: string;
  userId: string;
  /** Doctor only. */
  slug?: string | null;
  /** Patient only. */
  address?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  user: { name: string | null; email: string; phone: string | null };
}

export interface AppointmentReport {
  id: string;
  patientId: string;
  bookingId: string | null;
  fileUrl: string;
  fileName: string | null;
  uploadedAt: string;
}

export interface AppointmentReview {
  id: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

/** A booking row as returned by `GET /admin/appointments`. */
export interface AdminAppointment {
  id: string;
  doctorId: string;
  patientId: string;
  slotStart: string;
  slotEnd: string;
  status: BookingStatus;
  meetLink: string | null;
  googleEventId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: AppointmentParty;
  patient: AppointmentParty;
  reports: AppointmentReport[];
  review: AppointmentReview | null;
}

export interface AppointmentQueryParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  doctorId?: string;
  patientId?: string;
}

export interface UpdateAppointmentPayload {
  status?: BookingStatus;
  notes?: string;
  meetLink?: string;
}

export const appointmentKeys = {
  all: ["admin", "appointments"] as const,
  list: (params: AppointmentQueryParams) => [...appointmentKeys.all, "list", params] as const,
  detail: (id: string) => [...appointmentKeys.all, "detail", id] as const,
};
