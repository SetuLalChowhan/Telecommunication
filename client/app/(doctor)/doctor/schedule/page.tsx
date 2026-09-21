import React, { Suspense } from "react";
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
import { DoctorScheduleClient } from "./DoctorScheduleClient";

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
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Schedule...</span>
            </div>
          </div>
        }
      >
        <DoctorScheduleClient />
      </Suspense>
    </HydrationBoundary>
  );
}
