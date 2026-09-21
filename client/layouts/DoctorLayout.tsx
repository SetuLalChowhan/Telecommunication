"use client";

import React from "react";
import { DashboardShell } from "@/components/layout";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  return <DashboardShell role="DOCTOR">{children}</DashboardShell>;
};

export default DoctorLayout;
