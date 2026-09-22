import React from "react";
import Image from "next/image";
import { ShieldCheck, CalendarCheck, FileCheck2, Video } from "lucide-react";
import SearchBar from "./SearchBar";
import heroImage from "@/assets/images/HeroImage2.jpg";

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "BMDC verified doctors" },
  { icon: CalendarCheck, label: "Instant slot booking" },
  { icon: Video, label: "HD video consultations" },
  { icon: FileCheck2, label: "Digital prescriptions" },
];

const Banner = () => {
  return (
    <section className="w-full border-b border-border/60 bg-background">
      <div className="container-page grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14 py-12 sm:py-16 lg:py-20">
        {/* Left: value proposition + search */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified physicians · 24/7 care
          </span>

          <h1 className="max-w-2xl text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-foreground">
            Find trusted doctors.{" "}
            <span className="text-primary">Consult online from home.</span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-secondary-text">
            Connect with experienced specialists across Bangladesh for confidential video
            consultations, clinical follow-ups, and instant digital prescriptions.
          </p>

          <div className="w-full max-w-2xl pt-1">
            <SearchBar />
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-xs sm:text-sm text-secondary-text">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: authentic consultation scene */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="relative w-full aspect-[4/3.4] overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={heroImage}
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
