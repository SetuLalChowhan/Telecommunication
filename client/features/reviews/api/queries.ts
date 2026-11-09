"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createReview, fetchDoctorReviews, CreateReviewInput } from "./client";

function getErrorMessage(error: any, fallback: string): string {
  if (typeof error === "string") return error;
  return (
    error?.details?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export const reviewKeys = {
  all: ["reviews"] as const,
  doctor: (doctorId: string) => [...reviewKeys.all, "doctor", doctorId] as const,
};

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => createReview(data),
    onSuccess: () => {
      toast.success("Thank you! Your rating and feedback have been submitted.");
      queryClient.invalidateQueries({ queryKey: ["patients", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to submit rating"));
    },
  });
}

export function useDoctorReviews(doctorId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...reviewKeys.doctor(doctorId), params],
    queryFn: () => fetchDoctorReviews(doctorId, params),
    enabled: Boolean(doctorId),
  });
}
