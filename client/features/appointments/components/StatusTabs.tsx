"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type {
  BookingStatusFilter,
  BookingSummaryCounts,
} from "../types";

export type AppointmentStatusFilter = BookingStatusFilter;
export type AppointmentStatusCounts = BookingSummaryCounts;

interface StatusTabsProps {
  activeTab: AppointmentStatusFilter;
  onTabChange: (tab: AppointmentStatusFilter) => void;
  counts: AppointmentStatusCounts;
  className?: string;
}

const tabs: { value: AppointmentStatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const countFor = (
  counts: AppointmentStatusCounts,
  value: AppointmentStatusFilter
) => counts[value.toLowerCase() as keyof AppointmentStatusCounts] ?? 0;

/**
 * Underline tab bar shared by the patient and doctor appointment lists.
 * Kept as a single implementation so both portals stay visually identical.
 */
export const StatusTabs: React.FC<StatusTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  className,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Filter by status"
      className={cn(
        "flex w-full items-center gap-0.5 overflow-x-auto border-b border-border",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {countFor(counts, tab.value)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusTabs;
