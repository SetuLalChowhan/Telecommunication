import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import {
  getDoctorByIdOrSlugServer,
  getDoctorAvailabilityServer,
} from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { DoctorDetailsContent } from "@/components/site/doctors/details/DoctorDetailsContent";
import { buildBookingDateStrip } from "@/lib/time";

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

  // Built once on the server so the booking widget's date strip is identical in
  // the server HTML and on the client — see `buildBookingDateStrip`.
  const bookingDays = buildBookingDateStrip();

  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: doctorKeys.detail(idOrSlug),
          queryFn: () => getDoctorByIdOrSlugServer(idOrSlug),
        },
        {
          queryKey: doctorKeys.availability(idOrSlug),
          queryFn: () => getDoctorAvailabilityServer(idOrSlug),
        },
      ]}
    >
      <DoctorDetailsContent idOrSlug={idOrSlug} bookingDays={bookingDays} />
    </HydrationProvider>
  );
}
