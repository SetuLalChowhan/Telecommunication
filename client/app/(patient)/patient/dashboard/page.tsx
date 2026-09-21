import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientDashboardServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { PatientDashboardClient } from "./PatientDashboardClient";

export const metadata: Metadata = {
  title: "Patient Dashboard | DocConnect",
  description: "View upcoming doctor appointments, prescriptions, and health metrics.",
};

export default async function PatientDashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: patientKeys.dashboard(),
    queryFn: () => getPatientDashboardServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientDashboardClient />
    </HydrationBoundary>
  );
}
