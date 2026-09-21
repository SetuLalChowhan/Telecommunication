import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPatientBookingsServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: patientKeys.bookings({ limit: 100 }),
    queryFn: () => getPatientBookingsServer({ limit: 100 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientAppointmentsClient initialStatus={statusParam || "ALL"} />
    </HydrationBoundary>
  );
}
