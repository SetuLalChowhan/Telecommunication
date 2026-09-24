import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { describeApiError } from "@/lib/api/error";
import { CACHE } from "@/lib/query/policy";
import { doctorKeys } from "../types";
import type { AdminDoctor, DoctorQueryParams, DocumentStatus } from "../types";
import {
  approveDoctor,
  getDoctorById,
  getDoctors,
  rejectDoctor,
  updateDocumentStatus,
} from "./doctors.api";

export const doctorsQueryOptions = (params: DoctorQueryParams) =>
  queryOptions({
    queryKey: doctorKeys.list(params),
    queryFn: () => getDoctors(params),
    staleTime: CACHE.doctors.staleTime,
  });

export const doctorDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: doctorKeys.detail(id),
    queryFn: () => getDoctorById(id),
    staleTime: CACHE.doctorDetail.staleTime,
    // A route without an :id must not hit `/admin/doctors/`.
    enabled: id.length > 0,
  });

export function useDoctors(params: DoctorQueryParams) {
  return useQuery(doctorsQueryOptions(params));
}

export function useDoctor(id: string) {
  return useQuery(doctorDetailQueryOptions(id));
}

/**
 * Verification mutations.
 *
 * Each one invalidates only the doctors slice (list + detail) so the table and
 * the open detail view refresh without a full-page reload.
 */
export function useApproveDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveDoctor(id),
    onSuccess: () => {
      toast.success("Doctor approved successfully.");
      queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}

export function useRejectDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectDoctor(id, reason),
    onSuccess: () => {
      toast.success("Doctor rejected successfully.");
      queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}

export function useUpdateDocumentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, status }: { documentId: string; status: DocumentStatus }) =>
      updateDocumentStatus(documentId, status),
    onSuccess: () => {
      toast.success("Document status updated.");
      queryClient.invalidateQueries({ queryKey: doctorKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}

export type { AdminDoctor };
