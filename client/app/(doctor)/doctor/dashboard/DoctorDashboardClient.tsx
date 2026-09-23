"use client";

import React from "react";
import { DoctorDashboardView } from "@/features/doctors";
import { useAuth } from "@/features/auth/api/queries";

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
