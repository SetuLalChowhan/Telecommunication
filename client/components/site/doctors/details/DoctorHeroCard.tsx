"use client";

import React from "react";
import Image from "next/image";
import { DoctorProfile } from "@/types/doctor";
import {
  Star,
  CheckCircle2,
  Award,
  Calendar,
  Video,
  Languages,
  Clock,
  ShieldCheck,
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

  return (
    <div className="rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
        {/* Doctor Photo */}
        <div className="relative h-28 w-28 sm:h-36 sm:w-36 flex-shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-primary/20 bg-muted/40 shadow-xs">
          <Image
            src={doctor.user.image || fallbackImage}
            alt={doctorName}
            fill
            sizes="150px"
            className="object-cover object-top"
          />
          {doctor.verified && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Doctor Main Info */}
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
                {doctorName}
              </h1>
            </div>

            {/* Specialties Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {doctor.specialties.map((item) => (
                <span
                  key={item.specialtyId}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20"
                >
                  {item.specialty?.name}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Rating */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm font-bold text-foreground">
                  {doctor.rating ? Number(doctor.rating).toFixed(1) : "5.0"}
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                {doctor.totalReviews || 0} Reviews
              </p>
            </div>

            {/* Experience */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60">
              <div className="flex items-center gap-1 text-primary">
                <Award className="h-4 w-4" />
                <span className="text-sm font-bold text-foreground">
                  {doctor.experienceYears || 5}+ Yrs
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Experience
              </p>
            </div>

            {/* Consultation Type */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60">
              <div className="flex items-center gap-1 text-primary">
                <Video className="h-4 w-4" />
                <span className="text-sm font-bold text-foreground">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Video / Clinic
              </p>
            </div>

            {/* Verification */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-border/60">
              <div className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-bold text-foreground">
                  BMDC Reg.
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Authorized
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeroCard;
