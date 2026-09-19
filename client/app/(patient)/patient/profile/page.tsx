import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientProfileServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { PatientProfileClient } from "./PatientProfileClient";

export default async function PatientProfilePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: patientKeys.profile(),
    queryFn: () => getPatientProfileServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Patient Profile...</span>
            </div>
          </div>
        }
      >
        <PatientProfileClient />
      </Suspense>
    </HydrationBoundary>
  );
}
