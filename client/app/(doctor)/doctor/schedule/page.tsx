import React from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import {
  getMyDoctorScheduleServer,
  getMyDoctorDaysOffServer,
} from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { DoctorScheduleClient } from "./DoctorScheduleClient";

export const metadata: Metadata = {
  title: "Availability & Leave Schedule | Doctor Console",
  description: "Configure your weekly availability slots and manage days off.",
};

export default function DoctorSchedulePage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: doctorKeys.mySchedule(),
          queryFn: () => getMyDoctorScheduleServer(),
        },
        {
          queryKey: doctorKeys.myDaysOff(),
          queryFn: () => getMyDoctorDaysOffServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <DoctorScheduleClient />
    </HydrationProvider>
  );
}
