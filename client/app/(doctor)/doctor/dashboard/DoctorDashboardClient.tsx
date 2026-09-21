"use client";

import React from "react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { DoctorDashboardView } from "@/components/doctor";
import { useAuth } from "@/lib/api";

export function DoctorDashboardClient() {
  const { user, isSessionLoading } = useAuth();
  const isVerified = user?.doctorProfile?.verified ?? false;

  return (
    <DoctorLayout>
      <DoctorDashboardView
        doctorName={user?.name}
        isVerified={isVerified}
        isLoading={isSessionLoading}
      />
    </DoctorLayout>
  );
}
