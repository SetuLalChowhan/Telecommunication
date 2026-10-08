import React from "react";
import Link from "next/link";
import SpecialtySlider from "./SpecialtySlider";
import { resolveSpecialties } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";

const SpecialtiesSection = async () => {
  const store = await getCmsSectionsServer();
  const content = resolveSpecialties(store);

  return (
    <section className="w-full border-b border-border/60 bg-[#f3f1eb] py-16 sm:py-24">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Header */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-[30px] border border-border bg-white px-3.5 py-1 text-xs font-medium tracking-[0.24px] text-foreground">
                {content.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal leading-tight tracking-[-0.03em] text-foreground">
                {content.title}
              </h2>
              <p className="text-sm leading-relaxed text-secondary-text">
                {content.subtitle}
              </p>
            </div>

            <div>
              <Link
                href={content.ctaLink}
                className="inline-flex items-center justify-center rounded-[100px] bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:brightness-95"
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
