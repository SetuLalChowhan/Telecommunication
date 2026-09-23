import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getDoctorBookingsServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import type { DoctorBookingsQueryParams } from "@/features/doctors/types";
import { MAX_PAGE_SIZE } from "@/lib/api/types";
import {
  appointmentKeys,
  normalizeStatusFilter,
} from "@/features/appointments/types";
import { getBookingSummaryServer } from "@/features/appointments/api/server";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { DoctorAppointmentsClient } from "./DoctorAppointmentsClient";

export const metadata: Metadata = {
  title: "Consultation Queue & Appointments | Doctor Console",
  description: "View and manage scheduled and upcoming patient consultations.",
};

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

  // Normalize once so the URL, prefetch and client hook all agree on the filter.
  const activeStatus = normalizeStatusFilter(statusParam);

  // The queue is filtered client-side, so request the full page instead of the
  // default 10 — otherwise a busy doctor silently loses appointments.
  const listParams: DoctorBookingsQueryParams = {
    ...(activeStatus !== "ALL" ? { status: activeStatus } : {}),
    limit: MAX_PAGE_SIZE,
  };

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.myBookings(listParams),
      queryFn: () => getDoctorBookingsServer(listParams),
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
      <DoctorAppointmentsClient initialStatus={activeStatus} />
    </HydrationBoundary>
  );
}
