import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMyDoctorPatientsServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { DoctorPatientsClient } from "./DoctorPatientsClient";

export const metadata: Metadata = {
  title: "Patient Registry | Doctor Console",
  description: "View and manage your patient medical histories and consultations.",
};

export default async function DoctorPatientsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: doctorKeys.myPatients(),
    queryFn: () => getMyDoctorPatientsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorPatientsClient />
    </HydrationBoundary>
  );
}
