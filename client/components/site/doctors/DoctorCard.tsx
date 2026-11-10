"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DoctorProfile } from "@/features/doctors/types";
import { Star, ShieldCheck, Award, ArrowRight, Video } from "lucide-react";

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const hasRealImage = Boolean(
    doctor.user?.image &&
      doctor.user.image !== "/images/doctor-placeholder.jpg" &&
      !doctor.user.image.includes("doctor-placeholder")
  );
  const [imgError, setImgError] = React.useState(false);

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

  const ratingValue =
    doctor.rating !== undefined && doctor.rating !== null && Number(doctor.rating) > 0
      ? Number(doctor.rating).toFixed(1)
      : "0.0";
  const reviewsCount = doctor.totalReviews ?? 0;
  const experience = doctor.experienceYears ?? 0;
  const feeFormatted = Number(doctor.fee ?? 0).toLocaleString();

  const initials = doctorName
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "DR";

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      {/* Doctor image */}
      <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-muted">
        {hasRealImage && !imgError ? (
          <Image
            src={doctor.user!.image!}
            alt={doctorName}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-muted/60 via-muted to-muted/80 text-muted-foreground p-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shadow-xs mb-2">
              {initials}
            </div>
            <span className="text-[11px] font-medium text-muted-foreground/80">No photo available</span>
          </div>
        )}

        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {doctor.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-card px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-primary">
              <Video className="h-3 w-3" />
              <span>Video consult</span>
            </span>
          )}

          <div className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-foreground">{ratingValue}</span>
            <span className="text-[10px] font-medium text-muted-foreground">({reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/80 px-2.5 py-0.5 text-xs font-semibold text-foreground">
              {primarySpecialty}
            </span>

            {experience > 0 && (
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{experience}+ yrs exp</span>
              </div>
            )}
          </div>

          <h3 className="text-base font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
            <Link href={profileUrl}>{doctorName}</Link>
          </h3>

          {doctor.bio ? (
            <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed">{doctor.bio}</p>
          ) : doctor.hospitalAffiliation ? (
            <p className="text-xs text-secondary-text line-clamp-1 leading-relaxed">
              {doctor.hospitalAffiliation}
            </p>
          ) : null}
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-border/70 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
              Fee
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-semibold text-foreground">৳{feeFormatted}</span>
              <span className="text-[11px] text-muted-foreground">/ consult</span>
            </div>
          </div>

          <Link
            href={profileUrl}
            className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors group/btn"
          >
            <span>Book consult</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
