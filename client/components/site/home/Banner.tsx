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
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3.5 py-1 border border-primary/30 text-xs font-semibold uppercase tracking-wider text-blue-300 shadow-xs backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          <span>Trusted Online Healthcare</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-4 max-w-3xl text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.18] tracking-tight text-white">
          Find the Right Doctor.{" "}
          <span className="text-blue-400 block sm:inline">Get Care From Anywhere.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300 font-normal">
          Discover verified doctors, choose a convenient appointment time, and
          connect through secure online video consultation — all from the comfort of your home.
        </p>

        {/* Centered Search Bar */}
        <div className="mt-7 sm:mt-8 w-full max-w-2xl">
          <SearchBar />
        </div>

        {/* Trust Badges */}
        <ul className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-7 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/10 px-5 py-3 shadow-xs">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-medium text-slate-200">
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
