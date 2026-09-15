"use client";

import React from "react";
import PatientLayout from "@/layouts/PatientLayout";
import { PatientDashboardView } from "@/components/patient";
import { useAuth } from "@/lib/api";

export default function PatientDashboardPage() {
  const { user } = useAuth();

  return (
    <PatientLayout>
      <PatientDashboardView patientName={user?.name || "Patient"} />
    </PatientLayout>
  );
}

