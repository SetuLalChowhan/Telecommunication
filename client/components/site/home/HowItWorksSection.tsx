import React from "react";
import Image from "next/image";
import {
  FindDoctorSvg,
  BookScheduleSvg,
  GetConsultationSvg,
} from "@/components/svgs/HowItWorksSvgs";

const STEPS = [
  {
    step: "01",
    title: "Find a doctor",
    subtitle: "Search verified specialists",
    SvgComponent: FindDoctorSvg,
  },
  {
    step: "02",
    title: "Book a schedule",
    subtitle: "Pick your date & time slot",
    SvgComponent: BookScheduleSvg,
  },
  {
    step: "03",
    title: "Get consultation",
    subtitle: "HD video call & prescription",
    SvgComponent: GetConsultationSvg,
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full border-b border-border/60 bg-muted/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Steps */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="space-y-4">
              <span className="eyebrow-text block text-primary">How it works</span>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-foreground">
                Consult online in three simple steps
              </h2>
              <p className="text-sm leading-relaxed text-secondary-text max-w-xl">
                Connect with leading medical specialists in minutes — schedule an appointment,
                consult over high-quality video, and receive your digital prescription.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {STEPS.map((item) => {
                const SvgIcon = item.SvgComponent;
                return (
                  <div
                    key={item.step}
                    className="flex flex-col rounded-xl border border-border bg-card p-3"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                      <SvgIcon />
                      <span className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
                        {item.step}
                      </span>
                    </div>

                    <div className="mt-3 px-1 pb-0.5">
                      <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                      <p className="text-[11px] text-secondary-text mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consultation scene */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] sm:aspect-[14/11] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80"
                alt="Medical specialist ready for an online consultation"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top sm:object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
