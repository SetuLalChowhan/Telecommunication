"use client";

import React from "react";
import { DoctorProfile } from "@/types/doctor";
import { GraduationCap, Stethoscope, CheckCircle2, Clock, Globe } from "lucide-react";

interface DoctorAboutSectionProps {
  doctor: DoctorProfile;
}

export const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({ doctor }) => {
  return (
    <div className="space-y-6">
      {/* About Summary Card */}
      <div className="rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2.5">
          <Stethoscope className="h-5 w-5 text-primary" />
          <span>About & Clinical Background</span>
        </h2>
        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed whitespace-pre-line">
          {doctor.bio ||
            "Dedicated healthcare professional committed to delivering accessible, evidence-based telemedicine consultations, preventative care plans, and specialized diagnostics."}
        </p>

        {/* Highlighted Bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>Personalized Care & Lifestyle Counseling</span>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>Digital Prescription & Diagnostic Orders</span>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>Instant Follow-up Medical Chat Support</span>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>Encrypted HD Video Consultations</span>
          </div>
        </div>
      </div>

      {/* Education & Experience Details */}
      <div className="rounded-tl-[32px] rounded-br-[32px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
        {/* Education */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Education & Degrees</span>
          </h3>
          <div className="space-y-2.5 pl-6 border-l-2 border-primary/20">
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                MBBS, FCPS / MD (Specialized Residency)
              </h4>
              <p className="text-[11px] sm:text-xs text-secondary-text">
                Dhaka Medical College & Hospital / Royal College of Physicians
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary/40" />
              <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                Fellowship in Telemedicine & Virtual Care
              </h4>
              <p className="text-[11px] sm:text-xs text-secondary-text">
                International Board of Digital Health Care
              </p>
            </div>
          </div>
        </div>

        {/* Additional Practice Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-secondary-text font-medium">Languages</p>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                English, Bangla, Hindi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-secondary-text font-medium">Avg. Consultation</p>
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                20 - 30 Minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAboutSection;
