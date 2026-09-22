"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout";

interface DoctorAppointmentsHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalCount: number;
}

export const DoctorAppointmentsHeader: React.FC<DoctorAppointmentsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalCount,
}) => {
  return (
    <PageHeader
      eyebrow="Clinical"
      title="Consultation queue"
      meta={`${totalCount} total`}
      description="Confirm requests and review scheduled patient consultations."
      actions={
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search consultations"
            placeholder="Search patient or condition"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 rounded-md pl-8 text-xs"
          />
        </div>
      }
    />
  );
};
