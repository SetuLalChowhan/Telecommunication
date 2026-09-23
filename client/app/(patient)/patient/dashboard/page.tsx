import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientDashboardServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { PatientDashboardClient } from "./PatientDashboardClient";

export const metadata: Metadata = {
  title: "Patient Dashboard | DocConnect",
  description: "View upcoming doctor appointments, prescriptions, and health metrics.",
};

export default async function PatientDashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: patientKeys.dashboard(),
      queryFn: () => getPatientDashboardServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientDashboardClient />
    </HydrationBoundary>
  );
}
