import { http } from "@/lib/api/client";
import type { PaginatedResult } from "@/lib/api/types";
import type {
  AdminPatient,
  AdminPatientDetail,
  PatientQueryParams,
  UpdatePatientPayload,
} from "../types";

/**
 * Verified NestJS admin patient endpoints (`AdminController`, guarded by ADMIN):
 *
 *   GET    /admin/patients          -> list (search / paginate)
 *   GET    /admin/patients/:id      -> detail with bookings + reports
 *   PATCH  /admin/patients/:id      -> edit profile / account fields
 *   DELETE /admin/patients/:id      -> remove the account
 */

export async function getPatients(
  params: PatientQueryParams = {},
): Promise<PaginatedResult<AdminPatient>> {
  return http.getPage<AdminPatient>("/admin/patients", { params });
}

export async function getPatientById(id: string): Promise<AdminPatientDetail> {
  return http.get<AdminPatientDetail>(`/admin/patients/${id}`);
}

export async function updatePatient(
  id: string,
  payload: UpdatePatientPayload,
): Promise<AdminPatientDetail> {
  return http.patch<AdminPatientDetail>(`/admin/patients/${id}`, payload);
}

export async function deletePatient(id: string): Promise<{ id: string }> {
  return http.delete<{ id: string }>(`/admin/patients/${id}`);
}
