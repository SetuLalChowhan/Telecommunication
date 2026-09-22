"use client";

import React from "react";
import {
  StatusTabs,
  AppointmentStatusCounts,
  AppointmentStatusFilter,
} from "../StatusTabs";

export type PatientBookingFilterStatus = AppointmentStatusFilter;

interface PatientAppointmentTabsProps {
  activeTab: PatientBookingFilterStatus;
  onTabChange: (tab: PatientBookingFilterStatus) => void;
  counts: AppointmentStatusCounts;
}

export const PatientAppointmentTabs: React.FC<PatientAppointmentTabsProps> = ({
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
