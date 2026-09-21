import React, { Suspense } from "react";
import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: DoctorDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const idOrSlug = resolvedParams.idOrSlug;

  try {
    const doctor = await getDoctorByIdOrSlugServer(idOrSlug);
    if (!doctor) {
      return {
        title: "Doctor Profile | DocConnect",
        description: "View doctor credentials and book an appointment.",
      };
    }

    const docName = doctor.user?.name || "Doctor";
    const specialtyName =
      doctor.mainSpecialty?.name ||
      doctor.specialties?.[0]?.specialty?.name ||
      "Specialist";
    const title = `${docName} - ${specialtyName} | DocConnect`;
    const description =
      doctor.bio ||
      `Book an online consultation with ${docName}, ${specialtyName} with ${doctor.experienceYears || 0} years experience.`;

    const avatarUrl = doctor.user?.image ? [doctor.user.image] : [];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "profile",
        images: avatarUrl,
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: avatarUrl,
      },
    };
  } catch {
    return {
      title: "Doctor Profile | DocConnect",
      description: "View doctor credentials and book an appointment.",
    };
  }
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
