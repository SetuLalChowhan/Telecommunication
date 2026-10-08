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
    <section className="w-full border-b border-border/60 bg-[#f3f1eb] py-16 sm:py-24">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Image on Cream Product Stage */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full rounded-[24px] bg-white p-3 border border-border/70 sm:aspect-[14/11]">
              <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-border/60 bg-card">
                <Image
                  src={image}
                  alt="Physician available for an online medical consultation"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top sm:object-center"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-[30px] border border-border bg-white px-3.5 py-1 text-xs font-medium tracking-[0.24px] text-foreground">
                {content.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal leading-tight tracking-[-0.03em] text-foreground">
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
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:border-[#cbcbcb]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3f1eb] text-foreground border border-border">
                      <Icon className="h-4 w-4 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium tracking-tight text-foreground">{title}</h3>
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
