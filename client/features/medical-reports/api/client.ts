import { http, API_BASE_URL } from "@/lib/api/client";
import {
  MedicalReport,
  MedicalReportsQueryParams,
  MedicalReportsResponse,
} from "../types";

/**
 * Direct streaming / download URL for a medical report.
 *
 * The endpoint is authorized server-side (owner patient, treating doctor or
 * admin), so this is only a URL builder — never an access-control decision.
 */
export function getReportFileUrl(
  reportId: string,
  action: "view" | "download" = "view"
): string {
  return `${API_BASE_URL}/medical-reports/${reportId}/file?action=${action}`;
}

/** Fetch the authenticated patient's medical reports with pagination. */
export async function fetchMyMedicalReports(
  params?: MedicalReportsQueryParams
): Promise<MedicalReportsResponse> {
  return http.getPage<MedicalReport>("/medical-reports/my-reports", { params });
}

/** Upload a medical report (multipart/form-data with file, fileName, bookingId). */
export async function uploadMedicalReport(
  formData: FormData
): Promise<MedicalReport> {
  return http.post<MedicalReport>("/medical-reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/** Delete a medical report by id. */
export async function deleteMedicalReport(
  reportId: string
): Promise<MedicalReport> {
  return http.delete<MedicalReport>(`/medical-reports/${reportId}`);
}
