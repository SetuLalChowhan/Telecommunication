"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import { Star, MessageSquare, CheckCircle, ShieldCheck } from "lucide-react";

interface DoctorReviewsSectionProps {
  doctor: DoctorProfile;
}

export const DoctorReviewsSection: React.FC<DoctorReviewsSectionProps> = ({ doctor }) => {
  const reviews = doctor.reviews || [];
  const rating = Number(doctor.rating || 5.0).toFixed(1);
  const totalReviews = doctor.totalReviews || reviews.length || 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Patient Reviews ({totalReviews})
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Verified Consultations</span>
        </div>
      </div>

      {/* Review Metrics Overview */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
        <div className="text-center sm:text-left sm:pr-8 sm:border-r border-border shrink-0">
          <div className="text-3xl sm:text-4xl font-bold text-foreground">{rating}</div>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-secondary-text">Average Rating</p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex-1 w-full space-y-1.5 text-xs">
          {[
            { stars: 5, pct: "90%" },
            { stars: 4, pct: "8%" },
            { stars: 3, pct: "2%" },
            { stars: 2, pct: "0%" },
            { stars: 1, pct: "0%" },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-2.5">
              <span className="w-5 font-medium text-secondary-text text-right">{bar.stars}★</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: bar.pct }}
                />
              </div>
              <span className="w-8 text-right text-[11px] text-secondary-text font-medium">
                {bar.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Items List */}
      {reviews.length > 0 ? (
        <div className="space-y-4 divide-y divide-border pt-2">
          {reviews.map((rev) => {
            const patientName = rev.patient?.user?.name || "Verified Patient";
            const initial = patientName.charAt(0).toUpperCase();

            return (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Patient Initial Circle */}
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                      {initial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground">
                          {patientName}
                        </span>
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <span className="text-[11px] text-secondary-text">
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
                <p className="text-sm text-secondary-text leading-relaxed pl-12">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-secondary-text">
          No reviews yet. Be the first to consult and share your feedback!
        </div>
      )}
    </div>
  );
};

export default DoctorReviewsSection;
