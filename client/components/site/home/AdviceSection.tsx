import React from "react";
import Image from "next/image";
import AdviceImage from "@/assets/images/HeroImage.jpg";
import ContactSupportButton from "./ContactSupportButton";
import { CMS_KEYS, resolveAdvice, resolveIcon, resolveSectionImage } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";

const AdviceSection = async () => {
  const store = await getCmsSectionsServer();
  const content = resolveAdvice(store);
  const image = resolveSectionImage(store[CMS_KEYS.homeAdvice]?.imageUrl, AdviceImage);

  return (
    <section className="w-full border-b border-border/60 bg-muted/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[14/11]">
              <Image
                src={image}
                alt="Physician available for an online medical consultation"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top sm:object-center"
              />
            </div>
          </div>

          {/* Content */}
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {content.benefits.map(({ icon, title, description }) => {
                const Icon = resolveIcon(icon);
                return (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                      <p className="mt-0.5 text-[11px] text-secondary-text">
                        {description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <ContactSupportButton label={content.ctaText || "Contact support"} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdviceSection;
