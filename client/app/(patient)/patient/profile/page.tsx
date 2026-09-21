import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientProfileServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { PatientProfileClient } from "./PatientProfileClient";

export const metadata: Metadata = {
  title: "My Profile & Emergency Contacts | DocConnect",
  description: "Manage your personal health information, blood group, and emergency contacts.",
};

export default async function PatientProfilePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: patientKeys.profile(),
    queryFn: () => getPatientProfileServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientProfileClient />
    </HydrationBoundary>
  );
}
