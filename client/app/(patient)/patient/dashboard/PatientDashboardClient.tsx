"use client";

import React from "react";
import { PatientDashboardView } from "@/features/patients";
import { useAuth } from "@/features/auth/api/queries";

export function PatientDashboardClient() {
  const { user } = useAuth();

  return <PatientDashboardView patientName={user?.name} />;
}
