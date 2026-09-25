/**
 * Doctor domain types.
 *
 * These mirror the exact Prisma include used by `AdminRepository` +
 * `ADMIN_DOCTOR_INCLUDE`, verified against the NestJS server rather than
 * inferred from filenames.
 */

export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DocumentType = "LICENSE" | "DEGREE_CERTIFICATE" | "NATIONAL_ID" | "OTHER";

/** `user` select inside ADMIN_DOCTOR_INCLUDE. */
export interface DoctorUserSummary {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
}

export interface DoctorSpecialtyLink {
  doctorId: string;
  specialtyId: string;
  isPrimary: boolean;
  specialty: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
}

export interface DoctorDocument {
  id: string;
  doctorId: string;
  docType: DocumentType;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: string;
}

export interface DoctorQualification {
  id: string;
  doctorId: string;
  degree: string;
  field: string | null;
  institute: string;
  passingYear: number | null;
  result: string | null;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  consultationDuration: number;
  isActive: boolean;
}

export interface DoctorDayOff {
  id: string;
  doctorId: string;
  date: string;
  reason: string | null;
}

/** A doctor row as returned by `GET /admin/doctors`. */
export interface AdminDoctor {
  id: string;
  userId: string;
  slug: string | null;
  experienceYears: number;
  /** Prisma `Decimal` serialises to a string over JSON. */
  fee: string;
  bio: string | null;
  bmdcNumber: string | null;
  designation: string | null;
  hospitalAffiliation: string | null;
  clinicAddress: string | null;
  verified: boolean;
  verifiedAt: string | null;
  verifiedById: string | null;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user: DoctorUserSummary;
  specialties: DoctorSpecialtyLink[];
  documents: DoctorDocument[];
  verifiedBy: { id: string; name: string | null; email: string } | null;
  _count: { bookings: number };
}

/** `GET /admin/doctors/:id` adds availability and days off. */
export interface AdminDoctorDetail extends AdminDoctor {
  availability: DoctorAvailability[];
  daysOff: DoctorDayOff[];
}

/**
 * `GET /admin/doctors` query params, matching `AdminDoctorQueryDto`.
 *
 * One endpoint powers search, filtering and pagination — there is deliberately
 * no separate `searchDoctors` / `filterDoctors` function.
 */
export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  verified?: boolean;
}

/** `PATCH /admin/doctors/:id` payload — all fields optional. */
export interface UpdateDoctorPayload {
  experienceYears?: number;
  fee?: number;
  bio?: string;
  bmdcNumber?: string;
  designation?: string;
  hospitalAffiliation?: string;
  clinicAddress?: string;
  slug?: string;
}

export const doctorKeys = {
  all: ["admin", "doctors"] as const,
  list: (params: DoctorQueryParams) => [...doctorKeys.all, "list", params] as const,
  detail: (id: string) => [...doctorKeys.all, "detail", id] as const,
};
