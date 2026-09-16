"use client";

import React from "react";
import Image from "next/image";
import { DoctorProfile } from "@/types/doctor";
import {
  Star,
  CheckCircle2,
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

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Doctor Photo with Simple Verified Icon on Bottom-Right */}
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 rounded-2xl overflow-hidden border border-border bg-muted/40 shadow-xs">
          <Image
            src={doctor.user.image || fallbackImage}
            alt={doctorName}
            fill
            sizes="130px"
            className="object-cover object-top"
          />
          {doctor.verified && (
            <div
              title="Verified Specialist"
              className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md border-2 border-card"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          )}
        </div>

        {/* Main Info */}
        <div className="flex-1 space-y-3 w-full">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {doctorName}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                <Video className="h-3.5 w-3.5" />
                <span>Online Video Consultations</span>
              </span>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {doctor.specialties.map((item) => (
                <span
                  key={item.specialtyId}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {item.specialty?.name}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Rating */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {doctor.rating ? Number(doctor.rating).toFixed(1) : "5.0"}
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                {doctor.totalReviews || 0} Reviews
              </p>
            </div>

            {/* Experience */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
              <div className="flex items-center gap-1 text-primary">
                <Award className="h-4 w-4" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  {doctor.experienceYears || 5}+ Yrs
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Experience
              </p>
            </div>

            {/* Consultations */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
              <div className="flex items-center gap-1 text-primary">
                <Users className="h-4 w-4" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  1,200+
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Patients Consulted
              </p>
            </div>

            {/* BMDC Authorized */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
              <div className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm sm:text-base font-bold text-foreground">
                  BMDC Reg.
                </span>
              </div>
              <p className="text-[11px] text-secondary-text mt-0.5">
                Authorized Doctor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeroCard;
