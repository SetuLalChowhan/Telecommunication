"use client";

import React from "react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { DoctorDashboardView } from "@/components/doctor";
import { useAuth } from "@/lib/api";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const isVerified = user?.doctorProfile?.verified ?? false;

  return (
    <DoctorLayout>
      <DoctorDashboardView
        doctorName={user?.name || "Doctor"}
        isVerified={isVerified}
      />
    </DoctorLayout>
  );
}

