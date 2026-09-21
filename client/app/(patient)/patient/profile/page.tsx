import React from "react";
import type { Metadata } from "next";
import { PatientProfileClient } from "./PatientProfileClient";

export const metadata: Metadata = {
  title: "My Profile & Emergency Contacts | DocConnect",
  description: "Manage your personal health information, blood group, and emergency contacts.",
};

export default function PatientProfilePage() {
  return <PatientProfileClient />;
}
