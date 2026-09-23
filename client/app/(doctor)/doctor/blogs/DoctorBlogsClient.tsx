"use client";

import React from "react";
import { PageHeader } from "@/components/layout";
import { DoctorBlogManager } from "@/features/doctors/components/DoctorBlogManager";

/**
 * Dedicated article studio for doctors. The list is prefetched on the server
 * and hydrated through `HydrationBoundary`, so the first paint already shows
 * the doctor's articles.
 */
export function DoctorBlogsClient() {
  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Content studio"
        title="Health articles"
        description="Write, publish and manage the articles your patients read."
      />
      <DoctorBlogManager />
    </div>
  );
}

export default DoctorBlogsClient;
