"use client";

import React from "react";
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
    name: "Mohammad Rafiqul Islam",
    role: "Patient · Mirpur, Dhaka",
    quote:
      "Consulting Dr. Sarah online saved me hours in Dhaka traffic. The video call was crystal clear, she reviewed my ECG reports instantly, and sent the e-prescription right to my portal.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "t-2",
    name: "Nusrat Jahan",
    role: "Patient · Dhanmondi, Dhaka",
    quote:
      "When my child had a sudden high fever at night, getting an immediate pediatric consultation was a lifesaver. The doctor was patient, caring, and guided us every step of the way.",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "t-3",
    name: "Tanvir Ahmed",
    role: "Patient · Chittagong",
    quote:
      "Living outside Dhaka often makes accessing top specialists difficult. This platform connected me directly with leading physicians from national institutes without any hassle.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full border-b border-border/60 bg-background py-16 sm:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="max-w-2xl mb-10 sm:mb-12 space-y-4">
          <span className="eyebrow-text block text-primary">Patient stories</span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
            What our patients say
          </h2>
          <p className="text-sm text-secondary-text leading-relaxed">
            Feedback from patients who experienced fast, reliable, and compassionate virtual care.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <blockquote className="text-sm leading-relaxed text-body">
                “{item.quote}”
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-border/70 pt-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                  <Image src={item.avatar} alt={item.name} fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
