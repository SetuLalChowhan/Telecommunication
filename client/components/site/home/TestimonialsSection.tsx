"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Irene Strong",
    quote:
      "Booking an appointment and consulting online was so simple and fast. The doctor was attentive, thorough, and provided clear guidance.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "t-2",
    name: "Jonas Kakaroto",
    quote:
      "The video consultation gave me peace of mind without having to travel or wait in line. High definition video call and instant digital prescription.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "t-3",
    name: "Sarah Jenkins",
    quote:
      "Exceptional telehealth care. Being able to connect directly with specialized doctors anytime has transformed my family's routine health management.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-surface py-14 sm:py-16 lg:py-20 border-b border-border/70 overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        
        {/* Centered Header with Pill Badge */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3 flex flex-col items-center">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 border border-primary/20 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>Testimonials</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-foreground">
            What does our customer say?
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-secondary-text max-w-lg mx-auto leading-relaxed">
            Real feedback from patients and families who experienced fast, reliable, and compassionate virtual care.
          </p>
        </div>

        {/* Minimal Cards Row */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col items-center text-center rounded-2xl sm:rounded-3xl bg-card border border-border/80 p-7 sm:p-8 shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300"
              >
                {/* Circular Avatar with Soft Shadow */}
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-card shadow-lg shadow-slate-900/10 mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Author Name */}
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-3">
                  {item.name}
                </h3>

                {/* Quote Text */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-secondary-text">
                  “{item.quote}”
                </p>
              </div>
            ))}
          </div>

          {/* Minimal Pagination Indicator Dots with Ring */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              type="button"
              onClick={() => setActiveIndex(0)}
              aria-label="Slide 1"
              className={`transition-all duration-200 rounded-full ${
                activeIndex === 0
                  ? "h-3.5 w-3.5 bg-primary ring-3 ring-primary/25 ring-offset-2"
                  : "h-2 w-2 bg-muted-foreground/30 hover:bg-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveIndex(1)}
              aria-label="Slide 2"
              className={`transition-all duration-200 rounded-full ${
                activeIndex === 1
                  ? "h-3.5 w-3.5 bg-primary ring-3 ring-primary/25 ring-offset-2"
                  : "h-2 w-2 bg-muted-foreground/30 hover:bg-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveIndex(2)}
              aria-label="Slide 3"
              className={`transition-all duration-200 rounded-full ${
                activeIndex === 2
                  ? "h-3.5 w-3.5 bg-primary ring-3 ring-primary/25 ring-offset-2"
                  : "h-2 w-2 bg-muted-foreground/30 hover:bg-primary/50"
              }`}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
