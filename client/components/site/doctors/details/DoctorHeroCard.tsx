"use client";

import React from "react";
import Image from "next/image";
import { DoctorProfile } from "@/types/doctor";
import {
  Star,
  Award,
  Video,
  ShieldCheck,
  Users,
} from "lucide-react";

interface DoctorHeroCardProps {
  doctor: DoctorProfile;
}

export const DoctorHeroCard: React.FC<DoctorHeroCardProps> = ({ doctor }) => {
  const doctorName =
    doctor.user.name ||
    `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
    "Dr. Specialist";

  const fallbackImage =
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80";

  const ratingValue = doctor.rating ? Number(doctor.rating).toFixed(1) : "5.0";
  const reviewsCount = doctor.totalReviews || 190;
  const experienceYears = doctor.experienceYears || 15;
  const patientsConsulted = doctor.totalPatientsConsulted
    ? `${doctor.totalPatientsConsulted.toLocaleString()}+`
    : "2,400+";

  // Distinguish main specialist from other specialties
  const mainSpecialty =
    doctor.mainSpecialty ||
    doctor.specialties.find((s) => s.isPrimary)?.specialty ||
    doctor.specialties[0]?.specialty;

  const otherSpecialties =
    doctor.otherSpecialties ||
    doctor.specialties
      .filter((s) => !s.isPrimary && s.specialty?.id !== mainSpecialty?.id)
      .map((s) => s.specialty)
      .filter(Boolean);

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        {/* Doctor Photo */}
        <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-2xl overflow-hidden border border-border/80 bg-slate-100 dark:bg-slate-900 shadow-xs">
          <Image
            src={doctor.user.image || fallbackImage}
            alt={doctorName}
            fill
            sizes="150px"
            className="object-cover object-top"
          />
        </div>

        {/* Doctor Main Details */}
        <div className="flex-1 space-y-3 w-full">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                  {doctorName}
                </h1>
                {doctor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-semibold border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{doctor.bmdcNumber ? `BMDC: ${doctor.bmdcNumber}` : "BMDC Verified"}</span>
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <Video className="h-3.5 w-3.5" />
                <span>Video Consultations</span>
              </span>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {/* Main Specialist Badge */}
              {mainSpecialty && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-primary/15 text-primary border border-primary/25 font-bold px-2.5 py-0.5 text-xs">
                  <span>★ Main:</span>
                  <span>{mainSpecialty.name}</span>
                </span>
              )}

              {/* Other Specialties */}
              {otherSpecialties.map((spec) => (
                <span
                  key={spec.id || spec.slug}
                  className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 text-foreground font-medium px-2.5 py-0.5 text-xs"
                >
                  {spec.name}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-2">
            {/* Rating */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/80">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {ratingValue}
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5 font-medium">
                {reviewsCount} Patient Reviews
              </p>
            </div>

            {/* Experience */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/80">
              <div className="flex items-center gap-1 text-primary">
                <Award className="h-4 w-4" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {experienceYears}+ Years
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5 font-medium">
                Clinical Experience
              </p>
            </div>

            {/* Patients Consulted */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/80">
              <div className="flex items-center gap-1 text-primary">
                <Users className="h-4 w-4" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {patientsConsulted}
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5 font-medium">
                Patients Consulted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeroCard;
