"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DoctorProfile } from "@/types/doctor";
import { Star, ShieldCheck, Award, ArrowRight, Video, Stethoscope } from "lucide-react";

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const [imgSrc, setImgSrc] = React.useState<string>(
    doctor.user?.image || "/images/doctor-placeholder.jpg"
  );

  const profileUrl = `/doctors/${doctor.slug || doctor.id}`;
  const doctorName =
    doctor.user?.name ||
    `${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim() ||
    "Dr. Specialist";

  const primarySpecialty =
    doctor.mainSpecialty?.name ||
    doctor.specialties?.find((s) => s.isPrimary)?.specialty?.name ||
    doctor.specialties?.[0]?.specialty?.name ||
    "General Specialist";

  const ratingValue = doctor.rating !== undefined && doctor.rating !== null && Number(doctor.rating) > 0
    ? Number(doctor.rating).toFixed(1)
    : "0.0";
  const reviewsCount = doctor.totalReviews ?? 0;
  const experience = doctor.experienceYears ?? 0;
  const feeFormatted = Number(doctor.fee ?? 0).toLocaleString();

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-subtle transition-all duration-200">
      {/* 1. Doctor Image Header */}
      <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <Image
          src={imgSrc}
          alt={doctorName}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-103"
          onError={() => setImgSrc("/images/doctor-placeholder.jpg")}
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Verified Badge */}
          {doctor.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verified</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-card/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-primary border border-border shadow-xs">
              <Video className="h-3 w-3" />
              <span>Video Consult</span>
            </span>
          )}

          {/* Rating Badge */}
          <div className="flex items-center gap-1 rounded-full bg-card/95 backdrop-blur-md px-2.5 py-1 border border-border shadow-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">
              {ratingValue}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              ({reviewsCount})
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Specialty & Experience Metadata Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {primarySpecialty}
            </span>

            {experience > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{experience}+ yrs exp</span>
              </div>
            )}
          </div>

          {/* Doctor Name */}
          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1 pt-0.5">
            <Link href={profileUrl}>{doctorName}</Link>
          </h3>

          {/* Doctor Bio */}
          {doctor.bio ? (
            <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed">
              {doctor.bio}
            </p>
          ) : doctor.hospitalAffiliation ? (
            <p className="text-xs text-secondary-text line-clamp-1 leading-relaxed">
              {doctor.hospitalAffiliation}
            </p>
          ) : null}
        </div>

        {/* 3. Card Footer: Fee & Booking Button */}
        <div className="pt-3.5 border-t border-border/70 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
              Fee
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-foreground">
                ৳{feeFormatted}
              </span>
              <span className="text-[11px] text-muted-foreground">/ consult</span>
            </div>
          </div>

          <Link
            href={profileUrl}
            className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-xs group/btn"
          >
            <span>Book Consult</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
