"use client";

import React from "react";
import { FileCheck2, FileText } from "lucide-react";

interface RecordsFilterTabsProps {
  activeTab: "diagnostic" | "prescription" | "all";
  onTabChange: (tab: "diagnostic" | "prescription" | "all") => void;
  diagnosticCount: number;
  prescriptionCount: number;
  totalCount: number;
}

export const RecordsFilterTabs: React.FC<RecordsFilterTabsProps> = ({
  activeTab,
  onTabChange,
  diagnosticCount,
  prescriptionCount,
  totalCount,
}) => {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border w-fit">
      <button
        type="button"
        onClick={() => onTabChange("diagnostic")}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          activeTab === "diagnostic"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <FileCheck2 className="h-4 w-4" />
        <span>Diagnostic Reports</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
          {diagnosticCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("prescription")}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          activeTab === "prescription"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <FileText className="h-4 w-4" />
        <span>Prescriptions</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
          {prescriptionCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("all")}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          activeTab === "all"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span>All Documents</span>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold">
          {totalCount}
        </span>
      </button>
    </div>
  );
};
