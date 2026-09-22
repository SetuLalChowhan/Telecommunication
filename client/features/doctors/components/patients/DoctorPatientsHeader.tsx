"use client";

import React from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout";

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
  const metrics = [
    { label: "Patients", value: totalPatients, caption: "In your directory" },
    { label: "Consultations", value: totalConsultations, caption: "Across all patients" },
    { label: "Reports & prescriptions", value: totalReports, caption: "Shared documents" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Clinical"
        title="Patients"
        meta={`${totalPatients} total`}
        description="Patient records, consultation histories and diagnoses."
        actions={
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              aria-label="Search patients"
              placeholder="Search name, phone, diagnosis"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 rounded-md pl-8 pr-8 text-xs"
            />
            {isFetching && (
              <Loader2 className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-primary" />
            )}
          </div>
        }
      />

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {metrics.map((metric) => (
            <div key={metric.label} className="kpi-cell">
              <span className="data-label">{metric.label}</span>
              <span className="data-value">{metric.value}</span>
              <span className="text-[11px] text-muted-foreground">
                {metric.caption}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
