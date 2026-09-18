import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CalendarCheck,
  FileCheck2,
  Video,
} from "lucide-react";
import SearchBar from "./SearchBar";
import heroImage from "@/assets/images/HeroImage2.jpg";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "BMDC Verified Doctors" },
  { icon: CalendarCheck, label: "Instant Slot Booking" },
  { icon: Video, label: "HD Video Consultations" },
  { icon: FileCheck2, label: "Digital Prescriptions" },
];

const Banner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50/60 via-background to-background dark:from-slate-900/30 dark:via-background dark:to-background border-b border-border/60 py-12 sm:py-16 lg:py-20">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-25 dark:opacity-10 pointer-events-none bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Core Value Proposition & Search */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 border border-primary/20 text-xs font-semibold uppercase tracking-wider text-primary shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>BMDC Verified Physicians &bull; 24/7 Care</span>
            </div>

            {/* Hero Title */}
            <h1 className="max-w-2xl text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.16] tracking-tight text-foreground">
              Find Trusted Doctors.{" "}
              <span className="text-primary block sm:inline">Consult Online From Home.</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed text-body font-normal">
              Connect with experienced specialists across Bangladesh for confidential video consultations,
              clinical follow-ups, and instant digital prescriptions.
            </p>

            {/* Doctor Search Bar */}
            <div className="w-full max-w-2xl pt-2">
              <SearchBar />
            </div>

            {/* Trust Points */}
            <div className="pt-3 w-full">
              <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-secondary-text">
                {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="h-4.5 w-4.5 text-primary shrink-0" aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Authentic Healthcare Scene Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none aspect-[4/3.4] rounded-3xl overflow-hidden border border-border/80 bg-card shadow-card group">
              <Image
                src={heroImage}
                alt="Compassionate healthcare consultation with specialist"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-[75%_center] transition-transform duration-700 group-hover:scale-102"
              />

              {/* Soft overlay gradient for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Live consultation status pill */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-slate-800 shadow-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      Dr. Sarah Ahmed &bull; Cardiologist
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available for Tele-Consultation
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary shrink-0">
                  ৳1,200
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
