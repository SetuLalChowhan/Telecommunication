"use client";

import React from "react";
import { DoctorDashboardStats } from "../types";
import { cn } from "@/lib/utils";

interface DoctorStatsCardsProps {
  stats?: DoctorDashboardStats;
  isLoading?: boolean;
}

interface Metric {
  label: string;
  value: number;
  caption: string;
  tone?: "warning" | "accent";
}

export const DoctorStatsCards: React.FC<DoctorStatsCardsProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading || !stats) {
    return (
      <div className="panel overflow-hidden">
        <div className="kpi-strip">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="kpi-cell">
              <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
              <div className="h-6 w-12 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-muted/70" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const metrics: Metric[] = [
    {
      label: "Today's schedule",
      value: stats.todayConsultationsCount,
      caption: "Scheduled for today",
      tone: "accent",
    },
    {
      label: "Awaiting confirmation",
      value: stats.pendingConfirmationCount,
      caption:
        stats.pendingConfirmationCount > 0
          ? "Patient requests to review"
          : "Nothing pending",
      tone: stats.pendingConfirmationCount > 0 ? "warning" : undefined,
    },
    {
      label: "Completed",
      value: stats.completedConsultationsCount,
      caption: "Closed consultations",
    },
    {
      label: "Total visits",
      value: stats.totalConsultations,
      caption: "Lifetime patient visits",
    },
  ];

  return (
    <div className="panel overflow-hidden">
      <div className="kpi-strip">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "kpi-cell",
              // 2-column grid on mobile, single row of 4 from lg up.
              index >= 2 && "border-t border-border lg:border-t-0",
              index % 2 === 1 && "border-l border-border",
              index > 0 && "lg:border-l lg:border-border"
            )}
          >
            <span className="data-label">{metric.label}</span>
            <span
              className={cn(
                "data-value",
                metric.tone === "warning" && "text-amber-600 dark:text-amber-400",
                metric.tone === "accent" && "text-primary"
              )}
            >
              {metric.value}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {metric.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorStatsCards;
