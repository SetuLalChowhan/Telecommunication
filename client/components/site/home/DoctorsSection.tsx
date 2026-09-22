"use client";

import React, { useRef } from "react";
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

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="w-full border-b border-border/60 bg-background py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Header & controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="space-y-4">
              <span className="eyebrow-text block text-primary">Top specialists</span>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-foreground">
                Consult with verified doctors
              </h2>
              <p className="text-sm leading-relaxed text-secondary-text">
                Connect directly with verified specialists across medical disciplines. Get
                personalized video consultations, digital prescriptions, and expert care.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2.5 text-sm font-semibold transition-colors group"
              >
                <span>Browse all doctors</span>
                <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  aria-label="Scroll doctors left"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  aria-label="Scroll doctors right"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Doctor cards */}
          <div className="lg:col-span-8 min-w-0">
            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scroll-smooth pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {DOCTORS.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
                >
                  <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-muted">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="260px"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-foreground">{doctor.rating}</span>
                      <span className="text-[10px] text-muted-foreground">({doctor.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-1 flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block text-[11px] font-semibold text-primary">
                        {doctor.specialty}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/doctors/${doctor.slug}`}>{doctor.name}</Link>
                      </h3>
                      <p className="text-[11px] text-secondary-text truncate">{doctor.degrees}</p>
                    </div>

                    <div className="pt-2.5 border-t border-border/70 flex items-center justify-between gap-2">
                      <div>
                        <span className="block text-[10px] uppercase text-muted-foreground">Fee</span>
                        <span className="text-sm font-semibold text-foreground">৳{doctor.fee}</span>
                      </div>
                      <Link
                        href={`/doctors/${doctor.slug}`}
                        className="inline-flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary px-3 py-1.5 text-xs font-semibold text-primary hover:text-primary-foreground transition-colors"
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
