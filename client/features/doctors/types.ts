/**
 * Doctor Domain & API Types
 */

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface DoctorSpecialty {
  doctorId: string;
  specialtyId: string;
  isPrimary?: boolean;
  specialty: Specialty;
}

export interface DoctorQualification {
  id?: string;
  degree: string;
  field?: string;
  institute: string;
  passingYear?: number;
  result?: string;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number | string; // e.g. "MONDAY" or 1
  startTime: string; // e.g. "09:00" or "09:00 AM"
  endTime: string;   // e.g. "12:00" or "05:00 PM"
  consultationDuration: number; // in minutes (e.g. 30)
  isActive: boolean;
}

export interface DoctorReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  patient: {
    id: string;
    user: {
      name?: string | null;
      image?: string | null;
    };
  };
}

export interface DoctorUser {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  image?: string | null;
  phone?: string | null;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  slug?: string;
  bio?: string;
  experienceYears?: number;
  fee: number;
  verified: boolean;
  rating?: number;
  totalReviews?: number;
  totalPatientsConsulted?: number;
  bmdcNumber?: string;
  designation?: string;
  hospitalAffiliation?: string;
  clinicAddress?: string;
  mainSpecialty?: Specialty;
  otherSpecialties?: Specialty[];
  user: DoctorUser;
  specialties: DoctorSpecialty[];
  qualifications?: DoctorQualification[];
  availabilities?: DoctorAvailability[];
  reviews?: DoctorReview[];
  documents?: any[];
}

/** Re-use the canonical pagination contract instead of redeclaring it. */
import type { PaginationMeta } from "@/lib/api/types";
export type { PaginationMeta };

export interface DoctorQueryParams {
  search?: string;
  specialtySlug?: string;
  minFee?: number;
  maxFee?: number;
  minExperience?: number;
  experience?: string | number;
  sortBy?: "latest" | "rating" | "fee" | "experience";
  page?: number;
  limit?: number;
}

export interface UpdateDoctorProfileInput {
  name?: string;
  phone?: string;
  image?: string | File;
  bio?: string;
  experienceYears?: number;
  fee?: number;
  slug?: string;
  bmdcNumber?: string;
  designation?: string;
  hospitalAffiliation?: string;
  clinicAddress?: string;
  mainSpecialtyId?: string;
  otherSpecialtyIds?: string[];
  specialtyIds?: string[];
  qualifications?: DoctorQualification[];
}

export interface DoctorsListResponse {
  data: DoctorProfile[];
  meta?: PaginationMeta;
}

export interface DoctorDashboardStats {
  totalConsultations: number;
  todayConsultationsCount: number;
  pendingConfirmationCount: number;
  completedConsultationsCount: number;
  cancelledCount: number;
  confirmedCount: number;
  totalPatientsCount: number;
  activeAvailabilityDaysCount: number;
}

export interface DoctorDashboardBooking {
  id: string;
  doctorId: string;
  patientId: string;
  slotStart: string;
  slotEnd: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  meetLink?: string | null;
  notes?: string | null;
  createdAt: string;
  patient: {
    id: string;
    userId: string;
    gender?: string | null;
    user: {
      id: string;
      name?: string | null;
      email: string;
      phone?: string | null;
      image?: string | null;
      dateOfBirth?: string | null;
      gender?: string | null;
    };
  };
}

export interface DoctorDashboardData {
  stats: DoctorDashboardStats;
  nextAppointment: DoctorDashboardBooking | null;
  todaySchedule: DoctorDashboardBooking[];
  activeDaysCount: number;
  verified: boolean;
}

export interface DoctorDayOff {
  id: string;
  doctorId: string;
  date: string;
  reason?: string | null;
  createdAt: string;
}

export interface CreateAvailabilityInput {
  dayOfWeek: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime: string;
  endTime: string;
  consultationDuration?: number;
  isActive?: boolean;
}

export interface UpdateAvailabilityInput {
  dayOfWeek?: "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime?: string;
  endTime?: string;
  consultationDuration?: number;
  isActive?: boolean;
}

export interface CreateDayOffInput {
  date: string;
  reason?: string;
}

export interface DoctorBookingsQueryParams {
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  page?: number;
  limit?: number;
}

export interface DoctorBookingsResponse {
  data: DoctorDashboardBooking[];
  meta?: PaginationMeta;
}

export interface DoctorPatientRegistryItem {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  gender?: string | null;
  bloodGroup?: string | null;
  image?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  lastConsultation: string;
  lastCondition: string;
  consultationCount: number;
  reportsCount: number;
}

export interface GoogleConnectionStatus {
  isConnected: boolean;
  connectedAt?: string | null;
}

/**
 * Compact doctor shape used by search autocomplete in the hero / header.
 * Keeps the suggestions payload tiny compared to a full `DoctorProfile`.
 */
export interface DoctorSuggestion {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  specialty: string;
  fee: number;
  experienceYears: number | null;
  verified: boolean;
}

/** Maps a full API doctor profile onto the autocomplete view model. */
export function toDoctorSuggestion(doctor: DoctorProfile): DoctorSuggestion {
  const name =
    doctor.user?.name ||
    [doctor.user?.firstName, doctor.user?.lastName].filter(Boolean).join(" ") ||
    "Doctor";

  const specialty =
    doctor.mainSpecialty?.name ||
    doctor.specialties?.[0]?.specialty?.name ||
    "General physician";

  return {
    id: doctor.id,
    slug: doctor.slug || doctor.id,
    name,
    image: doctor.user?.image ?? null,
    specialty,
    fee: Number(doctor.fee ?? 0),
    experienceYears: doctor.experienceYears ?? null,
    verified: Boolean(doctor.verified),
  };
}

/**
 * Unified Doctor Query Keys
 */
export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (params?: DoctorQueryParams) => {
    // Every filter that affects the request MUST be part of the key, otherwise
    // React Query cannot tell requests apart (and hydration keys drift from the
    // server prefetch).
    const normalized = {
      search: params?.search ? params.search.trim() : undefined,
      specialtySlug: params?.specialtySlug || undefined,
      minFee:
        params?.minFee !== undefined && !isNaN(Number(params.minFee))
          ? Number(params.minFee)
          : undefined,
      maxFee:
        params?.maxFee !== undefined && !isNaN(Number(params.maxFee))
          ? Number(params.maxFee)
          : undefined,
      minExperience:
        params?.minExperience !== undefined && !isNaN(Number(params.minExperience))
          ? Number(params.minExperience)
          : params?.experience !== undefined && params.experience !== ""
            ? Number(params.experience)
            : undefined,
      sortBy: params?.sortBy || "rating",
      page: params?.page ? Number(params.page) : 1,
      limit: params?.limit ? Number(params.limit) : 6,
    };
    return [...doctorKeys.lists(), normalized] as const;
  },
  details: () => [...doctorKeys.all, "detail"] as const,
  detail: (idOrSlug: string) => [...doctorKeys.details(), idOrSlug] as const,
  availabilities: () => [...doctorKeys.all, "availability"] as const,
  availability: (idOrSlug: string) =>
    [...doctorKeys.availabilities(), idOrSlug] as const,
  me: () => [...doctorKeys.all, "me"] as const,
  dashboard: () => [...doctorKeys.all, "dashboard"] as const,
  mySchedule: () => [...doctorKeys.all, "mySchedule"] as const,
  myDaysOff: () => [...doctorKeys.all, "myDaysOff"] as const,
  myBookings: (params?: DoctorBookingsQueryParams) =>
    [
      ...doctorKeys.all,
      "myBookings",
      params?.status || "ALL",
      params?.page || 1,
      params?.limit || 10,
    ] as const,
  myPatients: (search?: string) =>
    [...doctorKeys.all, "myPatients", search ? search.trim().toLowerCase() : ""] as const,
  suggestions: (term: string) =>
    [...doctorKeys.all, "suggestions", term.trim().toLowerCase()] as const,
  googleStatus: () => [...doctorKeys.all, "googleStatus"] as const,
  specialties: () => [...doctorKeys.all, "specialties"] as const,
};
