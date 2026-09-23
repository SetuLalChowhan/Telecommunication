import React from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import { getPatientBookingsServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import {
  appointmentKeys,
  normalizeStatusFilter,
} from "@/features/appointments/types";
import { getBookingSummaryServer } from "@/features/appointments/api/server";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { MAX_PAGE_SIZE } from "@/lib/api/types";
import { PatientAppointmentsClient } from "./PatientAppointmentsClient";

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

  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: patientKeys.bookings(listParams),
          queryFn: () => getPatientBookingsServer(listParams),
        },
        {
          queryKey: appointmentKeys.summary(),
          queryFn: () => getBookingSummaryServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <PatientAppointmentsClient initialStatus={activeStatus} />
    </HydrationProvider>
  );
}
