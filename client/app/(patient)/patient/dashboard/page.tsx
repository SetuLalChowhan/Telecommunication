import React from "react";
import type { Metadata } from "next";
import { PatientDashboardClient } from "./PatientDashboardClient";

export const metadata: Metadata = {
  title: "Patient Dashboard | DocConnect",
  description: "View upcoming doctor appointments, prescriptions, and health metrics.",
};

export default function PatientDashboardPage() {
  return <PatientDashboardClient />;
}
