"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveIcon } from "@/features/cms";
import type { SpecialtyItem } from "@/features/cms";

interface SpecialtySliderProps {
  items: SpecialtyItem[];
}

export function SpecialtySlider({ items }: SpecialtySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = sliderRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement | null;
    const step = firstCard ? firstCard.offsetWidth + 20 : 320;
    container.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-w-0 lg:col-span-8">
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scroll-smooth px-1 pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <div
              key={`${item.slug}-${item.title}`}
              className="flex min-w-[270px] max-w-[290px] shrink-0 snap-start flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-secondary-text">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 border-t border-border/70 pt-3">
                <Link
                  href={`/doctors?specialty=${encodeURIComponent(item.slug)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  <span>View doctors</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll specialties left"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll specialties right"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default SpecialtySlider;
