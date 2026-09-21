import React from "react";
import type { Metadata } from "next";
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

  return <DoctorAppointmentsClient initialStatus={statusParam || "ALL"} />;
}
