import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { describeApiError } from "@/lib/api/error";
import { CACHE } from "@/lib/query/policy";
import { reviewKeys } from "../types";
import type { ReviewQueryParams } from "../types";
import { deleteReview, getReviews } from "./reviews.api";

export const reviewsQueryOptions = (params: ReviewQueryParams) =>
  queryOptions({
    queryKey: reviewKeys.list(params),
    queryFn: () => getReviews(params),
    staleTime: CACHE.users.staleTime,
  });

export function useReviews(params: ReviewQueryParams) {
  return useQuery(reviewsQueryOptions(params));
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      toast.success("Review deleted.");
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}
