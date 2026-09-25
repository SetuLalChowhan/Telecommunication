/** A review row as returned by `GET /admin/reviews`. */
export interface AdminReview {
  id: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  booking: {
    slotStart: string;
    doctor: { user: { name: string | null } };
    patient: { user: { name: string | null } };
  };
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  doctorId?: string;
}

export const reviewKeys = {
  all: ["admin", "reviews"] as const,
  list: (params: ReviewQueryParams) => [...reviewKeys.all, "list", params] as const,
};
