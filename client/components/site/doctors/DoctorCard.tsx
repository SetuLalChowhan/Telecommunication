"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DoctorProfile } from "@/types/doctor";
import {
  Star,
  CheckCircle2,
  Award,
  ArrowRight,
  Video,
} from "lucide-react";

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

  return (
    <div className="group relative flex flex-col justify-between rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300">
      {/* Top Media & Quick Status */}
      <div className="relative aspect-[4/3.2] sm:aspect-[4/3.5] w-full overflow-hidden bg-muted/40">
        <Image
          src={doctor.user.image || fallbackImage}
          alt={doctorName}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Rating Chip */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 backdrop-blur-md px-2.5 py-1 border border-border/60 shadow-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-foreground">
            {doctor.rating ? Number(doctor.rating).toFixed(1) : "5.0"}
          </span>
          <span className="text-[10px] text-secondary-text">
            ({doctor.totalReviews || 0})
          </span>
        </div>

        {/* Verified Badge */}
        {doctor.verified && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold shadow-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verified</span>
          </div>
        )}

        {/* Live Video Consultation Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-card/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-primary border border-border/60 shadow-xs">
          <Video className="h-3 w-3 animate-pulse" />
          <span>Video Consult</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Doctor Name & Title */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              <Link href={profileUrl}>{doctorName}</Link>
            </h3>
            
            {/* Experience & Credentials */}
            <div className="flex items-center gap-2 mt-1 text-xs text-secondary-text">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>{doctor.experienceYears || 5}+ Years Experience</span>
            </div>
          </div>

          {/* Specialties Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {doctor.specialties && doctor.specialties.length > 0 ? (
              doctor.specialties.slice(0, 2).map((item) => (
                <span
                  key={item.specialtyId}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary border border-primary/20"
                >
                  {item.specialty?.name || "General"}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
                General Medicine
              </span>
            )}
            {doctor.specialties && doctor.specialties.length > 2 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-secondary-text">
                +{doctor.specialties.length - 2}
              </span>
            )}
          </div>

          {/* Short Bio */}
          {doctor.bio && (
            <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed pt-1">
              {doctor.bio}
            </p>
          )}
        </div>

        {/* Card Footer: Fee & Action Button */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-secondary-text block">Consultation Fee</span>
            <span className="text-base sm:text-lg font-bold text-foreground">
              ৳{doctor.fee || 500}
            </span>
          </div>

          <Link
            href={profileUrl}
            className="inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-2xs hover:shadow-md hover:shadow-primary/20 group/btn"
          >
            <span>Book Now</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
