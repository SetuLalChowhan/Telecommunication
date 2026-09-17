"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import {
  GraduationCap,
  Stethoscope,
  CheckCircle2,
  Building2,
  Video,
  ShieldCheck,
  Award,
  Globe,
  Clock,
} from "lucide-react";

interface DoctorAboutSectionProps {
  doctor: DoctorProfile;
}

export const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({
  doctor,
}) => {
  const doctorName =
    doctor.user.name ||
    `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
    "Dr. Specialist";

  return (
    <div className="space-y-6">
      {/* 1. About Narrative Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span>About {doctorName}</span>
        </h2>
        <p className="text-sm text-secondary-text leading-relaxed">
          {doctor.bio ||
            "Dedicated clinical specialist with extensive expertise in preventive medicine, disease management, and tele-health patient care. Known for compassionate patient communication, thorough differential diagnosis, and personalized treatment plans tailored to each individual."}
        </p>

        {/* Clinical Focus Areas / Specializations */}
        <div className="pt-2 space-y-2.5">
          <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            Key Clinical Specializations & Conditions Treated
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "General Health Consultation",
              "Chronic Illness Management",
              "Diagnostic Lab Review",
              "Preventive Healthcare",
              "Prescription Refill & Follow-up",
              "Lifestyle & Dietary Advice",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-border/70 text-foreground px-3 py-1 text-xs font-medium"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Verified Education & Hospital Credentials */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Education & Medical Credentials
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified Credentials</span>
          </span>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/80 bg-slate-50/70 dark:bg-slate-900/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                MBBS
              </span>
              <span className="text-xs text-muted-foreground font-medium">Graduated 2010</span>
            </div>
            <h4 className="text-sm font-bold text-foreground">
              Bachelor of Medicine & Bachelor of Surgery
            </h4>
            <p className="text-xs text-secondary-text">
              Dhaka Medical College & Hospital (DMCH) · First Class Honors
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-slate-50/70 dark:bg-slate-900/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                FCPS / MD
              </span>
              <span className="text-xs text-muted-foreground font-medium">Fellowship 2016</span>
            </div>
            <h4 className="text-sm font-bold text-foreground">
              Fellow of College of Physicians & Surgeons
            </h4>
            <p className="text-xs text-secondary-text">
              BCPS Bangladesh · Advanced Clinical Fellowship
            </p>
          </div>
        </div>

        {/* Hospital Affiliation Row */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
          <Building2 className="h-5 w-5 text-primary shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-foreground block">
              Current Clinical Affiliation: Senior Consultant
            </span>
            <span className="text-secondary-text">
              Department of Medicine, Square Hospital & Tele-Health Network
            </span>
          </div>
        </div>
      </div>

      {/* 3. Humanized Consultation Flow (How It Works) */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          <span>How Your Video Consultation Works</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="p-4 rounded-xl border border-border/70 bg-slate-50/60 dark:bg-slate-900/30 space-y-1.5">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Select a Slot</h4>
            <p className="text-xs text-secondary-text leading-relaxed">
              Choose your preferred date and time from the live schedule sidebar.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-slate-50/60 dark:bg-slate-900/30 space-y-1.5">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Join Video Call</h4>
            <p className="text-xs text-secondary-text leading-relaxed">
              Connect via high-definition encrypted video from your browser or phone.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-slate-50/60 dark:bg-slate-900/30 space-y-1.5">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">Get Prescription</h4>
            <p className="text-xs text-secondary-text leading-relaxed">
              Receive BMDC-signed digital prescription and lab guidance instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAboutSection;
