import React from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import { getDoctorDashboardServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { DoctorDashboardClient } from "./DoctorDashboardClient";

export const metadata: Metadata = {
  title: "Doctor Dashboard | DocConnect",
  description: "Manage your consultations, patients, and schedule.",
};

export default function DoctorDashboardPage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: doctorKeys.dashboard(),
          queryFn: () => getDoctorDashboardServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <DoctorDashboardClient />
    </HydrationProvider>
  );
}
