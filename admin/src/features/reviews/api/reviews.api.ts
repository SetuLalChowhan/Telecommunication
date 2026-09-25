import { http } from "@/lib/api/client";
import type { PaginatedResult } from "@/lib/api/types";
import type { AdminReview, ReviewQueryParams } from "../types";

/**
 * Verified NestJS admin review endpoints (`AdminController`, ADMIN only):
 *
 *   GET    /admin/reviews     -> list (filter by doctor)
 *   DELETE /admin/reviews/:id -> remove a review and recompute the rating
 */

export async function getReviews(
  params: ReviewQueryParams = {},
): Promise<PaginatedResult<AdminReview>> {
  return http.getPage<AdminReview>("/admin/reviews", { params });
}

export async function deleteReview(id: string): Promise<{ id: string }> {
  return http.delete<{ id: string }>(`/admin/reviews/${id}`);
}
