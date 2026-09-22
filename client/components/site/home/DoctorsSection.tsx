import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import DoctorCarousel from "./DoctorCarousel";
import { resolveDoctors } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";
import { getDoctorsServer } from "@/features/doctors/api/server";

/**
 * "Consult with verified doctors" — the home page's live specialist strip.
 *
 * Content copy comes from the CMS (`home_doctors`), the doctors themselves come
 * from the public doctors API sorted by rating. Nothing here is hard-coded.
 */
const DoctorsSection = async () => {
  const store = await getCmsSectionsServer();
  const content = resolveDoctors(store);

  const { data: doctors } = await getDoctorsServer({
    limit: content.limit,
    page: 1,
    sortBy: "rating",
  });

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

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={content.ctaLink}
                className="group inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
              >
                <span>{content.ctaText}</span>
                <ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/consult"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                How consultation works
              </Link>
            </div>
          </div>

          {/* Doctor cards */}
          <div className="min-w-0 lg:col-span-8">
            <DoctorCarousel doctors={doctors} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;
