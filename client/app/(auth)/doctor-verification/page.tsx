import React from "react";
import type { Metadata } from "next";
import { DoctorVerificationForm } from "@/features/auth/components/DoctorVerificationForm";

export const metadata: Metadata = {
  title: "Doctor Verification | DocConnect",
  description: "Verify your medical license and credentials on DocConnect.",
};

export default function DoctorVerificationPage() {
  return <DoctorVerificationForm />;
}
