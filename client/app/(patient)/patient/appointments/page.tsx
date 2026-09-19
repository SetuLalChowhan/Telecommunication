import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientBookingsServer } from "@/features/patients/api/server";
import { patientKeys, PatientBookingsQueryParams } from "@/features/patients/types";
import { PatientAppointmentsClient } from "./PatientAppointmentsClient";

interface PatientAppointmentsPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function PatientAppointmentsPage({
  searchParams,
}: PatientAppointmentsPageProps) {
  const resolvedParams = await searchParams;
  const statusParam = resolvedParams.status;
  const pageParam = resolvedParams.page ? Number(resolvedParams.page) : 1;

  const queryParams: PatientBookingsQueryParams = {
    status: statusParam && statusParam !== "ALL" ? statusParam : undefined,
    page: pageParam,
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: patientKeys.bookings(queryParams),
    queryFn: () => getPatientBookingsServer(queryParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Appointments...</span>
            </div>
          </div>
        }
      >
        <PatientAppointmentsClient initialStatus={statusParam || "ALL"} />
      </Suspense>
    </HydrationBoundary>
  );
}
