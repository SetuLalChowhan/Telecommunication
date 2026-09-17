"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import { Star, MessageSquare, ShieldCheck } from "lucide-react";

interface DoctorReviewsSectionProps {
  doctor: DoctorProfile;
}

export const DoctorReviewsSection: React.FC<DoctorReviewsSectionProps> = ({
  doctor,
}) => {
  const reviews = doctor.reviews || [];
  const ratingValue =
    doctor.rating !== undefined && doctor.rating !== null && Number(doctor.rating) > 0
      ? Number(doctor.rating).toFixed(1)
      : "0.0";
  const totalReviews = doctor.totalReviews ?? reviews.length;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Patient Feedback & Reviews ({totalReviews})
          </h2>
        </div>

        {totalReviews > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Verified Consultations</span>
          </div>
        )}
      </div>

      {totalReviews > 0 ? (
        <>
          {/* Review Metrics Overview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/80">
            <div className="text-center sm:text-left sm:pr-8 sm:border-r border-border/80 shrink-0">
              <div className="text-3xl sm:text-4xl font-bold text-foreground">
                {ratingValue}
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(Number(ratingValue))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-secondary-text font-medium">
                Overall Rating ({totalReviews})
              </p>
            </div>
          </div>

          {/* Review Items List */}
          <div className="space-y-4 divide-y divide-border/70 pt-1">
            {reviews.map((rev, idx) => {
              const patientName = rev.patient?.user?.name || "Verified Patient";
              const initial = patientName.charAt(0).toUpperCase();

              return (
                <div key={rev.id || idx} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                        {initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-foreground">
                            {patientName}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                            Verified
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(rev.createdAt || Date.now()).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed pl-12">
                      {rev.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="p-8 text-center rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-border text-xs text-muted-foreground">
          <Star className="h-6 w-6 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="font-semibold text-foreground">No Patient Reviews Yet</p>
          <p className="mt-1 text-secondary-text">
            This doctor is newly verified. Reviews will appear here after patients complete consultations.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorReviewsSection;
