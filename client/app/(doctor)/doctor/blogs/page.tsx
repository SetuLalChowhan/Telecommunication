import React, { Suspense } from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAdminBlogsServer } from "@/features/blogs/api/server";
import { adminBlogKeys } from "@/features/blogs/types";
import { getProfileServer } from "@/features/auth/api/server";
import { authKeys } from "@/features/auth/types";
import { PageSkeleton } from "@/components/feedback/PageSkeleton";
import { DoctorBlogsClient } from "./DoctorBlogsClient";

export const metadata: Metadata = {
  title: "Health Articles Studio | Doctor Console",
  description: "Write, publish and manage your patient-facing health articles.",
};

export default async function DoctorBlogsPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: adminBlogKeys.list({}),
      queryFn: () => getAdminBlogsServer(),
    }),
    queryClient.prefetchQuery({
      queryKey: authKeys.profile(),
      queryFn: () => getProfileServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PageSkeleton />}>
        <DoctorBlogsClient />
      </Suspense>
    </HydrationBoundary>
  );
}
