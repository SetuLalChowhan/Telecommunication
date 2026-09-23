import React from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import { getPatientProfileServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { PatientProfileClient } from "./PatientProfileClient";

export const metadata: Metadata = {
  title: "My Profile & Emergency Contacts | DocConnect",
  description: "Manage your personal health information, blood group, and emergency contacts.",
};

export default function PatientProfilePage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: patientKeys.profile(),
          queryFn: () => getPatientProfileServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <PatientProfileClient />
    </HydrationProvider>
  );
}
