import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  resolveAboutHero,
  resolveAboutPrinciples,
  resolveAboutStats,
  resolveIcon,
} from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";

/**
 * About page body.
 *
 * Every block (hero, stats, principles) is CMS-backed with a
 * hard-coded default, so the page renders complete content even when the CMS
 * row has never been created.
 */
export async function AboutContent() {
  const store = await getCmsSectionsServer();

  const hero = resolveAboutHero(store);
  const stats = resolveAboutStats(store);
  const principles = resolveAboutPrinciples(store);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border/60 bg-muted/30 py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl space-y-4 text-center sm:space-y-6">
            <span className="eyebrow-text block text-primary">{hero.badge}</span>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {hero.title}
            </h1>
            <p className="text-base leading-relaxed text-secondary-text sm:text-lg">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Impact metrics */}
      <section className="border-b border-border bg-card py-12 sm:py-16">
        <div className="container-page space-y-8">
          <h2 className="sr-only">{stats.title}</h2>
          <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
            {stats.stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="space-y-1.5 p-4 text-center">
                <dd className="text-3xl font-semibold tracking-tight text-primary">
                  {stat.value}
                </dd>
                <dt className="text-sm font-semibold text-foreground sm:text-base">
                  {stat.label}
                </dt>
                {stat.subtext && (
                  <p className="hidden text-xs text-secondary-text sm:block">
                    {stat.subtext}
                  </p>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Principles */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="container-page space-y-12">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="eyebrow-text block text-primary">{principles.badge}</span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {principles.title}
            </h2>
            <p className="text-sm text-secondary-text sm:text-base">
              {principles.subtitle}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {principles.items.map((item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <div
                  key={`${item.title}-${index}`}
                  className="space-y-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-secondary-text sm:text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-5xl space-y-6 rounded-2xl bg-gradient-to-br from-[#415e45] via-[#334b37] to-[#253728] p-8 text-center text-white shadow-xl sm:p-14 border border-white/10">
            <div className="mx-auto max-w-2xl space-y-3.5">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
                Accessible Healthcare For Everyone
              </span>
              <h2 className="font-serif text-3xl font-normal tracking-tight text-white sm:text-4xl lg:text-[42px] leading-tight">
                Ready to experience accessible, verified healthcare?
              </h2>
              <p className="text-sm leading-relaxed text-white/85 max-w-xl mx-auto">
                Connect with a licensed specialist in under 10 minutes, or book a scheduled
                consultation at your convenience.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3.5 pt-4 sm:flex-row">
              <Link
                href="/doctors"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-[#253728] hover:bg-white/95 shadow-md transition-all sm:w-auto"
              >
                <span>Find a doctor</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border-2 border-white/80 bg-white/10 px-7 text-sm font-bold text-white hover:bg-white/20 backdrop-blur-xs transition-all sm:w-auto"
              >
                <span>Create patient account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutContent;
