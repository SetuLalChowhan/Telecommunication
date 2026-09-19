import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMyMedicalReportsServer } from "@/features/medical-reports/api/server";
import { medicalReportKeys } from "@/features/medical-reports/types";
import { getPatientBookingsServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { PatientRecordsClient } from "./PatientRecordsClient";

export default async function PatientRecordsPage() {
  const queryClient = new QueryClient();

  // Prefetch both patient medical reports and appointments (so booking selector in upload modal is fast)
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: medicalReportKeys.myReports(),
      queryFn: () => getMyMedicalReportsServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: patientKeys.bookings({ limit: 50 }),
      queryFn: () => getPatientBookingsServer({ limit: 50 }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Medical Records...</span>
            </div>
          </div>
        }
      >
        <PatientRecordsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
