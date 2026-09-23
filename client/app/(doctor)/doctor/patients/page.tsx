import React from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import { getMyDoctorPatientsServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { DoctorPatientsClient } from "./DoctorPatientsClient";

export const metadata: Metadata = {
  title: "Patient Registry | Doctor Console",
  description: "View and manage your patient medical histories and consultations.",
};

export default function DoctorPatientsPage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: doctorKeys.myPatients(),
          queryFn: () => getMyDoctorPatientsServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <DoctorPatientsClient />
    </HydrationProvider>
  );
}
