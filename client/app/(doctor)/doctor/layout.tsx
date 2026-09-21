"use client";

import React from "react";
import DoctorLayout from "@/layouts/DoctorLayout";

export default function DoctorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DoctorLayout>{children}</DoctorLayout>;
}
