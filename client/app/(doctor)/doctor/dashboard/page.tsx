import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getDoctorDashboardServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { DoctorDashboardClient } from "./DoctorDashboardClient";

export const metadata: Metadata = {
  title: "Doctor Dashboard | DocConnect",
  description: "Manage your consultations, patients, and schedule.",
};

export default async function DoctorDashboardPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.dashboard(),
      queryFn: () => getDoctorDashboardServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorDashboardClient />
    </HydrationBoundary>
  );
}
