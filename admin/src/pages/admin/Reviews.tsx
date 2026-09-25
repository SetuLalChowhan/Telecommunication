import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/common/States";
import { useDeleteReview, useReviews } from "@/features/reviews/api/reviews.queries";
import { ReviewsTable } from "@/features/reviews/components/ReviewsTable";
import type { AdminReview, ReviewQueryParams } from "@/features/reviews/types";

const PAGE_LIMIT = 10;

const Reviews = () => {
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<AdminReview | null>(null);

  const removeReview = useDeleteReview();

  const params: ReviewQueryParams = { page, limit: PAGE_LIMIT };
  const { data, isPending, isError, error, refetch, isFetching } = useReviews(params);
  const reviews = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Reviews</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Moderate patient feedback. Deleting a review recalculates the doctor's rating.
        </p>
      </div>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold">All reviews</CardTitle>
          <CardDescription className="text-xs">
            {data ? `${data.meta.total} review(s) submitted.` : "Loading reviews…"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {isError ? (
            <ErrorState error={error} onRetry={() => refetch()} title="Unable to load reviews" />
          ) : isPending ? (
            <TableSkeleton rows={5} columns={6} />
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Patient reviews will appear here once submitted."
            />
          ) : (
            <>
              <ReviewsTable
                reviews={reviews}
                onDelete={setDeleting}
                isDeleting={removeReview.isPending}
              />
              {data && <Pagination meta={data.meta} onPageChange={setPage} isFetching={isFetching} />}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete this review?"
        description="The review will be permanently removed and the doctor's rating recalculated."
        confirmLabel="Delete"
        destructive
        isPending={removeReview.isPending}
        onConfirm={() => {
          if (!deleting) return;
          removeReview.mutate(deleting.id, { onSettled: () => setDeleting(null) });
        }}
      />
    </div>
  );
};

export default Reviews;
