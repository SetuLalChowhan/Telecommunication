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
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

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

/**
 * Unified Doctor Query Keys
 */
export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (params?: DoctorQueryParams) => {
    const normalized: DoctorQueryParams = {
      search: params?.search ? params.search.trim() : undefined,
      specialtySlug: params?.specialtySlug || undefined,
      minFee: params?.minFee !== undefined && !isNaN(Number(params.minFee)) ? Number(params.minFee) : undefined,
      maxFee: params?.maxFee !== undefined && !isNaN(Number(params.maxFee)) ? Number(params.maxFee) : undefined,
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
  specialties: () => [...doctorKeys.all, "specialties"] as const,
};
