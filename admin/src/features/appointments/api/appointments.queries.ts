import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { describeApiError } from "@/lib/api/error";
import { CACHE } from "@/lib/query/policy";
import { appointmentKeys } from "../types";
import type { AppointmentQueryParams, UpdateAppointmentPayload } from "../types";
import {
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment,
} from "./appointments.api";

export const appointmentsQueryOptions = (params: AppointmentQueryParams) =>
  queryOptions({
    queryKey: appointmentKeys.list(params),
    queryFn: () => getAppointments(params),
    staleTime: CACHE.appointments.staleTime,
  });

export const appointmentDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => getAppointmentById(id),
    staleTime: CACHE.appointments.staleTime,
    enabled: id.length > 0,
  });

export function useAppointments(params: AppointmentQueryParams) {
  return useQuery(appointmentsQueryOptions(params));
}

export function useAppointment(id: string) {
  return useQuery(appointmentDetailQueryOptions(id));
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAppointmentPayload }) =>
      updateAppointment(id, payload),
    onSuccess: () => {
      toast.success("Appointment updated successfully.");
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAppointment(id),
    onSuccess: () => {
      toast.success("Appointment deleted.");
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}
