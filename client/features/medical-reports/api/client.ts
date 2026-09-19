import { apiClient } from "@/lib/api/axios";
import {
  MedicalReport,
  MedicalReportsQueryParams,
  MedicalReportsResponse,
} from "../types";

/**
 * Fetch patient's medical reports with pagination
 */
export async function fetchMyMedicalReports(
  params?: MedicalReportsQueryParams
): Promise<MedicalReportsResponse> {
  const response = await apiClient.get<MedicalReportsResponse>(
    "/medical-reports/my-reports",
    { params }
  );
  return response.data;
}

/**
 * Upload a medical report (multipart/form-data with file, fileName, bookingId)
 */
export async function uploadMedicalReport(
  formData: FormData
): Promise<MedicalReport> {
  const response = await apiClient.post<{ data: MedicalReport }>(
    "/medical-reports",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
}

/**
 * Delete a medical report by ID
 */
export async function deleteMedicalReport(
  reportId: string
): Promise<{ success: boolean; message?: string }> {
  const response = await apiClient.delete<{ success: boolean; message?: string }>(
    `/medical-reports/${reportId}`
  );
  return response.data;
}
