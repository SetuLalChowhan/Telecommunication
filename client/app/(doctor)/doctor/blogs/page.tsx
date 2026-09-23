import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import { getAdminBlogsServer } from "@/features/blogs/api/server";
import { adminBlogKeys } from "@/features/blogs/types";
import { authProfilePrefetch } from "@/features/auth/api/server";
import { PageSkeleton } from "@/components/feedback/PageSkeleton";
import { DoctorBlogsClient } from "./DoctorBlogsClient";

export const metadata: Metadata = {
  title: "Health Articles Studio | Doctor Console",
  description: "Write, publish and manage your patient-facing health articles.",
};

export default function DoctorBlogsPage() {
  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: adminBlogKeys.list({}),
          queryFn: () => getAdminBlogsServer(),
        },
        authProfilePrefetch,
      ]}
    >
      <Suspense fallback={<PageSkeleton />}>
        <DoctorBlogsClient />
      </Suspense>
    </HydrationProvider>
  );
}
