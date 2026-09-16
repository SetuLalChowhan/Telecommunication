import React from "react";
import Image from "next/image";
import {
  FindDoctorSvg,
  BookScheduleSvg,
  GetConsultationSvg,
} from "@/components/svgs/HowItWorksSvgs";
import { CheckCircle2, Star } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Find a Doctor",
    subtitle: "Search verified specialists & ratings",
    SvgComponent: FindDoctorSvg,
  },
  {
    step: "02",
    title: "Book Schedule",
    subtitle: "Pick your preferred date & time slot",
    SvgComponent: BookScheduleSvg,
  },
  {
    step: "03",
    title: "Get Consultation",
    subtitle: "HD video call & digital prescription",
    SvgComponent: GetConsultationSvg,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50/60 dark:bg-slate-900/20 py-14 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Eyebrow, Heading, Description, and 3 Step Cards */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="space-y-4 sm:space-y-5">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
                How It Works
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground">
                Simple 3-Step Process to Consult Online
              </h2>

              <p className="text-sm sm:text-[15px] leading-relaxed text-secondary-text max-w-xl">
                Connecting with leading medical specialists has never been simpler. Follow these 3 easy steps
                to schedule an appointment, consult online via high-quality video call, and receive instant digital care.
              </p>
            </div>

            {/* 3 Step Cards */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {STEPS.map((item) => {
                const SvgIcon = item.SvgComponent;
                return (
                  <div
                    key={item.step}
                    className="group relative flex flex-col rounded-2xl border border-border bg-card p-3 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    {/* Step SVG Graphic Container */}
                    <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden rounded-xl border border-border/60">
                      <SvgIcon />

                      {/* Step Number Tag */}
                      <span className="absolute top-2 left-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-primary text-[11px] sm:text-xs font-bold text-white shadow-xs">
                        {item.step}
                      </span>
                    </div>

                    {/* Step Title & Subtitle */}
                    <div className="mt-2.5 text-left px-1 pb-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-secondary-text truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Featured Doctor Photo */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] sm:aspect-[14/11] overflow-hidden rounded-2xl border border-border shadow-lg bg-card group">
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"
                alt="Board-certified medical specialist ready for online consultation"
                fill
                priority
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top sm:object-center transition-transform duration-500 group-hover:scale-102"
              />

              {/* Verified Telehealth Doctor Badge */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3 rounded-xl bg-card/95 backdrop-blur-xs px-4 py-2.5 border border-border shadow-md">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">
                    Dr. Sarah Jenkins
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-secondary-text">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">4.9</span>
                    <span>&bull; Verified Cardiologist</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
