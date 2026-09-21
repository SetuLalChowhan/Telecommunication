import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMyDoctorPatientsServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { DoctorPatientsClient } from "./DoctorPatientsClient";

export default async function DoctorPatientsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: doctorKeys.myPatients(),
    queryFn: () => getMyDoctorPatientsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Patients Registry...</span>
            </div>
          </div>
        }
      >
        <DoctorPatientsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
