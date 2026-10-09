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
      <div className="container-page grid grid-cols-1 items-center gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-14 lg:py-24">
        {/* Left: value proposition + search */}
        <div className="flex flex-col items-start space-y-6 text-left lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-[30px] border border-border bg-[#dddcdd]/60 px-4 py-1 text-xs font-medium tracking-[0.24px] text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
            {hero.badge}
          </span>

          <h1 className="max-w-2xl text-4xl font-normal leading-[1.08] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.5rem]">
            {hero.title.includes("Doctor") ? (
              <>
                {hero.title.split("Doctor")[0]}
                <span className="text-[#97cde5]">Doctor</span>
                {hero.title.split("Doctor")[1]}
              </>
            ) : hero.title.includes("Healthcare") ? (
              <>
                {hero.title.split("Healthcare")[0]}
                <span className="text-[#97cde5]">Healthcare</span>
                {hero.title.split("Healthcare")[1]}
              </>
            ) : (
              <span>
                {hero.title}{" "}
                <span className="text-[#97cde5]">Online</span>
              </span>
            )}
          </h1>

          <p className="max-w-xl text-[17px] leading-relaxed text-secondary-text sm:text-[18px]">
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
                  <Icon className="h-4 w-4 shrink-0 text-foreground/80" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              );
            })}
          </ul>

          <Link
            href={hero.ctaLink}
            className="group inline-flex items-center justify-center rounded-[100px] bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-all hover:brightness-95"
          >
            <span>{hero.ctaText}</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Right: Cream Product Stage container */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="relative aspect-[4/3.4] w-full rounded-[24px] bg-[#f3f1eb] p-3 border border-border/80">
            <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-border/60 bg-card">
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
      </div>
    </section>
  );
};

export default Banner;
