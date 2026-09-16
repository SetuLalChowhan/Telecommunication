"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import { Star, MessageSquare, CheckCircle, ThumbsUp } from "lucide-react";

interface DoctorReviewsSectionProps {
  doctor: DoctorProfile;
}

export const DoctorReviewsSection: React.FC<DoctorReviewsSectionProps> = ({ doctor }) => {
  const reviews = doctor.reviews || [];
  const rating = Number(doctor.rating || 5.0).toFixed(1);
  const totalReviews = doctor.totalReviews || reviews.length || 0;

  return (
    <div className="rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span>Patient Reviews ({totalReviews})</span>
        </h2>
      </div>

      {/* Review Metrics Overview */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-border/60">
        <div className="text-center sm:text-left sm:pr-6 sm:border-r border-border/60">
          <div className="text-3xl sm:text-4xl font-black text-foreground">{rating}</div>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-[11px] text-secondary-text">Overall Patient Rating</p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 w-full space-y-1.5 text-xs">
          {[
            { stars: 5, pct: "88%" },
            { stars: 4, pct: "9%" },
            { stars: 3, pct: "2%" },
            { stars: 2, pct: "1%" },
            { stars: 1, pct: "0%" },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-2">
              <span className="w-4 font-semibold text-secondary-text">{bar.stars}★</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: bar.pct }}
                />
              </div>
              <span className="w-8 text-right text-[11px] text-muted-foreground">
                {bar.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Items List */}
      {reviews.length > 0 ? (
        <div className="space-y-4 divide-y divide-border/60 pt-2">
          {reviews.map((rev) => {
            const patientName = rev.patient?.user?.name || "Verified Patient";
            const initial = patientName.charAt(0).toUpperCase();

            return (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Patient Avatar Circle */}
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                      {initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-foreground">
                          {patientName}
                        </span>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span className="text-[10px] text-secondary-text">
                        {new Date(rev.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed pl-12">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-secondary-text">
          No reviews yet for this doctor. Be the first to consult and leave feedback!
        </div>
      )}
    </div>
  );
};

export default DoctorReviewsSection;
