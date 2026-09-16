"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DoctorProfile } from "@/types/doctor";
import { Star, CheckCircle2, Award, ArrowRight, Video } from "lucide-react";

interface DoctorCardProps {
  doctor: DoctorProfile;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const profileUrl = `/doctors/${doctor.slug || doctor.id}`;
  const doctorName =
    doctor.user.name ||
    `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
    "Dr. Specialist";

  const fallbackImage =
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80";

  const primarySpecialty =
    doctor.specialties?.[0]?.specialty?.name || "General Physician";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200">
      {/* Doctor Image Header */}
      <div className="relative aspect-[4/3.2] w-full overflow-hidden bg-muted/40">
        <Image
          src={doctor.user.image || fallbackImage}
          alt={doctorName}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-300 group-hover:scale-102"
        />

        {/* Rating Floating Chip */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-card/95 backdrop-blur-xs px-2.5 py-1 border border-border shadow-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-foreground">
            {doctor.rating ? Number(doctor.rating).toFixed(1) : "5.0"}
          </span>
          <span className="text-[10px] text-secondary-text">
            ({doctor.totalReviews || 0})
          </span>
        </div>

        {/* Verified Icon Badge */}
        {doctor.verified && (
          <div
            title="Verified Specialist"
            className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        )}

        {/* Online Video Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-card/95 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-primary border border-border shadow-xs">
          <Video className="h-3.5 w-3.5" />
          <span>Online Video Consult</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Specialty tag */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {primarySpecialty}
            </span>
            {doctor.specialties && doctor.specialties.length > 1 && (
              <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-secondary-text">
                +{doctor.specialties.length - 1}
              </span>
            )}
          </div>

          {/* Doctor Name */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              <Link href={profileUrl}>{doctorName}</Link>
            </h3>

            {/* Experience */}
            <div className="flex items-center gap-1.5 mt-1 text-xs text-secondary-text">
              <Award className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{doctor.experienceYears || 5}+ Years Experience</span>
            </div>
          </div>

          {/* Short Bio snippet */}
          {doctor.bio && (
            <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed">
              {doctor.bio}
            </p>
          )}
        </div>

        {/* Card Footer: Fee & Action Button */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-secondary-text block font-medium">
              Fee
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base sm:text-lg font-bold text-foreground">
                ৳{doctor.fee || 500}
              </span>
              <span className="text-[11px] text-secondary-text">/consult</span>
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
