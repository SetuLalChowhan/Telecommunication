import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientBookingsServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import {
  appointmentKeys,
  normalizeStatusFilter,
} from "@/features/appointments/types";
import { getBookingSummaryServer } from "@/features/appointments/api/server";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { PatientAppointmentsClient } from "./PatientAppointmentsClient";
import { MAX_PAGE_SIZE } from "@/lib/api/types";

export const metadata: Metadata = {
  title: "My Consultations & Appointments | DocConnect",
  description: "Manage your past and upcoming doctor consultations, video calls, and cancellations.",
};

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
  const statusParam = resolvedParams?.status;

  // Normalize once so the URL, prefetch and client hook all agree on the filter.
  const activeStatus = normalizeStatusFilter(statusParam);
  const listParams = {
    ...(activeStatus !== "ALL" ? { status: activeStatus } : {}),
    limit: MAX_PAGE_SIZE,
  };

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: patientKeys.bookings(listParams),
      queryFn: () => getPatientBookingsServer(listParams),
    }),
    queryClient.prefetchQuery({
      queryKey: appointmentKeys.summary(),
      queryFn: () => getBookingSummaryServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientAppointmentsClient initialStatus={activeStatus} />
    </HydrationBoundary>
  );
}
