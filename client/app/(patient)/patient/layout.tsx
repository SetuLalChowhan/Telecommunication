"use client";

import React from "react";
import { DashboardShell } from "@/components/layout";

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="PATIENT">{children}</DashboardShell>;
}
