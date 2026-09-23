import React, { Suspense } from "react";
import type { Metadata } from "next";
import { HydrationProvider } from "@/lib/query/hydrate";
import {
  getDoctorsServer,
  getSpecialtiesServer,
} from "@/features/doctors/api/server";
import { doctorKeys } from "@/features/doctors/types";
import { DoctorList } from "@/components/site/doctors/DoctorList";

export const metadata: Metadata = {
  title: "Find Doctors & Book Appointments | DocConnect",
  description:
    "Search top certified doctors and medical specialists by specialty, consultation fee, and experience. Book video appointments instantly.",
  keywords: [
    "find doctors",
    "book doctor online",
    "specialist doctors",
    "telemedicine appointment",
    "verified physicians",
    "doctor consultations",
  ],
  openGraph: {
    title: "Find Doctors & Book Appointments | DocConnect",
    description:
      "Search top certified doctors and medical specialists by specialty, consultation fee, and experience.",
    type: "website",
  },
};

interface DoctorsPageProps {
  searchParams: Promise<{
    q?: string;
    search?: string;
    specialty?: string;
    specialtySlug?: string;
    minFee?: string;
    maxFee?: string;
    experience?: string;
    minExperience?: string;
    sortBy?: "rating" | "fee" | "experience";
    page?: string;
  }>;
}

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
  const resolvedParams = await searchParams;
  // The hero search bar links with `?q=`; accept `search` too for older links.
  const searchTerm = (resolvedParams.q || resolvedParams.search || "").trim();
  const queryParams = {
    search: searchTerm || undefined,
    specialtySlug:
      resolvedParams.specialtySlug || resolvedParams.specialty || undefined,
    minFee: resolvedParams.minFee ? Number(resolvedParams.minFee) : undefined,
    maxFee: resolvedParams.maxFee ? Number(resolvedParams.maxFee) : undefined,
    experience:
      resolvedParams.experience || resolvedParams.minExperience || undefined,
    sortBy:
      (resolvedParams.sortBy as "latest" | "rating" | "fee" | "experience") ||
      "latest",
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit: 6,
  };

  return (
    <HydrationProvider
      prefetch={[
        {
          queryKey: doctorKeys.list(queryParams),
          queryFn: () => getDoctorsServer(queryParams),
        },
        {
          queryKey: doctorKeys.specialties(),
          queryFn: () => getSpecialtiesServer(),
        },
      ]}
    >
      <DoctorList />
    </HydrationProvider>
  );
}
