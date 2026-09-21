import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getDoctorBookingsServer } from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: doctorKeys.myBookings(),
    queryFn: () => getDoctorBookingsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DoctorAppointmentsClient initialStatus={statusParam || "ALL"} />
    </HydrationBoundary>
  );
}
