import React from "react";
import type { Metadata } from "next";
import { DoctorScheduleClient } from "./DoctorScheduleClient";

export const metadata: Metadata = {
  title: "Availability & Leave Schedule | Doctor Console",
  description: "Configure your weekly availability slots and manage days off.",
};

export default function DoctorSchedulePage() {
  return <DoctorScheduleClient />;
}
