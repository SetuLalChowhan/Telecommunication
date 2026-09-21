import React from "react";
import type { Metadata } from "next";
import { DoctorSettingsClient } from "./DoctorSettingsClient";

export const metadata: Metadata = {
  title: "Professional Profile & Credentials | Doctor Console",
  description: "Manage your professional doctor profile, qualifications, and integrations.",
};

export default function DoctorSettingsPage() {
  return <DoctorSettingsClient />;
}
