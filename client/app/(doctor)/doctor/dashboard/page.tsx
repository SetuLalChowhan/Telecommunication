import React from "react";
import type { Metadata } from "next";
import { DoctorDashboardClient } from "./DoctorDashboardClient";

export const metadata: Metadata = {
  title: "Doctor Dashboard | DocConnect",
  description: "Manage your consultations, patients, and schedule.",
};

export default function DoctorDashboardPage() {
  return <DoctorDashboardClient />;
}
