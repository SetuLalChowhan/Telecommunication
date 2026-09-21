import React from "react";
import type { Metadata } from "next";
import { PatientNotificationsClient } from "./PatientNotificationsClient";

export const metadata: Metadata = {
  title: "Notifications | DocConnect",
  description: "View important medical updates, booking alerts, and account notifications.",
};

export default function PatientNotificationsPage() {
  return <PatientNotificationsClient />;
}
