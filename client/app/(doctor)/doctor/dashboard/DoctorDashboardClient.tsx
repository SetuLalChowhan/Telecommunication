"use client";

import React from "react";
import { DoctorDashboardView } from "@/features/doctors";
import { useAuth } from "@/lib/api";

export function DoctorDashboardClient() {
  const { user, isSessionLoading } = useAuth();
  const isVerified = user?.doctorProfile?.verified ?? false;

  return (
    <DoctorDashboardView
      doctorName={user?.name}
      isVerified={isVerified}
      isLoading={isSessionLoading}
    />
  );
}
