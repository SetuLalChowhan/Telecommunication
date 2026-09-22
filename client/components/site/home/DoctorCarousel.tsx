"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Star, Stethoscope } from "lucide-react";
import type { DoctorProfile } from "@/features/doctors";

interface DoctorCarouselProps {
  doctors: DoctorProfile[];
}

function displayName(doctor: DoctorProfile): string {
  const name =
    doctor.user?.name ||
    [doctor.user?.firstName, doctor.user?.lastName].filter(Boolean).join(" ");
  return name || "Doctor";
}

function displaySpecialty(doctor: DoctorProfile): string {
  return (
    doctor.mainSpecialty?.name ||
    doctor.specialties?.[0]?.specialty?.name ||
    doctor.designation ||
    "General physician"
  );
}

function displayDegrees(doctor: DoctorProfile): string {
  const degrees = (doctor.qualifications ?? [])
    .map((q) => q.degree)
    .filter(Boolean)
    .slice(0, 3);

  if (degrees.length > 0) return degrees.join(", ");
  return doctor.designation || doctor.hospitalAffiliation || "Verified specialist";
}

export function DoctorCarousel({ doctors }: DoctorCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 20 : 300;
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  if (doctors.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Doctor profiles are loading. Please check back in a moment.
      </p>
    );
  }

  return (
    <div>
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {doctors.map((doctor) => {
          const name = displayName(doctor);
          const image = doctor.user?.image ?? null;
          const rating = Number(doctor.rating ?? 0);
          const reviews = Number(doctor.totalReviews ?? 0);

          return (
            <div
              key={doctor.id}
              className="group flex w-[260px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-muted">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="260px"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Stethoscope className="absolute inset-0 m-auto h-10 w-10 text-muted-foreground" />
                )}

                {rating > 0 && (
                  <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-foreground">
                      {rating.toFixed(1)}
                    </span>
                    {reviews > 0 && (
                      <span className="text-[10px] text-muted-foreground">({reviews})</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-semibold text-primary">
                    {displaySpecialty(doctor)}
                  </span>
                  <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    <Link href={`/doctors/${doctor.slug || doctor.id}`}>{name}</Link>
                  </h3>
                  <p className="truncate text-[11px] text-secondary-text">
                    {displayDegrees(doctor)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-2.5">
                  <div>
                    <span className="block text-[10px] uppercase text-muted-foreground">
                      Fee
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      ৳{doctor.fee}
                    </span>
                  </div>
                  <Link
                    href={`/doctors/${doctor.slug || doctor.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Consult
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Scroll doctors left"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Scroll doctors right"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default DoctorCarousel;
