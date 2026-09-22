import type { LucideIcon } from "lucide-react";
import {
  Baby,
  BadgeCheck,
  Bone,
  Brain,
  CalendarCheck,
  Eye,
  FileCheck,
  FileCheck2,
  FileText,
  HeartHandshake,
  HeartPulse,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Stethoscope,
  Video,
} from "lucide-react";

/**
 * Website CMS section contract.
 *
 * `WebsiteSection` mirrors the backend Prisma model. Every section has a
 * hard-coded default below, so the site renders identically when the CMS is
 * unreachable or a row has not been created yet — CMS only ever overrides.
 */
export interface WebsiteSection {
  id: string;
  key: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  content: unknown;
  imageUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  metadata: unknown;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
}

export type CmsSectionStore = Record<string, WebsiteSection>;

export const CMS_KEYS = {
  homeHero: "home_hero",
  homeHowItWorks: "home_how_it_works",
  homeSpecialties: "home_specialties",
  homeDoctors: "home_doctors",
  homeAdvice: "home_advice",
  homeTestimonials: "home_testimonials",
  homeBlog: "home_blog",
  aboutHero: "about_hero",
  aboutStats: "about_stats",
  aboutPrinciples: "about_principles",
  aboutLeadership: "about_leadership",
} as const;

/** Icon lookup for CMS-authored items, which carry icon names as strings. */
export const SECTION_ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  CalendarCheck,
  Video,
  FileText,
  ShieldCheck,
  Lock,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Eye,
  Smile,
  ShieldAlert,
  FileCheck,
  FileCheck2,
  HeartHandshake,
};

export function resolveIcon(name?: string | null, fallback: LucideIcon = Stethoscope) {
  if (!name) return fallback;
  return SECTION_ICONS[name] ?? fallback;
}

/* ------------------------------------------------------------------ */
/* Section content shapes                                              */
/* ------------------------------------------------------------------ */

export interface SectionHeading {
  badge: string;
  title: string;
  subtitle: string;
}

export interface HeroTrustItem {
  label: string;
  icon: string;
}

export interface HeroSection extends SectionHeading {
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  trustItems: HeroTrustItem[];
}

export interface StepItem {
  step: string;
  title: string;
  subtitle: string;
}

export interface HowItWorksSection extends SectionHeading {
  imageUrl: string;
  steps: StepItem[];
}

export interface SpecialtyItem {
  title: string;
  description: string;
  slug: string;
  icon: string;
}

export interface SpecialtiesSectionContent extends SectionHeading {
  ctaText: string;
  ctaLink: string;
  items: SpecialtyItem[];
}

export interface DoctorsSectionContent extends SectionHeading {
  ctaText: string;
  ctaLink: string;
  /** How many top doctors to render. */
  limit: number;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

export interface AdviceSectionContent extends SectionHeading {
  imageUrl: string;
  ctaText: string;
  benefits: BenefitItem[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface TestimonialsSectionContent extends SectionHeading {
  items: TestimonialItem[];
}

export interface BlogSectionContent extends SectionHeading {
  ctaText: string;
  ctaLink: string;
  limit: number;
}

export interface StatItem {
  value: string;
  label: string;
  subtext: string;
}

export interface AboutStatsContent extends SectionHeading {
  stats: StatItem[];
}

export interface PrincipleItem {
  title: string;
  description: string;
  icon: string;
}

export interface AboutPrinciplesContent extends SectionHeading {
  items: PrincipleItem[];
}

export interface LeaderItem {
  name: string;
  role: string;
  qualifications: string;
  avatar: string;
  bmdc: string;
  bio: string;
}

export interface AboutLeadershipContent extends SectionHeading {
  items: LeaderItem[];
}
