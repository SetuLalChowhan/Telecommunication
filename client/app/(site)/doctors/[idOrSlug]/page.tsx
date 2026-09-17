import React, { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getDoctorByIdOrSlugServer,
  getDoctorAvailabilityServer,
} from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { DoctorDetailsContent } from "@/components/site/doctors/details/DoctorDetailsContent";

interface DoctorDetailsPageProps {
  params: Promise<{ idOrSlug: string }>;
}

export default async function DoctorDetailsPage({
  params,
}: DoctorDetailsPageProps) {
  const resolvedParams = await params;
  const idOrSlug = resolvedParams.idOrSlug;

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.detail(idOrSlug),
      queryFn: () => getDoctorByIdOrSlugServer(idOrSlug),
    }),
    queryClient.prefetchQuery({
      queryKey: doctorKeys.availability(idOrSlug),
      queryFn: () => getDoctorAvailabilityServer(idOrSlug),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-screen flex items-center justify-center bg-background">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Doctor Profile...</span>
            </div>
          </div>
        }
      >
        <DoctorDetailsContent idOrSlug={idOrSlug} />
      </Suspense>
    </HydrationBoundary>
  );
}
