"use client";

import React from "react";
import { DashboardShell } from "@/components/layout";

interface PatientLayoutProps {
  children: React.ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  return <DashboardShell role="PATIENT">{children}</DashboardShell>;
};

export default PatientLayout;
