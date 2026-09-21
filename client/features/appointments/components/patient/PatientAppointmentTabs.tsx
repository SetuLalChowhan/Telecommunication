"use client";

import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type PatientBookingFilterStatus = "ALL" | "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";

interface PatientAppointmentTabsProps {
  activeTab: PatientBookingFilterStatus;
  onTabChange: (tab: PatientBookingFilterStatus) => void;
  counts: {
    all: number;
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
}

export const PatientAppointmentTabs: React.FC<PatientAppointmentTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border overflow-x-auto w-full sm:w-fit">
      <button
        type="button"
        onClick={() => onTabChange("ALL")}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          activeTab === "ALL"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>All</span>
        <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px]">
          {counts.all}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("CONFIRMED")}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          activeTab === "CONFIRMED"
            ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Confirmed</span>
        <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px]">
          {counts.confirmed}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("PENDING")}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          activeTab === "PENDING"
            ? "bg-card text-amber-600 dark:text-amber-400 shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Clock className="h-3.5 w-3.5" />
        <span>Pending</span>
        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[10px]">
          {counts.pending}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("COMPLETED")}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          activeTab === "COMPLETED"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>Completed</span>
        <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px]">
          {counts.completed}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("CANCELLED")}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          activeTab === "CANCELLED"
            ? "bg-card text-red-600 dark:text-red-400 shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Cancelled</span>
        <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-600 text-[10px]">
          {counts.cancelled}
        </span>
      </button>
    </div>
  );
};
