import { DashboardAppointment, RecommendedDoctor } from "@/lib/dashboard-mock-data";

export interface PatientDashboardStats {
  totalConsultations: number;
  upcomingConsultations: number;
  pendingConsultations: number;
  completedConsultations: number;
  cancelledConsultations: number;
  medicalReportsCount: number;
}

export interface PatientDashboardData {
  stats: PatientDashboardStats;
  nextConsultation: DashboardAppointment | null;
  recentConsultations: DashboardAppointment[];
  recommendedDoctors: RecommendedDoctor[];
}

export interface PatientDashboardResponse {
  success: boolean;
  message: string;
  data: PatientDashboardData;
}

export interface PatientBookingsQueryParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface RawBookingDoctorUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
}

export interface RawBookingDoctorSpecialty {
  isPrimary?: boolean;
  specialty?: {
    id?: string;
    name: string;
  };
}

export interface RawBookingDoctor {
  id: string;
  slug?: string;
  fee?: number | string;
  hospitalAffiliation?: string;
  user?: RawBookingDoctorUser;
  specialties?: RawBookingDoctorSpecialty[];
  qualifications?: Array<{ degree: string; field?: string }>;
}

export interface RawBooking {
  id: string;
  patientId: string;
  doctorId: string;
  slotStart: string | Date;
  slotEnd: string | Date;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  symptoms?: string | null;
  meetLink?: string | null;
  notes?: string | null;
  cancelledReason?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  doctor?: RawBookingDoctor;
  patient?: {
    user?: {
      id?: string;
      name?: string;
      email?: string;
      phone?: string;
      image?: string;
      dateOfBirth?: string;
    };
  };
  reports?: unknown[];
}

export interface PatientBookingsResponse {
  data: RawBooking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const patientKeys = {
  all: ["patients"] as const,
  dashboard: () => [...patientKeys.all, "dashboard"] as const,
  bookings: (params?: PatientBookingsQueryParams) =>
    [
      ...patientKeys.all,
      "bookings",
      params?.status || "ALL",
      params?.page || 1,
    ] as const,
};

/**
 * Maps a raw backend booking object into a DashboardAppointment for UI consumption
 */
export function mapBookingToAppointment(b: RawBooking): DashboardAppointment {
  const start = new Date(b.slotStart);
  const isValidDate = !isNaN(start.getTime());

  const now = new Date();
  const isToday =
    isValidDate &&
    start.getFullYear() === now.getFullYear() &&
    start.getMonth() === now.getMonth() &&
    start.getDate() === now.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    isValidDate &&
    start.getFullYear() === tomorrow.getFullYear() &&
    start.getMonth() === tomorrow.getMonth() &&
    start.getDate() === tomorrow.getDate();

  let dateFormatted = isValidDate
    ? start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Scheduled";

  if (isToday) dateFormatted = "Today";
  else if (isTomorrow) dateFormatted = "Tomorrow";

  const timeFormatted = isValidDate
    ? start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const doctor = b.doctor;
  const doctorName = doctor?.user?.name || "Dr. Specialist";
  const primarySpecialty =
    doctor?.specialties?.find((s) => s.isPrimary)?.specialty?.name ||
    doctor?.specialties?.[0]?.specialty?.name ||
    "Specialist";

  return {
    id: b.id,
    doctorName,
    doctorSpecialty: primarySpecialty,
    doctorAvatar:
      doctor?.user?.image ||
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    patientName: b.patient?.user?.name || "You",
    patientAvatar: b.patient?.user?.image || undefined,
    dateFormatted,
    timeFormatted,
    consultationType: "Video Consultation",
    status: b.status,
    meetLink: b.meetLink || undefined,
    symptoms: b.symptoms || undefined,
    fee: Number(doctor?.fee || 0),
    isToday,
  };
}
