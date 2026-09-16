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
    slug: "Dentistry",
  },
  {
    icon: Brain,
    title: "Mental Health Solutions",
    description: "Confidential therapy, depression management, anxiety counseling, and psychiatric wellness.",
    slug: "Mental Health",
  },
  {
    icon: HeartPulse,
    title: "Cardiology Care",
    description: "Expert cardiology consultations, blood pressure monitoring, ECG reviews, and cardiac care.",
    slug: "Cardiology",
  },
  {
    icon: Baby,
    title: "Pediatric Care",
    description: "Comprehensive medical guidance and wellness consultations for infants, kids, and teenagers.",
    slug: "Pediatrics",
  },
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Routine checkups, fever treatment, chronic disease management, and digital prescriptions.",
    slug: "General Medicine",
  },
  {
    icon: Eye,
    title: "Ophthalmology & Eye",
    description: "Virtual eye strain diagnosis, infection triage, and vision correction recommendations.",
    slug: "Ophthalmology",
  },
  {
    icon: Bone,
    title: "Orthopedic & Joint Care",
    description: "Rehabilitation advice and diagnosis for arthritis, spinal pain, sports injuries, and posture.",
    slug: "Orthopedics",
  },
  {
    icon: ShieldAlert,
    title: "Urgent Care & Triage",
    description: "Immediate triage and symptom checks for urgent medical issues requiring fast attention.",
    slug: "Emergency Medicine",
  },
];

export const SpecialtiesSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  const getStep = () => {
    if (!sliderRef.current) return 334;
    const firstCard = sliderRef.current.firstElementChild as HTMLElement;
    return firstCard ? firstCard.offsetWidth + 24 : 334;
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-background py-14 sm:py-16 lg:py-20 border-b border-border/70 overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Header & Controls */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              {/* Eyebrow */}
              <span className="text-sm font-semibold tracking-wide text-primary">
                Features
              </span>

              {/* Heading */}
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.18] tracking-tight text-foreground">
                Think Hard And Focus On The Patient’s Well-Being
              </h2>

              {/* Description */}
              <p className="mt-5 text-[15px] sm:text-base leading-relaxed text-secondary-text">
                Explore verified medical specialists across essential healthcare disciplines.
                Get timely diagnoses and secure video follow-ups from the comfort of your home.
              </p>
            </div>

            {/* Bottom Actions: Pill CTA + Left/Right Arrow Navigation */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border-2 border-primary/80 text-primary hover:bg-primary hover:text-white px-6 py-2.5 text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-primary/20"
              >
                More About Us
              </Link>

              {/* Slider Arrow Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  aria-label="Previous specialty"
                  className="h-10 w-10 rounded-full border border-border/90 bg-card hover:border-primary hover:text-primary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer text-foreground/80"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  aria-label="Next specialty"
                  className="h-10 w-10 rounded-full border border-border/90 bg-card hover:border-primary hover:text-primary flex items-center justify-center transition-all shadow-xs active:scale-95 cursor-pointer text-foreground/80"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
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
              className="flex gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SPECIALTIES.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group relative flex flex-col justify-between rounded-tl-[36px] rounded-br-[36px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card p-7 sm:p-8 min-w-[280px] sm:min-w-[310px] max-w-[320px] shrink-0 snap-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-slate-900/[0.05]"
                  >
                    {/* Top: Icon + Title + Description */}
                    <div>
                      {/* Icon */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                        <IconComponent className="h-7 w-7 stroke-[1.5]" />
                      </div>

                      {/* Title */}
                      <h3 className="mt-6 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-[14px] leading-relaxed text-secondary-text">
                        {item.description}
                      </p>
                    </div>

                    {/* Bottom: Explore More Link */}
                    <div className="mt-8 pt-4 border-t border-border/50">
                      <Link
                        href={`/doctors?specialty=${encodeURIComponent(item.slug)}`}
                        className="inline-flex items-center text-sm font-semibold text-foreground hover:text-primary transition-all gap-1.5 group-hover:text-primary"
                      >
                        <span>Explore More</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
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
