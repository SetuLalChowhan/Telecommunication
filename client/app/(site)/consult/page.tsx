import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, FileText, ShieldCheck, Video } from "lucide-react";
import { DoctorCard } from "@/components/site/doctors/DoctorCard";
import {
  breadcrumbJsonLd,
  medicalWebPageJsonLd,
} from "@/lib/seo";
import { resolveDoctors, resolveHowItWorks } from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";
import { getDoctorsServer } from "@/features/doctors/api/server";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Consult with Verified Doctors Online | DocConnect",
  description:
    "Book a video consultation with BMDC-verified specialists. Compare consultation fees, experience, and specialties, then confirm your slot in minutes.",
  keywords: [
    "consult with verified doctors",
    "online doctor consultation",
    "BMDC verified doctors",
    "specialist video consultation",
    "book doctor online",
  ],
  alternates: { canonical: "/consult" },
  openGraph: {
    title: "Consult with Verified Doctors Online | DocConnect",
    description:
      "Compare verified specialists by fee, experience, and specialty — then book a secure video consultation.",
    type: "website",
    url: "/consult",
    siteName: "DocConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Consult with Verified Doctors Online | DocConnect",
    description:
      "Compare verified specialists by fee, experience, and specialty — then book a secure video consultation.",
  },
};

const PLATFORM_GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "BMDC-verified physicians",
    description:
      "Every profile is credential-checked before it can accept a booking — registration, specialty certification, and identity.",
  },
  {
    icon: Video,
    title: "Encrypted video rooms",
    description:
      "Consultations run over end-to-end encrypted rooms with no third-party recording or ad tracking.",
  },
  {
    icon: FileText,
    title: "Signed digital prescriptions",
    description:
      "Prescriptions carry the doctor's registration number and digital signature, and are accepted at pharmacies nationwide.",
  },
  {
    icon: CalendarCheck,
    title: "Transparent upfront fees",
    description:
      "The consultation fee you see on the profile is the fee you pay. No hidden booking or facility charges.",
  },
];

const ConsultPage = async () => {
  const [store, { data: doctors }] = await Promise.all([
    getCmsSectionsServer(),
    getDoctorsServer({ limit: 12, page: 1, sortBy: "rating" }),
  ]);

  const content = resolveDoctors(store);
  const steps = resolveHowItWorks(store).steps;

  const pageLd = medicalWebPageJsonLd({
    name: content.title,
    description: content.subtitle,
    path: "/consult",
  });

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Verified doctors available for online consultation",
    numberOfItems: doctors.length,
    itemListElement: doctors.map((doctor, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Physician",
        name:
          doctor.user?.name ||
          [doctor.user?.firstName, doctor.user?.lastName].filter(Boolean).join(" "),
        url: absoluteUrl(`/doctors/${doctor.slug || doctor.id}`),
        medicalSpecialty:
          doctor.mainSpecialty?.name ||
          doctor.specialties?.[0]?.specialty?.name ||
          undefined,
        priceRange: doctor.fee ? `BDT ${doctor.fee}` : undefined,
        ...(doctor.user?.image ? { image: doctor.user.image } : {}),
      },
    })),
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Consult a doctor", path: "/consult" },
  ]);

  return (
    <main className="flex w-full flex-col">
      {/* Structured data is server-rendered from typed API fields only. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero */}
      <section className="w-full border-b border-border/60 bg-background">
        <div className="container-page py-12 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <span className="eyebrow-text block text-primary">{content.badge}</span>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Consult with verified doctors
            </h1>
            <p className="text-sm leading-relaxed text-secondary-text sm:text-base">
              {content.subtitle}
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {steps.map((step) => (
              <li key={step.step} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                  {step.step}
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-xs text-secondary-text">{step.subtitle}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Top doctors */}
      <section className="w-full border-b border-border/60 bg-muted/30 py-14 sm:py-16">
        <div className="container-page space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Top-rated specialists accepting consultations
              </h2>
              <p className="text-sm text-secondary-text">
                Ranked by verified patient reviews. Availability is updated live from each
                doctor&apos;s schedule.
              </p>
            </div>

            <Link
              href={content.ctaLink}
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              <span>{content.ctaText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Specialist availability is being refreshed. Please try again shortly.
            </p>
          )}
        </div>
      </section>

      {/* Guarantees */}
      <section className="w-full bg-background py-14 sm:py-16">
        <div className="container-page space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              What every consultation includes
            </h2>
            <p className="text-sm text-secondary-text">
              The same clinical standards on every booking, regardless of specialty or fee.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PLATFORM_GUARANTEES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                  <p className="text-xs leading-relaxed text-secondary-text">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ConsultPage;
