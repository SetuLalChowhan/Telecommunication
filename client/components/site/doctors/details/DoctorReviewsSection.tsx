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
    <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Patient Feedback & Ratings ({totalReviews})
          </h2>
        </div>

        {totalReviews > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified Patients</span>
          </span>
        )}
      </div>

      {totalReviews > 0 ? (
        <div className="space-y-6">
          {/* Rating Summary Bar */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/30 border border-border/70">
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {ratingValue}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-amber-400">
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
                Based on {totalReviews} patient consultation{totalReviews === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {/* Patient Reviews List */}
          <div className="space-y-4 divide-y divide-border/60">
            {reviews.map((rev, idx) => {
              const patientName = rev.patient?.user?.name || "Verified Patient";
              const initial = patientName.charAt(0).toUpperCase();

              return (
                <div key={rev.id || idx} className="pt-4 first:pt-0 space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                        {initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
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
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-border/80 text-xs text-muted-foreground space-y-1">
          <Star className="h-6 w-6 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p className="font-semibold text-foreground text-sm">No Patient Reviews Yet</p>
          <p className="text-secondary-text max-w-sm mx-auto">
            Reviews and feedback will appear here once verified patients complete telemedicine sessions.
          </p>
        </div>
      )}
    </div>
  );
};

export default DoctorReviewsSection;

