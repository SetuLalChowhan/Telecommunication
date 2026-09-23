import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import {
  getMyDoctorProfileServer,
  getSpecialtiesServer,
} from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { DoctorSettingsClient } from "./DoctorSettingsClient";

export const metadata: Metadata = {
  title: "Professional Profile & Credentials | Doctor Console",
  description: "Manage your professional doctor profile, qualifications, and integrations.",
};

export default function DoctorSettingsPage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: doctorKeys.me(),
          queryFn: () => getMyDoctorProfileServer(),
        },
        {
          queryKey: doctorKeys.specialties(),
          queryFn: () => getSpecialtiesServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <Suspense
        fallback={
          <div className="w-full py-20 flex items-center justify-center text-sm font-semibold text-primary">
            Loading settings...
          </div>
        }
      >
        <DoctorSettingsClient />
      </Suspense>
    </HydrationProvider>
  );
}
