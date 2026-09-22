import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { resolveTestimonials } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";

const TestimonialsSection = async () => {
  const store = await getCmsSectionsServer();
  const content = resolveTestimonials(store);

  if (content.items.length === 0) return null;

  return (
    <section className="w-full border-b border-border/60 bg-background py-16 sm:py-20">
      <div className="container-page">
        {/* Header */}
        <div className="mb-10 max-w-2xl space-y-4 sm:mb-12">
          <span className="eyebrow-text block text-primary">{content.badge}</span>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
            {content.title}
          </h2>
          <p className="text-sm leading-relaxed text-secondary-text">
            {content.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <figure
              key={`${item.name}-${index}`}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <Quote className="h-5 w-5 text-primary/40" aria-hidden="true" />

              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-body">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-border/70 pt-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                  {item.avatar && (
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{item.role}</p>
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
