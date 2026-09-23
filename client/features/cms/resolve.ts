import {
  DEFAULT_ABOUT_HERO,
  DEFAULT_ABOUT_LEADERSHIP,
  DEFAULT_ABOUT_PRINCIPLES,
  DEFAULT_ABOUT_STATS,
  DEFAULT_ADVICE,
  DEFAULT_BLOG_SECTION,
  DEFAULT_DOCTORS,
  DEFAULT_HERO,
  DEFAULT_HOW_IT_WORKS,
  DEFAULT_SPECIALTIES,
  DEFAULT_TESTIMONIALS,
} from "./defaults";
import {
  AboutLeadershipContent,
  AboutPrinciplesContent,
  AboutStatsContent,
  AdviceSectionContent,
  BlogSectionContent,
  CMS_KEYS,
  CmsSectionStore,
  DoctorsSectionContent,
  HeroSection,
  HowItWorksSection,
  SectionHeading,
  SpecialtiesSectionContent,
  TestimonialsSectionContent,
  WebsiteSection,
} from "./types";

/* ------------------------------ image helper ----------------------------- */

type LocalImage = { src: string; width: number; height: number } | string;

/**
 * Picks the image a section should render.
 *
 * Only absolute `http(s)` URLs are taken from the CMS. Local defaults are
 * bundled via static imports, so an editor typing a bare path can never produce
 * a broken image (or an unoptimisable one) in production.
 */
export function resolveSectionImage<T extends LocalImage>(
  cmsUrl: string | null | undefined,
  fallback: T
): T | string {
  if (cmsUrl && /^https?:\/\//i.test(cmsUrl)) return cmsUrl;
  return fallback;
}

/* --------------------------- primitive readers --------------------------- */

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function optionalStr(value: unknown, fallback: string): string {
  if (typeof value === "string") return value;
  return fallback;
}

function num(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function rows(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === "object" && !Array.isArray(item)
  );
}

function heading(
  section: WebsiteSection | undefined,
  fallback: SectionHeading
): SectionHeading {
  return {
    badge: str(section?.badge, fallback.badge),
    title: str(section?.title, fallback.title),
    subtitle: str(section?.subtitle, fallback.subtitle),
  };
}

/* ------------------------------ resolvers -------------------------------- */

export function resolveHero(store: CmsSectionStore): HeroSection {
  const section = store[CMS_KEYS.homeHero];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_HERO),
    imageUrl: str(section?.imageUrl, DEFAULT_HERO.imageUrl),
    ctaText: str(section?.ctaText, DEFAULT_HERO.ctaText),
    ctaLink: str(section?.ctaLink, DEFAULT_HERO.ctaLink),
    trustItems: items.length
      ? items.map((item, index) => ({
          label: str(
            item.label,
            DEFAULT_HERO.trustItems[index]?.label ?? "Verified care"
          ),
          icon: str(item.icon, DEFAULT_HERO.trustItems[index]?.icon ?? "ShieldCheck"),
        }))
      : DEFAULT_HERO.trustItems,
  };
}

export function resolveHowItWorks(store: CmsSectionStore): HowItWorksSection {
  const section = store[CMS_KEYS.homeHowItWorks];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_HOW_IT_WORKS),
    imageUrl: str(section?.imageUrl, DEFAULT_HOW_IT_WORKS.imageUrl),
    steps: items.length
      ? items.map((item, index) => ({
          step: str(item.step, String(index + 1).padStart(2, "0")),
          title: str(item.title, DEFAULT_HOW_IT_WORKS.steps[index]?.title ?? ""),
          subtitle: str(
            item.subtitle,
            DEFAULT_HOW_IT_WORKS.steps[index]?.subtitle ?? ""
          ),
        }))
      : DEFAULT_HOW_IT_WORKS.steps,
  };
}

export function resolveSpecialties(
  store: CmsSectionStore
): SpecialtiesSectionContent {
  const section = store[CMS_KEYS.homeSpecialties];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_SPECIALTIES),
    ctaText: str(section?.ctaText, DEFAULT_SPECIALTIES.ctaText),
    ctaLink: str(section?.ctaLink, DEFAULT_SPECIALTIES.ctaLink),
    items: items.length
      ? items.map((item, index) => ({
          title: str(item.title, DEFAULT_SPECIALTIES.items[index]?.title ?? ""),
          description: str(
            item.description ?? item.subtitle,
            DEFAULT_SPECIALTIES.items[index]?.description ?? ""
          ),
          slug: str(item.slug, DEFAULT_SPECIALTIES.items[index]?.slug ?? ""),
          icon: str(item.icon, DEFAULT_SPECIALTIES.items[index]?.icon ?? "Stethoscope"),
        }))
      : DEFAULT_SPECIALTIES.items,
  };
}

export function resolveDoctors(store: CmsSectionStore): DoctorsSectionContent {
  const section = store[CMS_KEYS.homeDoctors];

  return {
    ...heading(section, DEFAULT_DOCTORS),
    ctaText: str(section?.ctaText, DEFAULT_DOCTORS.ctaText),
    ctaLink: str(section?.ctaLink, DEFAULT_DOCTORS.ctaLink),
    limit: num(
      (section?.metadata as { limit?: unknown } | null | undefined)?.limit,
      DEFAULT_DOCTORS.limit
    ),
  };
}

export function resolveAdvice(store: CmsSectionStore): AdviceSectionContent {
  const section = store[CMS_KEYS.homeAdvice];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_ADVICE),
    imageUrl: str(section?.imageUrl, DEFAULT_ADVICE.imageUrl),
    ctaText: str(section?.ctaText, DEFAULT_ADVICE.ctaText),
    benefits: items.length
      ? items.map((item, index) => ({
          title: str(item.title, DEFAULT_ADVICE.benefits[index]?.title ?? ""),
          description: str(
            item.description ?? item.subtitle,
            DEFAULT_ADVICE.benefits[index]?.description ?? ""
          ),
          icon: str(item.icon, DEFAULT_ADVICE.benefits[index]?.icon ?? "Video"),
        }))
      : DEFAULT_ADVICE.benefits,
  };
}

export function resolveTestimonials(
  store: CmsSectionStore
): TestimonialsSectionContent {
  const section = store[CMS_KEYS.homeTestimonials];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_TESTIMONIALS),
    items: items.length
      ? items.map((item, index) => ({
          name: str(item.name, DEFAULT_TESTIMONIALS.items[index]?.name ?? "Patient"),
          role: str(item.role, DEFAULT_TESTIMONIALS.items[index]?.role ?? ""),
          quote: str(item.quote, DEFAULT_TESTIMONIALS.items[index]?.quote ?? ""),
          avatar: str(item.avatar, DEFAULT_TESTIMONIALS.items[index]?.avatar ?? ""),
        }))
      : DEFAULT_TESTIMONIALS.items,
  };
}

export function resolveBlogSection(store: CmsSectionStore): BlogSectionContent {
  const section = store[CMS_KEYS.homeBlog];

  return {
    ...heading(section, DEFAULT_BLOG_SECTION),
    ctaText: str(section?.ctaText, DEFAULT_BLOG_SECTION.ctaText),
    ctaLink: str(section?.ctaLink, DEFAULT_BLOG_SECTION.ctaLink),
    limit: num(
      (section?.metadata as { limit?: unknown } | null | undefined)?.limit,
      DEFAULT_BLOG_SECTION.limit
    ),
  };
}

export function resolveAboutHero(store: CmsSectionStore): SectionHeading {
  return heading(store[CMS_KEYS.aboutHero], DEFAULT_ABOUT_HERO);
}

export function resolveAboutStats(store: CmsSectionStore): AboutStatsContent {
  const section = store[CMS_KEYS.aboutStats];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_ABOUT_STATS),
    stats: items.length
      ? items.map((item, index) => ({
          value: str(item.value, DEFAULT_ABOUT_STATS.stats[index]?.value ?? ""),
          label: str(item.label, DEFAULT_ABOUT_STATS.stats[index]?.label ?? ""),
          subtext: optionalStr(
            item.subtext,
            DEFAULT_ABOUT_STATS.stats[index]?.subtext ?? ""
          ),
        }))
      : DEFAULT_ABOUT_STATS.stats,
  };
}

export function resolveAboutPrinciples(
  store: CmsSectionStore
): AboutPrinciplesContent {
  const section = store[CMS_KEYS.aboutPrinciples];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_ABOUT_PRINCIPLES),
    items: items.length
      ? items.map((item, index) => ({
          title: str(item.title, DEFAULT_ABOUT_PRINCIPLES.items[index]?.title ?? ""),
          description: str(
            item.description ?? item.subtitle,
            DEFAULT_ABOUT_PRINCIPLES.items[index]?.description ?? ""
          ),
          icon: str(
            item.icon,
            DEFAULT_ABOUT_PRINCIPLES.items[index]?.icon ?? "ShieldCheck"
          ),
        }))
      : DEFAULT_ABOUT_PRINCIPLES.items,
  };
}

export function resolveAboutLeadership(
  store: CmsSectionStore
): AboutLeadershipContent {
  const section = store[CMS_KEYS.aboutLeadership];
  const items = rows(section?.content);

  return {
    ...heading(section, DEFAULT_ABOUT_LEADERSHIP),
    items: items.length
      ? items.map((item, index) => ({
          name: str(item.name, DEFAULT_ABOUT_LEADERSHIP.items[index]?.name ?? ""),
          role: str(item.role, DEFAULT_ABOUT_LEADERSHIP.items[index]?.role ?? ""),
          qualifications: str(
            item.qualifications,
            DEFAULT_ABOUT_LEADERSHIP.items[index]?.qualifications ?? ""
          ),
          avatar: optionalStr(
            item.avatar,
            DEFAULT_ABOUT_LEADERSHIP.items[index]?.avatar ?? ""
          ),
          bmdc: optionalStr(item.bmdc, DEFAULT_ABOUT_LEADERSHIP.items[index]?.bmdc ?? ""),
          bio: optionalStr(item.bio, DEFAULT_ABOUT_LEADERSHIP.items[index]?.bio ?? ""),
        }))
      : DEFAULT_ABOUT_LEADERSHIP.items,
  };
}
