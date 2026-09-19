import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNotificationsServer } from "@/features/notifications/api/server";
import { notificationKeys } from "@/features/notifications/types";
import { PatientNotificationsClient } from "./PatientNotificationsClient";

export default async function PatientNotificationsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => getNotificationsServer(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Notifications...</span>
            </div>
          </div>
        }
      >
        <PatientNotificationsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
