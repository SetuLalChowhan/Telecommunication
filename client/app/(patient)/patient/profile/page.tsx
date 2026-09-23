import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientProfileServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { PatientProfileClient } from "./PatientProfileClient";

export const metadata: Metadata = {
  title: "My Profile & Emergency Contacts | DocConnect",
  description: "Manage your personal health information, blood group, and emergency contacts.",
};

export default async function PatientProfilePage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: patientKeys.profile(),
      queryFn: () => getPatientProfileServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientProfileClient />
    </HydrationBoundary>
  );
}
