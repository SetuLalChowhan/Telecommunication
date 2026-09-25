import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminReview } from "../types";

interface ReviewsTableProps {
  reviews: AdminReview[];
  onDelete: (review: AdminReview) => void;
  isDeleting?: boolean;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={
            index < rating
              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
              : "h-3.5 w-3.5 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

export function ReviewsTable({ reviews, onDelete, isDeleting = false }: ReviewsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Doctor</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell className="text-xs font-semibold text-foreground">
              {review.booking.doctor.user.name ?? "—"}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {review.booking.patient.user.name ?? "—"}
            </TableCell>
            <TableCell>
              <RatingStars rating={review.rating} />
            </TableCell>
            <TableCell className="max-w-xs text-xs text-muted-foreground">
              <span className="line-clamp-2">{review.comment ?? "—"}</span>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                  disabled={isDeleting}
                  onClick={() => onDelete(review)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ReviewsTable;
