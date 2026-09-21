import React from "react";
import type { Metadata } from "next";
import { PatientRecordsClient } from "./PatientRecordsClient";

export const metadata: Metadata = {
  title: "Medical Records & Reports | DocConnect",
  description: "Securely view, upload, and organize your diagnostic reports and clinical documents.",
};

export default function PatientRecordsPage() {
  return <PatientRecordsClient />;
}
