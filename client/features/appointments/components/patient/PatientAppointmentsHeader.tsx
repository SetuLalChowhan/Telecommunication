"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout";

interface PatientAppointmentsHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  totalCount: number;
}

export const PatientAppointmentsHeader: React.FC<PatientAppointmentsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalCount,
}) => {
  return (
    <PageHeader
      eyebrow="Care"
      title="Appointments"
      meta={`${totalCount} total`}
      description="Upcoming video visits and past consultations."
      actions={
        <>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label="Search appointments"
              placeholder="Search doctor or specialty"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 rounded-md pl-8 text-xs"
            />
          </div>

          <Link href="/doctors" className="shrink-0">
            <Button size="sm" className="h-8 rounded-md px-3 text-xs font-semibold">
              <Plus className="h-3.5 w-3.5" />
              <span>Book appointment</span>
            </Button>
          </Link>
        </>
      }
    />
  );
};
