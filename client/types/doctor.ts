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
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "05:00 PM"
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

export interface DoctorQueryFilters {
  search?: string;
  specialty?: string;
  minFee?: number;
  maxFee?: number;
  experience?: number;
  sortBy?: "rating" | "fee" | "experience";
  page?: number;
  limit?: number;
}
