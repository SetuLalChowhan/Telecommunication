"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    name: "Irene Strong",
    role: "Verified Patient",
    quote:
      "Booking an appointment and consulting online was so simple and fast. The doctor was attentive, thorough, and provided clear guidance.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "t-2",
    name: "Jonas Kakaroto",
    role: "Verified Patient",
    quote:
      "The video consultation gave me peace of mind without having to travel or wait in line. High definition video call and instant digital prescription.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "t-3",
    name: "Maddison Reichel",
    role: "Verified Patient",
    quote:
      "Exceptional telehealth care. Being able to connect directly with specialized doctors anytime has transformed my family's routine health management.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-background py-14 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        
        {/* Centered Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4 sm:space-y-5 flex flex-col items-center">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
            Patient Stories
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
            What Our Patients Say
          </h2>

          <p className="text-sm sm:text-[15px] text-secondary-text max-w-lg mx-auto leading-relaxed">
            Real feedback from patients who experienced fast, reliable, and compassionate virtual medical care.
          </p>
        </div>

        {/* Minimal Cards Row */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col items-center text-center rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Circular Avatar */}
                <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border shadow-xs mb-3.5 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Author Name */}
                <h3 className="text-base font-bold text-foreground">
                  {item.name}
                </h3>
                <span className="text-xs text-secondary-text mb-3">
                  {item.role}
                </span>

                {/* Quote Text */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-secondary-text">
                  “{item.quote}”
                </p>
              </div>
            ))}
          </div>

          {/* Minimal Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => setActiveIndex(0)}
              aria-label="Slide 1"
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                activeIndex === 0
                  ? "h-2.5 w-6 bg-primary"
                  : "h-2.5 w-2.5 bg-muted-foreground/30 hover:bg-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveIndex(1)}
              aria-label="Slide 2"
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                activeIndex === 1
                  ? "h-2.5 w-6 bg-primary"
                  : "h-2.5 w-2.5 bg-muted-foreground/30 hover:bg-primary/50"
              }`}
            />
            <button
              type="button"
              onClick={() => setActiveIndex(2)}
              aria-label="Slide 3"
              className={`transition-all duration-200 rounded-full cursor-pointer ${
                activeIndex === 2
                  ? "h-2.5 w-6 bg-primary"
                  : "h-2.5 w-2.5 bg-muted-foreground/30 hover:bg-primary/50"
              }`}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
