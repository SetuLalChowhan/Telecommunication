import { http } from "@/lib/api/client";

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export function createReview(data: CreateReviewInput): Promise<ReviewResponse> {
  return http.post<ReviewResponse>("/reviews", data);
}

export function fetchDoctorReviews(
  doctorId: string,
  params?: { page?: number; limit?: number }
) {
  return http.getPage<ReviewResponse>(`/reviews/doctor/${doctorId}`, { params });
}
