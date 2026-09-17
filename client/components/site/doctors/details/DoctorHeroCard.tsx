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
  Stethoscope,
  Building2,
  MapPin,
} from "lucide-react";

interface DoctorHeroCardProps {
  doctor: DoctorProfile;
}

export const DoctorHeroCard: React.FC<DoctorHeroCardProps> = ({ doctor }) => {
  const doctorName =
    doctor.user?.name ||
    `${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim() ||
    "Dr. Specialist";

  const ratingValue =
    doctor.rating !== undefined && doctor.rating !== null && Number(doctor.rating) > 0
      ? Number(doctor.rating).toFixed(1)
      : "0.0";
  const reviewsCount = doctor.totalReviews ?? 0;
  const experienceYears = doctor.experienceYears ?? 0;
  const patientsConsulted = doctor.totalPatientsConsulted !== undefined && doctor.totalPatientsConsulted !== null
    ? doctor.totalPatientsConsulted.toLocaleString()
    : "0";

  // Distinguish main specialist from other specialties
  const mainSpecialty =
    doctor.mainSpecialty ||
    doctor.specialties?.find((s) => s.isPrimary)?.specialty ||
    doctor.specialties?.[0]?.specialty;

  const otherSpecialties =
    doctor.otherSpecialties ||
    doctor.specialties
      ?.filter((s) => !s.isPrimary && s.specialty?.id !== mainSpecialty?.id)
      ?.map((s) => s.specialty)
      ?.filter(Boolean) || [];

  const initials = doctorName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "DR";

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        {/* Doctor Photo or Dummy Avatar */}
        <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-2xl overflow-hidden border border-border/80 bg-slate-100 dark:bg-slate-900 shadow-xs flex items-center justify-center">
          {doctor.user?.image ? (
            <Image
              src={doctor.user.image}
              alt={doctorName}
              fill
              sizes="150px"
              className="object-cover object-top"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-slate-100 to-slate-200 dark:from-primary/20 dark:via-slate-800 dark:to-slate-900 text-primary p-2 text-center select-none">
              <div className="h-12 w-12 rounded-xl bg-card border border-primary/25 shadow-xs flex items-center justify-center text-primary mb-1">
                <Stethoscope className="h-6 w-6 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold text-foreground tracking-tight">
                {initials}
              </span>
            </div>
          )}
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

            {/* Designation & Hospital Affiliation */}
            {doctor.designation && (
              <p className="text-sm font-semibold text-primary">
                {doctor.designation}
              </p>
            )}

            {doctor.hospitalAffiliation && (
              <p className="text-xs text-secondary-text flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{doctor.hospitalAffiliation}</span>
              </p>
            )}

            {doctor.clinicAddress && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{doctor.clinicAddress}</span>
              </p>
            )}

            {/* Specialties */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
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

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/70">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/60">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="h-4 w-4 fill-amber-500" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-foreground block">
                  {ratingValue}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {reviewsCount} reviews
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/60">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-foreground block">
                  {experienceYears > 0 ? `${experienceYears}+ Yrs` : "N/A"}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Experience
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-border/60">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-foreground block">
                  {patientsConsulted}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Patients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeroCard;
