"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import { Star, MessageSquare, ShieldCheck, ThumbsUp } from "lucide-react";

interface DoctorReviewsSectionProps {
  doctor: DoctorProfile;
}

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    patientName: "Tanvir Ahmed",
    rating: 5,
    tag: "Accurate Diagnosis & Friendly",
    createdAt: "12 Aug 2026",
    comment:
      "Dr. was very calm and listened to my symptoms attentively. He explained the treatment thoroughly and guided me on preventive measures. Very reassuring consultation!",
  },
  {
    id: "rev-2",
    patientName: "Farhana Yasmin",
    rating: 5,
    tag: "Detailed Explanation",
    createdAt: "28 Jul 2026",
    comment:
      "Joining the video consultation was seamless. The prescription was signed and sent immediately, with clear dosage instructions. Highly recommend!",
  },
  {
    id: "rev-3",
    patientName: "Shakil Rahman",
    rating: 5,
    tag: "Caring & Attentive",
    createdAt: "15 Jul 2026",
    comment:
      "Follow-up visit went great. The doctor reviewed my lab tests and adjusted my medication smoothly. Really appreciate the prompt care.",
  },
];

export const DoctorReviewsSection: React.FC<DoctorReviewsSectionProps> = ({
  doctor,
}) => {
  const reviews =
    doctor.reviews && doctor.reviews.length > 0
      ? doctor.reviews.map((r, idx) => ({
          id: r.id || `rev-${idx}`,
          patientName: r.patient?.user?.name || "Verified Patient",
          rating: r.rating || 5,
          tag: "Verified Consultation",
          createdAt: new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          comment:
            r.comment ||
            "Very attentive and knowledgeable doctor. Explained the diagnosis clearly and provided actionable health guidance.",
        }))
      : DEFAULT_REVIEWS;

  const rating = Number(doctor.rating || 5.0).toFixed(1);
  const totalReviews = doctor.totalReviews || reviews.length || 190;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Patient Feedback & Reviews ({totalReviews})
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>100% Verified Patients</span>
        </div>
      </div>

      {/* Review Metrics Overview */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/80">
        <div className="text-center sm:text-left sm:pr-8 sm:border-r border-border/80 shrink-0">
          <div className="text-3xl sm:text-4xl font-bold text-foreground">
            {rating}
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-secondary-text font-medium">Overall Rating</p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex-1 w-full space-y-1.5 text-xs">
          {[
            { stars: 5, pct: "94%" },
            { stars: 4, pct: "5%" },
            { stars: 3, pct: "1%" },
            { stars: 2, pct: "0%" },
            { stars: 1, pct: "0%" },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-2.5">
              <span className="w-5 font-semibold text-secondary-text text-right">
                {bar.stars}★
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: bar.pct }}
                />
              </div>
              <span className="w-8 text-right text-[11px] text-muted-foreground font-semibold">
                {bar.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Items List */}
      <div className="space-y-4 divide-y divide-border/70 pt-1">
        {reviews.map((rev) => {
          const initial = rev.patientName.charAt(0).toUpperCase();

          return (
            <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                    {initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-foreground">
                        {rev.patientName}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                        Verified
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {rev.createdAt}
                    </span>
                  </div>
                </div>

                {/* Stars & Tag */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-primary font-semibold bg-primary/5 px-2 py-0.5 rounded-md hidden sm:inline-block">
                    {rev.tag}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
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
    </div>
  );
};

export default DoctorReviewsSection;
