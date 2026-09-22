import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, FileCheck2, ShieldCheck, Video } from "lucide-react";
import SearchBar from "./SearchBar";
import heroImage from "@/assets/images/HeroImage2.jpg";
import { CMS_KEYS, resolveHero, resolveIcon, resolveSectionImage } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";
import { getSpecialtiesServer } from "@/features/doctors/api/server";

const TRUST_ICONS = {
  "BMDC verified doctors": ShieldCheck,
  "Instant slot booking": CalendarCheck,
  "HD video consultations": Video,
  "Digital prescriptions": FileCheck2,
} as const;

const Banner = async () => {
  // Both calls are cached + tagged, and Next dedupes identical fetches within a
  // render pass — so this costs one request each per revalidation window.
  const [store, specialties] = await Promise.all([
    getCmsSectionsServer(),
    getSpecialtiesServer(),
  ]);

  const hero = resolveHero(store);
  const resolvedImage = resolveSectionImage(
    store[CMS_KEYS.homeHero]?.imageUrl,
    heroImage
  );

  return (
    <section className="w-full border-b border-border/60 bg-background">
      <div className="container-page grid grid-cols-1 items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
        {/* Left: value proposition + search */}
        <div className="flex flex-col items-start space-y-6 text-left lg:col-span-7">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {hero.badge}
          </span>

          <h1 className="max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            {hero.title}
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-secondary-text sm:text-base">
            {hero.subtitle}
          </p>

          <div className="w-full max-w-2xl pt-1">
            <SearchBar initialSpecialties={specialties} />
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-xs text-secondary-text sm:text-sm">
            {hero.trustItems.map(({ label, icon }) => {
              const Icon = resolveIcon(
                icon,
                TRUST_ICONS[label as keyof typeof TRUST_ICONS] ?? ShieldCheck
              );
              return (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>

          <Link
            href={hero.ctaLink}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <span>{hero.ctaText}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Right: authentic consultation scene */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="relative aspect-[4/3.4] w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={resolvedImage}
              alt="Doctor consulting a patient online"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[70%_center]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
