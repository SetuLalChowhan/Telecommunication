"use client";

import React from "react";
import PatientLayout from "@/layouts/PatientLayout";

export default function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientLayout>{children}</PatientLayout>;
}
