import React from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNotificationsServer } from "@/features/notifications/api/server";
import { notificationKeys } from "@/features/notifications/types";
import { PatientNotificationsClient } from "./PatientNotificationsClient";

export const metadata: Metadata = {
  title: "Notifications | DocConnect",
  description: "View important medical updates, booking alerts, and account notifications.",
};

export default async function PatientNotificationsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => getNotificationsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PatientNotificationsClient />
    </HydrationBoundary>
  );
}
