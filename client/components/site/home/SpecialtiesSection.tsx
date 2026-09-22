"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  ShieldAlert,
  Bone,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Smile,
  Eye,
} from "lucide-react";

interface SpecialtyItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  slug: string;
}

const SPECIALTIES: SpecialtyItem[] = [
  {
    icon: Smile,
    title: "Emergency Dentistry",
    description: "Instant video consultation and triage for acute toothaches, dental trauma, and prescriptions.",
    slug: "dentistry",
  },
  {
    icon: Brain,
    title: "Mental Health",
    description: "Confidential therapy, depression management, anxiety counseling, and psychiatric wellness.",
    slug: "neurology",
  },
  {
    icon: HeartPulse,
    title: "Cardiology Care",
    description: "Expert cardiology consultations, blood pressure monitoring, ECG reviews, and cardiac care.",
    slug: "cardiology",
  },
  {
    icon: Baby,
    title: "Pediatric Care",
    description: "Comprehensive medical guidance and wellness consultations for infants, kids, and teenagers.",
    slug: "pediatrics",
  },
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Routine checkups, fever treatment, chronic disease management, and digital prescriptions.",
    slug: "general-medicine",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Virtual eye strain diagnosis, infection triage, and vision correction recommendations.",
    slug: "ophthalmology",
  },
  {
    icon: Bone,
    title: "Orthopedic & Joint",
    description: "Rehabilitation advice and diagnosis for arthritis, spinal pain, sports injuries, and posture.",
    slug: "orthopedics",
  },
  {
    icon: ShieldAlert,
    title: "Urgent Care Triage",
    description: "Immediate triage and symptom checks for urgent medical issues requiring fast attention.",
    slug: "general-medicine",
  },
];

export const SpecialtiesSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = sliderRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 20 : 320;
    container.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className="w-full border-b border-border/60 bg-background py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Header & controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="space-y-4">
              <span className="eyebrow-text block text-primary">Medical specialties</span>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-foreground">
                Dedicated care for every health need
              </h2>
              <p className="text-sm leading-relaxed text-secondary-text">
                Explore verified medical specialists across essential healthcare disciplines. Get
                timely diagnoses and secure video follow-ups from the comfort of your home.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Find specialists
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Scroll specialties left"
                  className="h-10 w-10 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Scroll specialties right"
                  className="h-10 w-10 rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal slider */}
          <div className="lg:col-span-8 min-w-0">
            <div
              ref={sliderRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-3 pt-1 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SPECIALTIES.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 min-w-[270px] max-w-[290px] shrink-0 snap-start transition-colors hover:border-primary/40"
                  >
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-secondary-text">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border/70">
                      <Link
                        href={`/doctors?specialty=${encodeURIComponent(item.slug)}`}
                        className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary-dark transition-colors gap-1.5"
                      >
                        <span>View doctors</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
