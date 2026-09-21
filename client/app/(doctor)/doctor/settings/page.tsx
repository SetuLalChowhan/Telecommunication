import React, { Suspense } from "react";
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
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Doctor Settings...</span>
            </div>
          </div>
        }
      >
        <DoctorSettingsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
