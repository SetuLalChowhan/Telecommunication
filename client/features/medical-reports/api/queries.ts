"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  fetchMyMedicalReports,
  uploadMedicalReport,
  deleteMedicalReport,
} from "./client";
import {
  MedicalReportsQueryParams,
  MedicalReportsResponse,
  medicalReportKeys,
} from "../types";
import { patientKeys } from "@/features/patients/types";
import { CACHE } from "@/lib/cache/policy";

/**
 * Query hook to fetch patient's medical reports
 */
export function useMyMedicalReports(params?: MedicalReportsQueryParams) {
  return useQuery<MedicalReportsResponse>({
    queryKey: medicalReportKeys.myReports(params),
    queryFn: () => fetchMyMedicalReports(params),
    staleTime: CACHE.private.client.staleTime,
  });
}

/**
 * Mutation hook to upload a medical report
 */
export function useUploadMedicalReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadMedicalReport(formData),
    onSuccess: () => {
      toast.success("Medical report uploaded successfully");
      queryClient.invalidateQueries({ queryKey: medicalReportKeys.all });
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to upload medical report. Please try again.";
      toast.error(message);
    },
  });
}

/**
 * Mutation hook to delete a medical report
 */
export function useDeleteMedicalReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => deleteMedicalReport(reportId),
    onSuccess: () => {
      toast.success("Medical report deleted successfully");
      queryClient.invalidateQueries({ queryKey: medicalReportKeys.all });
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete report. Please try again.";
      toast.error(message);
    },
  });
}
