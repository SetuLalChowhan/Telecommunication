import React, { Suspense } from "react";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
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
    search?: string;
    specialty?: string;
    specialtySlug?: string;
    minFee?: string;
    maxFee?: string;
    sortBy?: "rating" | "fee" | "experience";
    page?: string;
  }>;
}

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
  const resolvedParams = await searchParams;
  const queryParams = {
    search: resolvedParams.search ? resolvedParams.search.trim() : undefined,
    specialtySlug:
      resolvedParams.specialtySlug || resolvedParams.specialty || undefined,
    minFee: resolvedParams.minFee ? Number(resolvedParams.minFee) : undefined,
    maxFee: resolvedParams.maxFee ? Number(resolvedParams.maxFee) : undefined,
    sortBy:
      (resolvedParams.sortBy as "latest" | "rating" | "fee" | "experience") ||
      "latest",
    page: resolvedParams.page ? Number(resolvedParams.page) : 1,
    limit: 6,
  };

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: doctorKeys.list(queryParams),
      queryFn: () => getDoctorsServer(queryParams),
    }),
    queryClient.prefetchQuery({
      queryKey: doctorKeys.specialties(),
      queryFn: () => getSpecialtiesServer(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="w-full min-h-screen flex items-center justify-center bg-background">
            <div className="flex items-center gap-3 text-sm font-semibold text-primary">
              <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span>Loading Doctors Directory...</span>
            </div>
          </div>
        }
      >
        <DoctorList />
      </Suspense>
    </HydrationBoundary>
  );
}
