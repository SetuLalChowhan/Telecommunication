import React from "react";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Medical Records & Reports | DocConnect",
  description: "Securely view, upload, and organize your diagnostic reports and clinical documents.",
};

export default async function PatientRecordsPage() {
  const queryClient = new QueryClient();

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
      <PatientRecordsClient />
    </HydrationBoundary>
  );
}
