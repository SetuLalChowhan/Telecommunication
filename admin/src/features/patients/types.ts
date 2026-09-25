export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

/** `user` select inside the admin patients list query. */
export interface PatientUserSummary {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
}

/** A patient row as returned by `GET /admin/patients`. */
export interface AdminPatient {
  id: string;
  userId: string;
  address: string | null;
  gender: Gender | null;
  bloodGroup: BloodGroup | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  createdAt: string;
  updatedAt: string;
  user: PatientUserSummary;
  _count: { bookings: number; medicalReports: number };
}

export interface PatientBooking {
  id: string;
  doctorId: string;
  patientId: string;
  slotStart: string;
  slotEnd: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  meetLink: string | null;
  googleEventId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: {
    id: string;
    slug: string | null;
    user: { name: string | null; email: string };
  };
}

export interface PatientMedicalReport {
  id: string;
  patientId: string;
  bookingId: string | null;
  fileUrl: string;
  fileName: string | null;
  uploadedAt: string;
}

/** `GET /admin/patients/:id` returns the profile plus relations. */
export interface AdminPatientDetail extends Omit<AdminPatient, "_count" | "user"> {
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    emailVerified: boolean;
    image: string | null;
    dateOfBirth: string | null;
    phone: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  bookings: PatientBooking[];
  medicalReports: PatientMedicalReport[];
}

/** `PATCH /admin/patients/:id` payload — all fields optional. */
export interface UpdatePatientPayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  emailVerified?: boolean;
  address?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface PatientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const patientKeys = {
  all: ["admin", "patients"] as const,
  list: (params: PatientQueryParams) => [...patientKeys.all, "list", params] as const,
  detail: (id: string) => [...patientKeys.all, "detail", id] as const,
};
