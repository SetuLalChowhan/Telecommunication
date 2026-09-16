"use client";

import React, { use } from "react";
import Link from "next/link";
import { MOCK_DOCTORS } from "@/constants/mockDoctors";
import { DoctorHeroCard } from "@/components/site/doctors/details/DoctorHeroCard";
import { DoctorAboutSection } from "@/components/site/doctors/details/DoctorAboutSection";
import { DoctorReviewsSection } from "@/components/site/doctors/details/DoctorReviewsSection";
import { DoctorBookingSidebar } from "@/components/site/doctors/details/DoctorBookingSidebar";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface DoctorDetailsPageProps {
  params: Promise<{ idOrSlug: string }>;
}

export default function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const resolvedParams = use(params);
  const idOrSlug = resolvedParams.idOrSlug;

  // Find doctor from mock dataset by ID or Slug (fallback to first doctor if not found)
  const doctor =
    MOCK_DOCTORS.find(
      (d) =>
        d.id === idOrSlug ||
        d.slug === idOrSlug ||
        d.slug?.toLowerCase() === idOrSlug.toLowerCase()
    ) || MOCK_DOCTORS[0];

  const availabilities = doctor.availabilities || [];

  const doctorName =
    doctor.user.name ||
    `${doctor.user.firstName || ""} ${doctor.user.lastName || ""}`.trim() ||
    "Dr. Specialist";

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="w-full border-b border-border/70 bg-slate-50/70 dark:bg-slate-900/30 py-4">
        <div className="max-w-[1920px] mx-auto section-padding-x flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-secondary-text">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <Link href="/doctors" className="hover:text-primary transition-colors">
              Doctors
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground font-semibold truncate max-w-[180px] sm:max-w-none">
              {doctorName}
            </span>
          </nav>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to directory</span>
          </Link>
        </div>
      </div>

      {/* Main Doctor Profile & Booking Grid */}
      <div className="max-w-[1920px] mx-auto section-padding-x py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Hero Card, About & Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Top Doctor Profile Summary Card */}
            <DoctorHeroCard doctor={doctor} />

            {/* About & Clinical Focus Section */}
            <DoctorAboutSection doctor={doctor} />

            {/* Patient Reviews Section */}
            <DoctorReviewsSection doctor={doctor} />
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <DoctorBookingSidebar
              doctor={doctor}
              availabilities={availabilities}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
