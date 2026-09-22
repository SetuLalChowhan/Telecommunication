import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  resolveAboutHero,
  resolveAboutLeadership,
  resolveAboutPrinciples,
  resolveAboutStats,
  resolveIcon,
} from "@/features/cms";
import { getCmsSectionsServer } from "@/features/cms/api/server";

/**
 * About page body.
 *
 * Every block (hero, stats, principles, leadership) is CMS-backed with a
 * hard-coded default, so the page renders complete content even when the CMS
 * row has never been created.
 */
export async function AboutContent() {
  const store = await getCmsSectionsServer();

  const hero = resolveAboutHero(store);
  const stats = resolveAboutStats(store);
  const principles = resolveAboutPrinciples(store);
  const leadership = resolveAboutLeadership(store);

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

      {/* Leadership */}
      <section className="border-b border-border/60 bg-muted/30 py-16 sm:py-20">
        <div className="container-page space-y-12">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="eyebrow-text block text-primary">{leadership.badge}</span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {leadership.title}
            </h2>
            <p className="text-sm text-secondary-text sm:text-base">
              {leadership.subtitle}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {leadership.items.map((leader, index) => (
              <div
                key={`${leader.name}-${index}`}
                className="flex flex-col items-center space-y-4 rounded-xl border border-border bg-card p-6 text-center"
              >
                <Avatar className="h-24 w-24 rounded-xl border border-border">
                  {leader.avatar && (
                    <AvatarImage src={leader.avatar} alt={leader.name} />
                  )}
                  <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="w-full space-y-1">
                  <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary">{leader.role}</p>
                  <p className="text-xs font-medium text-secondary-text">
                    {leader.qualifications}
                  </p>
                  {leader.bmdc && (
                    <span className="mt-1 inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {leader.bmdc}
                    </span>
                  )}
                </div>

                {leader.bio && (
                  <p className="border-t border-border/80 pt-2 text-xs leading-relaxed text-secondary-text sm:text-sm">
                    {leader.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-5xl space-y-6 rounded-xl bg-primary p-8 text-center text-primary-foreground sm:p-12">
            <div className="mx-auto max-w-2xl space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to experience accessible, verified healthcare?
              </h2>
              <p className="text-sm leading-relaxed text-primary-foreground/85">
                Connect with a licensed specialist in under 10 minutes, or book a scheduled
                consultation at your convenience.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              <Button
                asChild
                className="h-11 w-full gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-primary hover:bg-white/90 sm:w-auto"
              >
                <Link href="/doctors">
                  <span>Find a doctor</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-lg border-white/40 bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20 sm:w-auto"
              >
                <Link href="/register">Create patient account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutContent;
