import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getMyDoctorScheduleServer,
  getMyDoctorDaysOffServer,
} from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { DoctorScheduleClient } from "./DoctorScheduleClient";

export const metadata: Metadata = {
  title: "Availability & Leave Schedule | Doctor Console",
  description: "Configure your weekly availability slots and manage days off.",
};

export default async function DoctorSchedulePage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.mySchedule(),
      queryFn: () => getMyDoctorScheduleServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: doctorKeys.myDaysOff(),
      queryFn: () => getMyDoctorDaysOffServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorScheduleClient />
    </HydrationBoundary>
  );
}
