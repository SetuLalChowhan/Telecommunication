import React, { Suspense } from "react";
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
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
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
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full py-20 flex items-center justify-center text-sm font-semibold text-primary">
            Loading settings...
          </div>
        }
      >
        <DoctorSettingsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
