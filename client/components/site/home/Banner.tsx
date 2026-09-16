import React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CalendarCheck,
  FileText,
  Video,
} from "lucide-react";
import SearchBar from "./SearchBar";
import heroImage from "@/assets/images/HeroImage.jpg";

const TRUST_ITEMS = [
  { icon: BadgeCheck, label: "Verified Doctors" },
  { icon: CalendarCheck, label: "Easy Online Booking" },
  { icon: Video, label: "Video Consultation" },
  { icon: FileText, label: "Medical Reports" },
];

const Banner = () => {
  return (
    <section className="bg-background w-full overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x grid grid-cols-1 items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-2 lg:gap-12 lg:pb-20 lg:pt-16 xl:gap-16">
        {/* LEFT: Copy + Doctor discovery (primary action) */}
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3.5 py-1.5 border border-primary/20 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span>Trusted Online Healthcare</span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-[2.1rem] font-bold leading-[1.15] tracking-tight text-foreground sm:text-[2.75rem] lg:text-[3rem] xl:text-[3.35rem]">
            Find the Right Doctor.{" "}
            <span className="text-primary">Get Care From Anywhere.</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-secondary-text sm:text-base">
            Discover verified doctors, choose a convenient appointment time, and
            connect through secure online video consultation — all from the
            comfort of your home.
          </p>

          {/* Doctor search — the hero's primary action */}
          <div className="mt-8 w-full max-w-2xl">
            <SearchBar />
          </div>

          {/* Trust row */}
          <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-8">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-[18px] w-[18px] shrink-0 text-secondary" aria-hidden="true" />
                <span className="text-[13.5px] font-medium text-secondary-text sm:text-sm">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Large authentic telemedicine photography (desktop only) */}
        <div className="order-1 hidden lg:order-2 lg:block">
          <div className="relative aspect-[4/3] xl:aspect-[16/11] w-full overflow-hidden rounded-[28px] border border-border/50 shadow-xl shadow-slate-900/5 bg-muted/20">
            <Image
              src={heroImage}
              alt="A caring doctor consulting a patient through an online video appointment"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1920px) 860px, (min-width: 1280px) 600px, (min-width: 1024px) 50vw, 0px"
              className="object-cover object-[82%_center] transition-transform duration-700 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
