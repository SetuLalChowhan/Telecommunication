"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import {
  GraduationCap,
  Stethoscope,
  CheckCircle2,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

interface DoctorAboutSectionProps {
  doctor: DoctorProfile;
}

export const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({ doctor }) => {
  return (
    <div className="space-y-6">
      {/* 1. About the Doctor Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span>About the Doctor</span>
        </h2>
        <p className="text-sm text-secondary-text leading-relaxed">
          {doctor.bio ||
            "Dedicated healthcare specialist delivering evidence-based virtual medical consultations, diagnostic review, and continuous patient care management."}
        </p>

        {/* Telehealth Key Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Digital E-Prescription with Verified Signature</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Encrypted High-Definition Video Consultation</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Direct Follow-up Messages on Patient Portal</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <span>Diagnostic Report & Lab Test Guidance</span>
          </div>
        </div>
      </div>

      {/* 2. Polished Education & Medical Credentials Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Education & Clinical Credentials
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            Verified Degrees
          </span>
        </div>

        {/* Polished Degrees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Degree 1 */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/30 space-y-2 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                MBBS
              </span>
              <span className="text-[11px] font-medium text-secondary-text">Graduated 2012</span>
            </div>
            <h4 className="text-sm font-bold text-foreground">
              Bachelor of Medicine, Bachelor of Surgery
            </h4>
            <p className="text-xs text-secondary-text">
              Dhaka Medical College & Hospital (DMCH) &bull; First Class Honors
            </p>
          </div>

          {/* Degree 2 */}
          <div className="p-4 rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/30 space-y-2 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                FCPS / MD
              </span>
              <span className="text-[11px] font-medium text-secondary-text">Fellowship 2018</span>
            </div>
            <h4 className="text-sm font-bold text-foreground">
              Fellow of College of Physicians & Surgeons
            </h4>
            <p className="text-xs text-secondary-text">
              Bangladesh College of Physicians and Surgeons (BCPS)
            </p>
          </div>
        </div>

        {/* Medical License & Verification Bar */}
        <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">BMDC Authorized Medical License</p>
              <p className="text-[11px] text-secondary-text">
                Reg No: <span className="font-semibold text-foreground">A-89412</span> &bull; Active & Authorized for Virtual Practice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-primary self-start sm:self-auto">
            <Award className="h-4 w-4" />
            <span>{doctor.experienceYears || 5}+ Years Clinical Practice</span>
          </div>
        </div>

        {/* Practice Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Languages Spoken</p>
              <p className="text-sm font-semibold text-foreground">
                English, Bengali
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-medium">Consultation Duration</p>
              <p className="text-sm font-semibold text-foreground">
                20 &ndash; 30 Minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAboutSection;
