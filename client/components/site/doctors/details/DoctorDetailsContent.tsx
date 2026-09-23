"use client";

import React from "react";
import Link from "next/link";
import { useDoctorDetails, useDoctorAvailability } from "@/features/doctors";
import { DoctorHeroCard } from "@/components/site/doctors/details/DoctorHeroCard";
import { DoctorAboutSection } from "@/components/site/doctors/details/DoctorAboutSection";
import { DoctorReviewsSection } from "@/components/site/doctors/details/DoctorReviewsSection";
import { DoctorBookingSidebar } from "@/components/site/doctors/details/DoctorBookingSidebar";
import type { DayItem } from "@/features/appointments/components/booking/BookingDateStrip";
import { ChevronRight, ArrowLeft, Stethoscope } from "lucide-react";

interface DoctorDetailsContentProps {
  idOrSlug: string;
  /**
   * Server-built bookable-day strip. Generated inside `buildBookingDateStrip()`
   * so the booking widget renders identically on both passes.
   */
  bookingDays: DayItem[];
}

export const DoctorDetailsContent: React.FC<DoctorDetailsContentProps> = ({
  idOrSlug,
  bookingDays,
}) => {
  const { data: doctor, isLoading } = useDoctorDetails(idOrSlug);
  const { data: apiAvailability, isLoading: isAvailLoading } = useDoctorAvailability(idOrSlug);

  const availabilities =
    apiAvailability && apiAvailability.length > 0
      ? apiAvailability
      : doctor?.availabilities || [];

  if (isLoading) {
    return (
      <div className="w-full bg-background min-h-screen">
        <div className="container-page py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="h-64 rounded-xl border border-border bg-muted/50 animate-pulse" />
              <div className="h-96 rounded-xl border border-border bg-muted/50 animate-pulse" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-[500px] rounded-xl border border-border bg-muted/50 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="w-full bg-background min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4 rounded-xl border border-border bg-card p-8">
          <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Stethoscope className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Doctor not found</h2>
          <p className="text-sm text-secondary-text">
            The requested doctor profile could not be found or may no longer be active.
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to doctors directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const doctorName =
    doctor.user?.name ||
    `${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`.trim() ||
    "Dr. Specialist";

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Top Breadcrumb Bar */}
      <div className="w-full border-b border-border/60 bg-muted/30 py-4">
        <div className="container-page flex items-center justify-between">
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
      <div className="container-page py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Hero Card, About & Reviews */}
          <div className="lg:col-span-8 space-y-8">
            <DoctorHeroCard doctor={doctor} />
            <DoctorAboutSection doctor={doctor} />
            <DoctorReviewsSection doctor={doctor} />
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <DoctorBookingSidebar
              doctor={doctor}
              availabilities={availabilities}
              isLoading={isAvailLoading && availabilities.length === 0}
              days={bookingDays}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsContent;
