import { http } from "@/lib/api/client";
import type { PaginatedResult } from "@/lib/api/types";
import type {
  AdminAppointment,
  AppointmentQueryParams,
  UpdateAppointmentPayload,
} from "../types";

/**
 * Verified NestJS admin appointment endpoints (`AdminController`, ADMIN only):
 *
 *   GET    /admin/appointments       -> list (filter by status/doctor/patient)
 *   GET    /admin/appointments/:id   -> detail
 *   PATCH  /admin/appointments/:id   -> update status / notes / meet link
 *   DELETE /admin/appointments/:id   -> remove the booking
 */

export async function getAppointments(
  params: AppointmentQueryParams = {},
): Promise<PaginatedResult<AdminAppointment>> {
  return http.getPage<AdminAppointment>("/admin/appointments", { params });
}

export async function getAppointmentById(id: string): Promise<AdminAppointment> {
  return http.get<AdminAppointment>(`/admin/appointments/${id}`);
}

export async function updateAppointment(
  id: string,
  payload: UpdateAppointmentPayload,
): Promise<AdminAppointment> {
  return http.patch<AdminAppointment>(`/admin/appointments/${id}`, payload);
}

export async function deleteAppointment(id: string): Promise<{ id: string }> {
  return http.delete<{ id: string }>(`/admin/appointments/${id}`);
}
