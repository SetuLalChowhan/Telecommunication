export interface MedicalReportBookingDoctor {
  id: string;
  slug?: string;
  designation?: string | null;
  hospitalAffiliation?: string | null;
  user?: {
    name: string;
    email: string;
    image?: string | null;
  };
  specialties?: Array<{
    specialty: {
      name: string;
    };
  }>;
}

export interface MedicalReportBooking {
  id: string;
  slotStart: string;
  status: string;
  doctor?: MedicalReportBookingDoctor;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  bookingId: string | null;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  booking?: MedicalReportBooking | null;
}

export interface MedicalReportsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface MedicalReportsResponse {
  data: MedicalReport[];
  meta: MedicalReportsMeta;
}

export interface MedicalReportsQueryParams {
  page?: number;
  limit?: number;
}

export const medicalReportKeys = {
  all: ["medical-reports"] as const,
  myReports: (params?: MedicalReportsQueryParams) =>
    [
      ...medicalReportKeys.all,
      "my-reports",
      params?.page || 1,
      params?.limit || 10,
    ] as const,
  byBooking: (bookingId: string) =>
    [...medicalReportKeys.all, "booking", bookingId] as const,
};
