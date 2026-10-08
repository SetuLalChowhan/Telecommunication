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
    <section className="relative w-full border-b border-border/60 bg-[#f3f1eb] py-16 sm:py-24 blue-wash">
      <div className="container-page relative z-10">
        {/* Header - Centered Editorial */}
        <div className="mx-auto mb-12 max-w-2xl text-center space-y-4 sm:mb-16">
          <span className="inline-flex items-center rounded-[30px] border border-border bg-white px-3.5 py-1 text-xs font-medium tracking-[0.24px] text-foreground">
            {content.badge}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal leading-tight tracking-[-0.03em] text-foreground">
            What patients say about <span className="text-[#97cde5]">care</span>
          </h2>
          <p className="text-sm leading-relaxed text-secondary-text">
            {content.subtitle}
          </p>
        </div>

        {/* Cards - 16px white cards on cream band */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <figure
              key={`${item.name}-${index}`}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-7 transition-colors hover:border-[#cbcbcb]"
            >
              <blockquote className="font-serif text-[18px] sm:text-[19px] font-normal leading-relaxed text-foreground">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-border/70 pt-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-[#f3f1eb]">
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
                  <p className="truncate text-sm font-medium text-foreground tracking-tight">
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-[#4a4a4c]">{item.role}</p>
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
