"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointment Schedule</h1>
        <p className="text-sm text-muted-foreground">
          Review, confirm, and manage upcoming and past patient consultations. ({totalCount} appointments)
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patient name, condition..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 rounded-xl text-sm"
        />
      </div>
    </div>
  );
};
