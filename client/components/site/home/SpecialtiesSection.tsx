import React from "react";
import Link from "next/link";
import SpecialtySlider from "./SpecialtySlider";
import { resolveSpecialties } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";

const SpecialtiesSection = async () => {
  const store = await getCmsSectionsServer();
  const content = resolveSpecialties(store);

  return (
    <section className="w-full border-b border-border/60 bg-background py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="space-y-4">
              <span className="eyebrow-text block text-primary">{content.badge}</span>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                {content.title}
              </h2>
              <p className="text-sm leading-relaxed text-secondary-text">
                {content.subtitle}
              </p>
            </div>

            <div>
              <Link
                href={content.ctaLink}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                {content.ctaText}
              </Link>
            </div>
          </div>

          {/* Slider */}
          <SpecialtySlider items={content.items} />
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
