import React from "react";
import Image from "next/image";
import {
  FindDoctorSvg,
  BookScheduleSvg,
  GetConsultationSvg,
} from "@/components/svgs/HowItWorksSvgs";
import howItWorksImage from "@/assets/images/HowItWorksDoctor.jpg";
import { CMS_KEYS, resolveHowItWorks, resolveSectionImage } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";

/** Illustrations are positional — the CMS supplies the step copy, not artwork. */
const STEP_ILLUSTRATIONS = [FindDoctorSvg, BookScheduleSvg, GetConsultationSvg];

const HowItWorksSection = async () => {
  const store = await getCmsSectionsServer();
  const content = resolveHowItWorks(store);
  const image = resolveSectionImage(
    store[CMS_KEYS.homeHowItWorks]?.imageUrl,
    howItWorksImage
  );

  return (
    <section className="w-full border-b border-border/60 bg-muted/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Steps */}
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="space-y-4">
              <span className="eyebrow-text block text-primary">{content.badge}</span>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                {content.title}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-secondary-text">
                {content.subtitle}
              </p>
            </div>

            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {content.steps.map((item, index) => {
                const Illustration =
                  STEP_ILLUSTRATIONS[index % STEP_ILLUSTRATIONS.length];
                return (
                  <li
                    key={`${item.step}-${index}`}
                    className="flex flex-col rounded-xl border border-border bg-card p-3"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                      <Illustration />
                      <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[11px] font-semibold text-primary-foreground">
                        {item.step}
                      </span>
                    </div>

                    <div className="mt-3 px-1 pb-0.5">
                      <h3 className="text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-secondary-text">
                        {item.subtitle}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Consultation scene */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[14/11]">
              <Image
                src={image}
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
