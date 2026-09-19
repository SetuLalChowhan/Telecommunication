"use client";

import React from "react";
import { CalendarCheck, Video, Clock, CheckCircle2 } from "lucide-react";
import { PatientDashboardStats } from "@/features/patients/types";

interface PatientStatsCardsProps {
  stats?: PatientDashboardStats;
  isLoading?: boolean;
}

export const PatientStatsCards: React.FC<PatientStatsCardsProps> = ({
  stats,
  isLoading = false,
}) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded-md" />
              <div className="h-8 w-8 rounded-xl bg-muted" />
            </div>
            <div className="h-8 w-16 bg-muted rounded-lg" />
            <div className="h-3 w-32 bg-muted/70 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Visits",
      value: stats.totalConsultations,
      description: "Lifetime consultations",
      icon: CalendarCheck,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "hover:border-primary/40",
    },
    {
      title: "Upcoming",
      value: stats.upcomingConsultations,
      description: "Confirmed video visits",
      icon: Video,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "hover:border-emerald-500/40",
      highlight: stats.upcomingConsultations > 0,
    },
    {
      title: "Pending Review",
      value: stats.pendingConsultations,
      description: "Awaiting confirmation",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "hover:border-amber-500/40",
      highlight: stats.pendingConsultations > 0,
    },
    {
      title: "Completed",
      value: stats.completedConsultations,
      description: "Past consultations",
      icon: CheckCircle2,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`group relative rounded-2xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs transition-all duration-200 hover:shadow-sm ${item.borderColor}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold text-secondary-text truncate">
                {item.title}
              </span>
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${item.bgColor} ${item.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {item.value}
              </span>
              {item.highlight && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground truncate">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PatientStatsCards;
