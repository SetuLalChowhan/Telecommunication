"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, ChevronRight, Video } from "lucide-react";

interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  image: string;
}

const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    slug: "dr-sarah-jenkins",
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiology",
    rating: 4.9,
    reviewsCount: 215,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-2",
    slug: "dr-fletcher-waelchi",
    name: "Dr. Fletcher Waelchi",
    specialty: "General Medicine",
    rating: 4.9,
    reviewsCount: 184,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-3",
    slug: "dr-fredrick-auer",
    name: "Dr. Fredrick Auer",
    specialty: "Orthopedics",
    rating: 4.8,
    reviewsCount: 128,
    image:
      "https://images.unsplash.com/photo-1594824813590-7892f3922f3f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-4",
    slug: "dr-michael-chen",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    rating: 5.0,
    reviewsCount: 190,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "doc-5",
    slug: "dr-amanda-miller",
    name: "Dr. Amanda Miller",
    specialty: "Pediatrics",
    rating: 4.9,
    reviewsCount: 172,
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
                  className="group shrink-0 w-[250px] sm:w-[270px] flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  {/* Doctor Image Container */}
                  <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-muted/40">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="270px"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-102"
                    />

                    {/* Rating Chip */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-card/95 backdrop-blur-xs px-2 py-0.5 border border-border shadow-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-foreground">
                        {doctor.rating}
                      </span>
                    </div>

                    {/* Online Video Pill */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-card/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-primary border border-border shadow-xs">
                      <Video className="h-3 w-3" />
                      <span>Online Video</span>
                    </div>
                  </div>

                  {/* Doctor Info Box */}
                  <div className="p-4 text-center flex flex-col items-center justify-center">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/doctors/${doctor.slug}`}>
                        {doctor.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-secondary-text font-medium mt-1">
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
