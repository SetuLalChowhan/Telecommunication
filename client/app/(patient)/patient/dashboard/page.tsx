import React from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import { getPatientDashboardServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { PatientDashboardClient } from "./PatientDashboardClient";

export const metadata: Metadata = {
  title: "Patient Dashboard | DocConnect",
  description: "View upcoming doctor appointments, prescriptions, and health metrics.",
};

export default function PatientDashboardPage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: patientKeys.dashboard(),
          queryFn: () => getPatientDashboardServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <PatientDashboardClient />
    </HydrationProvider>
  );
}
