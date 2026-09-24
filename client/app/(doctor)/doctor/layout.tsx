"use client";

import React from "react";
import { DashboardShell } from "@/components/layout";

export default function DoctorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="DOCTOR">{children}</DashboardShell>;
}
