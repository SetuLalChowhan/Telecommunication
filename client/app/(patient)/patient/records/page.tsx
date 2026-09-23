import React from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import { getMyMedicalReportsServer } from "@/features/medical-reports/api/server";
import { medicalReportKeys } from "@/features/medical-reports/types";
import { getPatientBookingsServer } from "@/features/patients/api/server";
import { patientKeys } from "@/features/patients/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { MAX_PAGE_SIZE } from "@/lib/api/types";
import { PatientRecordsClient } from "./PatientRecordsClient";

export const metadata: Metadata = {
  title: "Medical Records & Reports | DocConnect",
  description: "Securely view, upload, and organize your diagnostic reports and clinical documents.",
};

/**
 * Kept in sync with the client hooks: type and search are filtered on the
 * client, so one wide page is prefetched instead of the API default of 10.
 * `UPLOAD_BOOKINGS_LIMIT` matches `UploadReportModal`'s booking picker.
 */
const UPLOAD_BOOKINGS_LIMIT = 50;

export default function PatientRecordsPage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: medicalReportKeys.myReports({ limit: MAX_PAGE_SIZE }),
          queryFn: () => getMyMedicalReportsServer({ limit: MAX_PAGE_SIZE }),
        },
        {
          queryKey: patientKeys.bookings({ limit: UPLOAD_BOOKINGS_LIMIT }),
          queryFn: () => getPatientBookingsServer({ limit: UPLOAD_BOOKINGS_LIMIT }),
        },
        authProfilePrefetch,
      ]}
    >
      <PatientRecordsClient />
    </HydrationProvider>
  );
}
