"use client";

import React from "react";
import Link from "next/link";
import { Plus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PatientQuickActions: React.FC = () => {
  return (
    <section className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            Consult a Verified Specialist
          </h3>
          <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
            Book online video consultations with top physicians, cardiologists, and pediatricians.
          </p>
        </div>
      </div>

      <Link href="/doctors" className="shrink-0">
        <Button className="h-10 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold gap-1.5 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </Button>
      </Link>
    </section>
  );
};

export default PatientQuickActions;
