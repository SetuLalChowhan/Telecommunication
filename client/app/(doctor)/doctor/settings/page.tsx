import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getMyDoctorProfileServer,
  getSpecialtiesServer,
} from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { DoctorSettingsClient } from "./DoctorSettingsClient";

export const metadata: Metadata = {
  title: "Professional Profile & Credentials | Doctor Console",
  description: "Manage your professional doctor profile, qualifications, and integrations.",
};

export default async function DoctorSettingsPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.me(),
      queryFn: () => getMyDoctorProfileServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: doctorKeys.specialties(),
      queryFn: () => getSpecialtiesServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorSettingsClient />
    </HydrationBoundary>
  );
}
