import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMyDoctorPatientsServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { DoctorPatientsClient } from "./DoctorPatientsClient";

export const metadata: Metadata = {
  title: "Patient Registry | Doctor Console",
  description: "View and manage your patient medical histories and consultations.",
};

export default async function DoctorPatientsPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.myPatients(),
      queryFn: () => getMyDoctorPatientsServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorPatientsClient />
    </HydrationBoundary>
  );
}
