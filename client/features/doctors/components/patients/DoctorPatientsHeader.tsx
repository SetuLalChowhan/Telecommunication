"use client";

import React from "react";
import { Search, Loader2, Users, Calendar, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DoctorPatientsHeaderProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  isFetching: boolean;
  totalPatients: number;
  totalConsultations: number;
  totalReports: number;
}

export const DoctorPatientsHeader: React.FC<DoctorPatientsHeaderProps> = ({
  searchInput,
  onSearchChange,
  isFetching,
  totalPatients,
  totalConsultations,
  totalReports,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            My Patients Registry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            View your patient records, consultation histories, and clinical diagnoses.
          </p>
        </div>

        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, phone, diagnosis..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9.5 pr-9 h-10 text-xs sm:text-sm rounded-xl"
          />
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl border border-border/70 bg-card flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Patients
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalPatients}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/70 bg-card flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Visits
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalConsultations}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-border/70 bg-card flex items-center gap-3.5 shadow-xs">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Reports & Prescriptions
            </p>
            <p className="text-xl font-bold text-foreground mt-0.5">{totalReports}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
