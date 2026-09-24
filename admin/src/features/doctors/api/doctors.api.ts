import { http } from "@/lib/api/client";
import type { PaginatedResult } from "@/lib/api/types";
import type { AdminDoctor, AdminDoctorDetail, DoctorDocument, DoctorQueryParams, DocumentStatus } from "../types";

/**
 * Every function here maps to a verified NestJS admin endpoint
 * (`AdminController`, base path `/admin`, all guarded by RolesGuard ADMIN).
 *
 *   GET    /admin/doctors                    -> list (search / filter / paginate)
 *   GET    /admin/doctors/pending            -> pending verification queue
 *   GET    /admin/doctors/:id                -> detail
 *   PATCH  /admin/doctors/:id/approve        -> approve
 *   PATCH  /admin/doctors/:id/reject         -> reject
 *   PATCH  /admin/documents/:id/status       -> per-document status
 */

export async function getDoctors(params: DoctorQueryParams = {}): Promise<PaginatedResult<AdminDoctor>> {
  return http.getPage<AdminDoctor>("/admin/doctors", { params });
}

export async function getPendingDoctors(
  params: DoctorQueryParams = {},
): Promise<PaginatedResult<AdminDoctor>> {
  return http.getPage<AdminDoctor>("/admin/doctors/pending", { params });
}

export async function getDoctorById(id: string): Promise<AdminDoctorDetail> {
  return http.get<AdminDoctorDetail>(`/admin/doctors/${id}`);
}

export async function approveDoctor(id: string): Promise<AdminDoctor> {
  return http.patch<AdminDoctor>(`/admin/doctors/${id}/approve`);
}

export async function rejectDoctor(id: string, reason?: string): Promise<AdminDoctor> {
  return http.patch<AdminDoctor>(`/admin/doctors/${id}/reject`, { reason });
}

export async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus,
): Promise<DoctorDocument> {
  return http.patch<DoctorDocument>(`/admin/documents/${documentId}/status`, { status });
}
