"use client";

import React from "react";
import { DoctorDashboardView } from "@/features/doctors";
import { useAuth } from "@/features/auth/api/queries";
import { useMyDoctorProfile } from "@/features/doctors/api/queries";

export function DoctorDashboardClient() {
  const { user, isSessionLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useMyDoctorProfile();

  const isVerified = Boolean(
    profile?.verified ?? user?.doctorProfile?.verified ?? false
  );

  return (
    <DoctorDashboardView
      doctorName={user?.name || profile?.user?.name}
      isVerified={isVerified}
      isLoading={isSessionLoading && isProfileLoading}
    />
  );
}

export default DoctorDashboardClient;
