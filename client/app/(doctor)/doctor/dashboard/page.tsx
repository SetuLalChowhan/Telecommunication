import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getDoctorDashboardServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { DoctorDashboardClient } from "./DoctorDashboardClient";

export default async function DoctorDashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: doctorKeys.dashboard(),
    queryFn: () => getDoctorDashboardServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Doctor Dashboard...</span>
            </div>
          </div>
        }
      >
        <DoctorDashboardClient />
      </Suspense>
    </HydrationBoundary>
  );
}

