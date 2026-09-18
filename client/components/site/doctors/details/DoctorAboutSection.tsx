"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import {
  GraduationCap,
  Stethoscope,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface DoctorAboutSectionProps {
  doctor: DoctorProfile;
}

export const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({
  doctor,
}) => {
  const doctorName =
    doctor.user?.name ||
    `${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim() ||
    "Dr. Specialist";

  const hasAffiliation = Boolean(
    doctor.designation || doctor.hospitalAffiliation || doctor.clinicAddress
  );

  const qualifications = doctor.qualifications || [];
  const specialties = doctor.specialties || [];

  return (
    <div className="space-y-6">
      {/* 1. About & Biography Card */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span>Biography</span>
        </h2>
        
        <p className="text-sm text-secondary-text leading-relaxed whitespace-pre-line">
          {doctor.bio ||
            `${doctorName} is an experienced medical specialist offering verified telemedicine consultations. Dedicated to providing patient-centered care and evidence-based clinical treatments.`}
        </p>

        {/* Specializations & Clinical Focus */}
        {specialties.length > 0 && (
          <div className="pt-3 border-t border-border/60 space-y-2.5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Specialized Care & Treatments
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s) => (
                <span
                  key={s.specialtyId || s.specialty?.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-foreground px-3 py-1.5 text-xs font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{s.specialty?.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Education, Credentials & Hospital Affiliation */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Education & Qualifications
            </h3>
          </div>
          {doctor.verified && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{doctor.bmdcNumber ? `BMDC: ${doctor.bmdcNumber}` : "Verified Doctor"}</span>
            </span>
          )}
        </div>

        {/* Qualifications List */}
        {qualifications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {qualifications.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-xl border border-border/70 bg-slate-50/60 dark:bg-slate-900/30 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                    {q.degree}
                  </span>
                  {q.passingYear && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {q.passingYear}
                    </span>
                  )}
                </div>
                {q.field && (
                  <h4 className="text-sm font-semibold text-foreground">
                    {q.field}
                  </h4>
                )}
                <p className="text-xs text-secondary-text">
                  {q.institute}
                  {q.result ? ` · ${q.result}` : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Medical qualifications are verified by our clinical verification board.
          </p>
        )}

        {/* Current Hospital / Workplace */}
        {hasAffiliation && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-border/70">
            <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-foreground block text-sm">
                {doctor.hospitalAffiliation || doctor.designation || "Primary Practice"}
              </span>
              {doctor.designation && doctor.hospitalAffiliation && (
                <span className="text-muted-foreground font-medium block">
                  {doctor.designation}
                </span>
              )}
              {doctor.clinicAddress && (
                <span className="text-secondary-text block pt-0.5">
                  {doctor.clinicAddress}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAboutSection;

