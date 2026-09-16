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
  const isHoveredRef = useRef(false);

  const getStep = () => {
    if (!sliderRef.current) return 320;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement;
    return firstCard ? firstCard.offsetWidth + 20 : 320;
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const step = getStep();
      
      if (direction === "right") {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: step, behavior: "smooth" });
        }
      } else {
        if (container.scrollLeft <= 15) {
          container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
        } else {
          container.scrollBy({ left: -step, behavior: "smooth" });
        }
      }
    }
  };

  // Smooth Auto-sliding effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isHoveredRef.current && sliderRef.current) {
        const container = sliderRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const step = getStep();

        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: step, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-background py-14 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Header & Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            <div className="space-y-4 sm:space-y-5">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
                Medical Specialties
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground">
                Dedicated Care for Every Health Need
              </h2>

              <p className="text-sm sm:text-[15px] leading-relaxed text-secondary-text">
                Explore verified medical specialists across essential healthcare disciplines.
                Get timely diagnoses and secure video follow-ups from the comfort of your home.
              </p>
            </div>

            {/* Actions: CTA + Left/Right Arrow Navigation */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-sm font-semibold transition-all shadow-xs"
              >
                Find Specialists
              </Link>

              {/* Slider Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Previous specialty"
                  className="h-10 w-10 rounded-xl border border-border bg-card hover:border-primary hover:text-primary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Next specialty"
                  className="h-10 w-10 rounded-xl border border-border bg-card hover:border-primary hover:text-primary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer text-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Horizontal Slider Cards */}
          <div className="lg:col-span-8 min-w-0">
            <div
              ref={sliderRef}
              onMouseEnter={() => { isHoveredRef.current = true; }}
              onMouseLeave={() => { isHoveredRef.current = false; }}
              onTouchStart={() => { isHoveredRef.current = true; }}
              onTouchEnd={() => { isHoveredRef.current = false; }}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-3 pt-1 px-1 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SPECIALTIES.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7 min-w-[270px] sm:min-w-[290px] max-w-[300px] shrink-0 snap-start shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md"
                  >
                    <div>
                      {/* Icon */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                        <IconComponent className="h-6 w-6 stroke-[1.75]" />
                      </div>

                      {/* Title */}
                      <h3 className="mt-5 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-secondary-text">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom: Explore Link */}
                    <div className="mt-6 pt-3 border-t border-border">
                      <Link
                        href={`/doctors?specialty=${encodeURIComponent(item.slug)}`}
                        className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark transition-all gap-1.5"
                      >
                        <span>View Doctors</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
