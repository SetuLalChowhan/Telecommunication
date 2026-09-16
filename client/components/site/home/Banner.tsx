import React from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CalendarCheck,
  FileText,
  Video,
} from "lucide-react";
import SearchBar from "./SearchBar";
import heroImage from "@/assets/images/HeroImage2.jpg";

const TRUST_ITEMS = [
  { icon: BadgeCheck, label: "Verified Doctors" },
  { icon: CalendarCheck, label: "Easy Online Booking" },
  { icon: Video, label: "Video Consultation" },
  { icon: FileText, label: "Medical Reports" },
];

const Banner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 min-h-[calc(100vh-4.5rem)] sm:min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 sm:py-16 lg:py-20">
      {/* Background Image with Simple Black Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Telemedicine healthcare background"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[78%_center] opacity-45  transition-transform duration-1000"
        />
        {/* Simple black gradient overlay */}
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
      </div>

      {/* Centered Content Container */}
      <div className="relative z-10 max-w-[1920px] mx-auto section-padding-x flex flex-col items-center text-center w-full">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 border border-primary/30 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-300 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Trusted Online Healthcare</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-5 max-w-4xl text-[2.25rem] font-extrabold leading-[1.14] tracking-tight text-white sm:text-[3rem] md:text-[3.5rem] lg:text-[3.85rem]">
          Find the Right Doctor.{" "}
          <span className="text-blue-400 block sm:inline">Get Care From Anywhere.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 max-w-2xl text-[15.5px] sm:text-lg leading-relaxed text-slate-300 font-normal">
          Discover verified doctors, choose a convenient appointment time, and
          connect through secure online video consultation — all from the comfort of your home.
        </p>

        {/* Centered Search Bar */}
        <div className="mt-8 sm:mt-10 w-full max-w-2xl">
          <SearchBar />
        </div>

        {/* Trust Badges */}
        <ul className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 px-6 py-3.5 shadow-lg">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4.5 w-4.5 shrink-0 text-blue-400" aria-hidden="true" />
              <span className="text-xs sm:text-[13.5px] font-semibold text-slate-200">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Banner;
