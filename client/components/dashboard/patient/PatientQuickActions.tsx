"use client";

import React from "react";
import Link from "next/link";
import { Plus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PatientQuickActions: React.FC = () => {
  return (
    <section className="rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-border/70 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-base font-bold text-foreground">
            Consult a Verified Specialist
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-secondary-text">
          Book online video consultations with top cardiologists, physicians, and pediatricians.
        </p>
      </div>

      <Link href="/doctors" className="shrink-0">
        <Button className="h-10 sm:h-11 px-5 rounded-xl text-sm font-semibold gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Book Appointment</span>
        </Button>
      </Link>
    </section>
  );
};

export default PatientQuickActions;
