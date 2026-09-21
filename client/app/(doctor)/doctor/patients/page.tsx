import React from "react";
import type { Metadata } from "next";
import { DoctorPatientsClient } from "./DoctorPatientsClient";

export const metadata: Metadata = {
  title: "Patient Registry | Doctor Console",
  description: "View and manage your patient medical histories and consultations.",
};

export default function DoctorPatientsPage() {
  return <DoctorPatientsClient />;
}
