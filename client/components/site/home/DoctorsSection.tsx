"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, ChevronRight } from "lucide-react";

interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  fee: number;
  degrees: string;
  image: string;
}

const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    slug: "dr-sarah-jenkins",
    name: "Dr. Sarah Ahmed",
    specialty: "Cardiology & Hypertension",
    rating: 4.9,
    reviewsCount: 215,
    fee: 1200,
    degrees: "MBBS, FCPS (Cardiology)",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-2",
    slug: "dr-fletcher-waelchi",
    name: "Dr. Farhana Rahman",
    specialty: "General Medicine & Diabetes",
    rating: 4.9,
    reviewsCount: 184,
    fee: 1000,
    degrees: "MBBS, MRCP (UK)",
    image:
      "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-3",
    slug: "dr-fredrick-auer",
    name: "Dr. Tanvir Anis",
    specialty: "Orthopedics & Spine",
    rating: 4.8,
    reviewsCount: 128,
    fee: 1200,
    degrees: "MBBS, MS (Ortho)",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-4",
    slug: "dr-michael-chen",
    name: "Dr. Asif Mahmud",
    specialty: "Neurology",
    rating: 5.0,
    reviewsCount: 190,
    fee: 1500,
    degrees: "MBBS, MD (Neurology)",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-5",
    slug: "dr-amanda-miller",
    name: "Dr. Nusrat Jahan",
    specialty: "Pediatrics & Child Care",
    rating: 4.9,
    reviewsCount: 172,
    fee: 1000,
    degrees: "MBBS, DCH, FCPS",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  },
];

export const DoctorsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll every 3.5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-background py-14 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Eyebrow, Heading, Description, CTA, Controls */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
            <div className="space-y-4 sm:space-y-5">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
                Top Specialists
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground">
                Consult with Verified Doctors
              </h2>

              <p className="text-sm sm:text-[15px] leading-relaxed text-secondary-text">
                Connect directly with verified specialists across medical disciplines.
                Get personalized video consultations, digital prescriptions, and expert care.
              </p>
            </div>

            {/* CTA + Navigation Arrows */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white px-5 py-2.5 text-sm font-semibold transition-all shadow-xs group"
              >
                <span>Browse All Doctors</span>
                <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  aria-label="Scroll doctors left"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  aria-label="Scroll doctors right"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Doctor Cards Carousel */}
          <div
            className="lg:col-span-8 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-3 pt-1 no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {DOCTORS.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group shrink-0 w-[250px] sm:w-[270px] flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/50 hover:shadow-subtle transition-all duration-200"
                >
                  {/* Doctor Image Container */}
                  <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="270px"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-103"
                    />

                    {/* Minimal Rating Chip */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-card/95 backdrop-blur-md px-2.5 py-0.5 border border-border shadow-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-foreground">
                        {doctor.rating}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        ({doctor.reviewsCount})
                      </span>
                    </div>
                  </div>

                  {/* Doctor Info Box */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div className="space-y-1 text-left">
                      <span className="inline-block text-[11px] font-semibold text-primary">
                        {doctor.specialty}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/doctors/${doctor.slug}`}>
                          {doctor.name}
                        </Link>
                      </h3>
                      <p className="text-[11px] text-secondary-text truncate">
                        {doctor.degrees}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-border/70 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground block uppercase">Fee</span>
                        <span className="text-xs sm:text-sm font-bold text-foreground">৳{doctor.fee}</span>
                      </div>
                      <Link
                        href={`/doctors/${doctor.slug}`}
                        className="inline-flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                      >
                        Consult
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
