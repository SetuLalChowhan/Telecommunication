"use client";

import React, { useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCreateReview } from "../api/queries";

interface RateDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  doctorName: string;
  doctorSpecialty?: string;
  doctorAvatar?: string;
  onSuccess?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor experience",
  2: "Fair consultation",
  3: "Good consultation",
  4: "Very Good — Highly Satisfied",
  5: "Excellent — Outstanding Care",
};

export const RateDoctorDialog: React.FC<RateDoctorDialogProps> = ({
  open,
  onOpenChange,
  bookingId,
  doctorName,
  doctorSpecialty,
  doctorAvatar,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const createReviewMutation = useCreateReview();

  const activeRating = hoverRating ?? rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    createReviewMutation.mutate(
      {
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={createReviewMutation.isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-2 shadow-xs">
            <Star className="h-6 w-6 fill-amber-400 text-amber-400 stroke-[1.8]" />
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Rate Your Consultation
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Share feedback about your completed visit with {doctorName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <DialogBody className="space-y-5 px-6 py-5 text-xs">
            {/* Doctor Info Mini Card */}
            <div className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-3.5 shadow-xs">
              <Avatar className="h-11 w-11 shrink-0 ring-2 ring-primary/20">
                <AvatarImage src={doctorAvatar || "/images/doctor-placeholder.jpg"} alt={doctorName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {doctorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-0.5">
                <p className="font-semibold text-foreground text-sm truncate">{doctorName}</p>
                {doctorSpecialty && (
                  <p className="text-[11px] text-muted-foreground truncate">{doctorSpecialty}</p>
                )}
              </div>
            </div>

          {/* Star Selection */}
          <div className="space-y-2 text-center py-2">
            <Label className="text-xs font-semibold text-foreground block">
              How was your experience? <span className="text-destructive">*</span>
            </Label>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 rounded-md transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= activeRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30 hover:text-amber-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-primary h-4">
              {RATING_LABELS[activeRating] || ""}
            </p>
          </div>

          {/* Comment Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-comment" className="text-xs font-semibold text-foreground">
                Written Feedback (Optional)
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">
                {comment.length}/500
              </span>
            </div>
            <Textarea
              id="review-comment"
              rows={3}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you appreciated about the doctor or any helpful notes..."
              className="rounded-lg text-xs resize-none"
            />
          </div>

          </DialogBody>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              disabled={createReviewMutation.isPending}
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReviewMutation.isPending || !rating}
              className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white gap-2 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Submit Rating</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

