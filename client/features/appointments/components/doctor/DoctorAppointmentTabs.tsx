"use client";

import React from "react";
import {
  StatusTabs,
  AppointmentStatusCounts,
  AppointmentStatusFilter,
} from "../StatusTabs";

export type { AppointmentStatusFilter };

interface DoctorAppointmentTabsProps {
  activeTab: AppointmentStatusFilter;
  onTabChange: (tab: AppointmentStatusFilter) => void;
  counts: AppointmentStatusCounts;
}

export const DoctorAppointmentTabs: React.FC<DoctorAppointmentTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  return (
    <StatusTabs
      activeTab={activeTab}
      onTabChange={onTabChange}
      counts={counts}
    />
  );
};
