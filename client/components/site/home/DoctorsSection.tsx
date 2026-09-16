"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, Award, ChevronRight } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviewsCount: number;
  image: string;
}

const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Fletcher Waelchi",
    specialty: "General Medicine",
    hospital: "Central Health Hospital",
    rating: 4.9,
    reviewsCount: 142,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-2",
    name: "Dr. Fredrick Auer",
    specialty: "Orthopedics",
    hospital: "City Orthopedic Institute",
    rating: 4.8,
    reviewsCount: 98,
    image:
      "https://images.unsplash.com/photo-1594824813590-7892f3922f3f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-3",
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    hospital: "Metropolitan Heart Center",
    rating: 5.0,
    reviewsCount: 215,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-4",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    hospital: "Apex Neuro Care",
    rating: 4.9,
    reviewsCount: 167,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-5",
    name: "Dr. Amanda Miller",
    specialty: "Pediatrics",
    hospital: "Sunshine Children's Clinic",
    rating: 4.9,
    reviewsCount: 180,
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  },
];

export const DoctorsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll every 3 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-surface py-14 sm:py-16 lg:py-20 border-b border-border/70 overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Eyebrow, Heading, Description, CTA, Controls */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3.5 py-1.5 border border-primary/20 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Our Doctors</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-[1.18] tracking-tight text-foreground">
              Our Best Doctor And{" "}
              <span className="text-primary">Quite Popular Medicine</span>
            </h2>

            {/* Description */}
            <p className="text-[15.5px] sm:text-base leading-relaxed text-secondary-text">
              Connect directly with verified specialists across top medical disciplines.
              Get personalized consultations, digital prescriptions, and expert care.
            </p>

            {/* CTA + Navigation Arrows */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white px-7 py-2.5 text-sm sm:text-[15px] font-semibold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-primary/20 group"
              >
                <span>More About Us</span>
                <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  aria-label="Scroll doctors left"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-xs active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  aria-label="Scroll doctors right"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-xs active:scale-95"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Asymmetric Curved Doctor Cards Carousel */}
          <div
            className="lg:col-span-8 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <div
              ref={scrollContainerRef}
              className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth pb-4 pt-1 no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {DOCTORS.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group shrink-0 w-[260px] sm:w-[280px] flex flex-col rounded-tl-[36px] rounded-br-[36px] rounded-tr-[16px] rounded-bl-[16px] border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                >
                  {/* Doctor Image Container */}
                  <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-muted/40">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="280px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Verified Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-card/90 backdrop-blur-md px-2.5 py-1 border border-border/60 shadow-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-foreground">
                        {doctor.rating}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Info Box */}
                  <div className="p-4 sm:p-5 text-center flex flex-col items-center justify-center">
                    <h3 className="text-base sm:text-[17px] font-bold text-foreground group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-text font-medium mt-1">
                      {doctor.specialty}
                    </p>
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
