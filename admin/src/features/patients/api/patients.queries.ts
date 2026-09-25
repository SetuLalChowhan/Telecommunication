import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { describeApiError } from "@/lib/api/error";
import { CACHE } from "@/lib/query/policy";
import { patientKeys } from "../types";
import type { PatientQueryParams, UpdatePatientPayload } from "../types";
import {
  deletePatient,
  getPatientById,
  getPatients,
  updatePatient,
} from "./patients.api";

export const patientsQueryOptions = (params: PatientQueryParams) =>
  queryOptions({
    queryKey: patientKeys.list(params),
    queryFn: () => getPatients(params),
    staleTime: CACHE.patients.staleTime,
  });

export const patientDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: patientKeys.detail(id),
    queryFn: () => getPatientById(id),
    staleTime: CACHE.patients.staleTime,
    enabled: id.length > 0,
  });

export function usePatients(params: PatientQueryParams) {
  return useQuery(patientsQueryOptions(params));
}

export function usePatient(id: string) {
  return useQuery(patientDetailQueryOptions(id));
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePatientPayload }) =>
      updatePatient(id, payload),
    onSuccess: () => {
      toast.success("Patient updated successfully.");
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      toast.success("Patient deleted.");
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}
