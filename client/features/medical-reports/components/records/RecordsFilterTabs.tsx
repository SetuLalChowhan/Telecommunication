"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type RecordsCategoryFilter = "diagnostic" | "prescription" | "all";

interface RecordsFilterTabsProps {
  activeTab: RecordsCategoryFilter;
  onTabChange: (tab: RecordsCategoryFilter) => void;
  diagnosticCount: number;
  prescriptionCount: number;
  totalCount: number;
}

interface TabDef {
  value: RecordsCategoryFilter;
  label: string;
  shortLabel: string;
  count: number;
}

export const RecordsFilterTabs: React.FC<RecordsFilterTabsProps> = ({
  activeTab,
  onTabChange,
  diagnosticCount,
  prescriptionCount,
  totalCount,
}) => {
  const tabs: TabDef[] = [
    {
      value: "diagnostic",
      label: "Diagnostic reports",
      shortLabel: "Reports",
      count: diagnosticCount,
    },
    {
      value: "prescription",
      label: "Prescriptions",
      shortLabel: "Rx",
      count: prescriptionCount,
    },
    {
      value: "all",
      label: "All documents",
      shortLabel: "All",
      count: totalCount,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter documents by type"
      className="flex w-full items-center gap-0.5 overflow-x-auto border-b border-border"
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
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RecordsFilterTabs;
