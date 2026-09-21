import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getDoctorBookingsServer,
  getDoctorDashboardServer,
} from "@/features/doctors/api/server";
import { doctorKeys, DoctorBookingsQueryParams } from "@/features/doctors/types";
import { DoctorAppointmentsClient } from "./DoctorAppointmentsClient";

interface DoctorAppointmentsPageProps {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function DoctorAppointmentsPage({
  searchParams,
}: DoctorAppointmentsPageProps) {
  const resolvedParams = await searchParams;
  const statusParam = resolvedParams?.status;
  const pageParam = resolvedParams?.page ? Number(resolvedParams.page) : 1;

  const queryParams: DoctorBookingsQueryParams = {
    status: statusParam && statusParam !== "ALL" ? (statusParam as any) : undefined,
    page: pageParam,
  };

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.myBookings(queryParams),
      queryFn: () => getDoctorBookingsServer(queryParams),
    }),
    queryClient.prefetchQuery({
      queryKey: doctorKeys.dashboard(),
      queryFn: () => getDoctorDashboardServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Consultations...</span>
            </div>
          </div>
        }
      >
        <DoctorAppointmentsClient initialStatus={statusParam || "ALL"} />
      </Suspense>
    </HydrationBoundary>
  );
}
