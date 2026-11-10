"use client";

import React from "react";
import Image from "next/image";
import { DoctorProfile } from "@/features/doctors/types";
import {
  Star,
  Video,
  ShieldCheck,
  Building2,
  MapPin,
} from "lucide-react";

interface DoctorHeroCardProps {
  doctor: DoctorProfile;
}

export const DoctorHeroCard: React.FC<DoctorHeroCardProps> = ({ doctor }) => {
  const hasRealImage = Boolean(
    doctor.user?.image &&
      doctor.user.image !== "/images/doctor-placeholder.jpg" &&
      !doctor.user.image.includes("doctor-placeholder")
  );
  const [imgError, setImgError] = React.useState(false);

  const doctorName =
    doctor.user?.name ||
    `${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim() ||
    "Dr. Specialist";

  const initials = doctorName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "DR";

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

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Doctor Photo */}
        <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-2xl overflow-hidden border border-border bg-muted flex items-center justify-center shadow-xs">
          {hasRealImage && !imgError ? (
            <Image
              src={doctor.user!.image!}
              alt={doctorName}
              fill
              sizes="(min-width: 640px) 150px, 112px"
              className="object-cover object-top"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-3 w-full h-full bg-gradient-to-br from-muted/60 via-muted to-muted/80 text-muted-foreground">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-xs mb-1.5">
                {initials}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground/80 leading-none">
                No photo available
              </span>
            </div>
          )}
        </div>

        {/* Doctor Main Details */}
        <div className="flex-1 space-y-3.5 min-w-0 w-full">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                  {doctorName}
                </h1>
                {doctor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-semibold border border-emerald-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{doctor.bmdcNumber ? `BMDC: ${doctor.bmdcNumber}` : "Verified Doctor"}</span>
                  </span>
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
                <Video className="h-3.5 w-3.5" />
                <span>Video Visit</span>
              </span>
            </div>

            {/* Designation & Specialty */}
            <p className="text-sm font-semibold text-foreground/80">
              {doctor.designation || mainSpecialty?.name || "Medical Specialist"}
            </p>

            {/* Hospital / Clinic Affiliation */}
            {doctor.hospitalAffiliation && (
              <p className="text-xs text-secondary-text flex items-center gap-1.5 pt-0.5">
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

            {/* Specialty Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
              {mainSpecialty && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted/80 border border-border text-foreground text-xs font-semibold">
                  {mainSpecialty.name}
                </span>
              )}

              {otherSpecialties.map((spec) => (
                <span
                  key={spec.id || spec.slug}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted/80 border border-border text-foreground text-xs font-medium"
                >
                  {spec.name}
                </span>
              ))}
            </div>
          </div>

          {/* Clean Human Metrics Row */}
          <div className="grid grid-cols-3 gap-2.5 pt-3.5 border-t border-border/60">
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center sm:text-left">
              <span className="text-xs text-muted-foreground block font-medium">Rating</span>
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-foreground">{ratingValue}</span>
                <span className="text-[10px] text-muted-foreground">({reviewsCount})</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center sm:text-left">
              <span className="text-xs text-muted-foreground block font-medium">Experience</span>
              <span className="text-xs sm:text-sm font-bold text-foreground block mt-0.5">
                {experienceYears > 0 ? `${experienceYears}+ Yrs` : "Certified"}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center sm:text-left">
              <span className="text-xs text-muted-foreground block font-medium">Patients</span>
              <span className="text-xs sm:text-sm font-bold text-foreground block mt-0.5">
                {patientsConsulted} Consults
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeroCard;
