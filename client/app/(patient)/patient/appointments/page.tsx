import React from "react";
import type { Metadata } from "next";
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
  const statusParam = resolvedParams.status;

  return <PatientAppointmentsClient initialStatus={statusParam || "ALL"} />;
}
