import React from "react";
import Image, { StaticImageData } from "next/image";
import BrandLogo from "@/components/common/BrandLogo";
import { ShieldCheck } from "lucide-react";
import commonAuthImage from "@/assets/images/authImages.jpg";

interface AuthSplitLayoutProps {
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  headline?: string;
  subheadline?: string;
  trustBadge?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function AuthSplitLayout({
  imageSrc,
  imageAlt = "Telemedicine consultation with doctor and patient",
  headline = "Healthcare that fits your life.",
  subheadline = "Connect with trusted doctors from wherever you are.",
  trustBadge = "Over 500,000+ appointments completed",
  title,
  description,
  children,
}: AuthSplitLayoutProps) {
  const selectedImage = imageSrc || commonAuthImage;

  return (
    <main className="min-h-dvh w-full flex flex-col lg:flex-row bg-background antialiased selection:bg-accent selection:text-primary">
      {/* Left Column: Storytelling Visual + Brand Logo (Desktop Only) */}
      <section
        aria-label="Brand and Storytelling"
        className="hidden lg:flex lg:w-1/2 p-4 xl:p-6 sticky top-0 h-dvh"
      >
        <div className="relative w-full h-full rounded-2xl xl:rounded-3xl overflow-hidden shadow-card border border-border/40">
          {/* Logo placed on the top-left of the left image */}
          <div className="absolute top-6 left-6 z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/60">
              <BrandLogo iconSize={18} />
            </div>
          </div>

          <Image
            src={selectedImage}
            alt={imageAlt}
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />

          {/* Subtle Healthcare Gradient: Deep Navy & Teal for clean text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent" />

          {/* Bottom-left story message */}
          <div className="absolute bottom-0 left-0 right-0 p-6 xl:p-10 text-white flex flex-col gap-3">
            {trustBadge && (
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/20 shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary shrink-0" />
                <span>{trustBadge}</span>
              </div>
            )}
            <h2 className="text-xl xl:text-2xl font-semibold tracking-tight text-white leading-snug">
              {headline}
            </h2>
            <p className="text-xs xl:text-sm text-white/85 max-w-md leading-relaxed">
              {subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Right Column: Accessible Mobile-First Form Panel */}
      <section
        aria-label="Authentication Form"
        className="w-full lg:w-1/2 min-h-dvh flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12"
      >
        {/* Mobile Header: Shown only when left image is hidden on mobile screens */}
        <div className="lg:hidden flex items-center justify-between pb-3.5 border-b border-border/60">
          <BrandLogo iconSize={18} />
        </div>

        {/* Centered Form Area */}
        <div className="w-full max-w-[720px] mx-auto my-auto py-4 sm:py-6">
          {/* Header */}
          <div className="mb-5 sm:mb-6 text-left">
            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Form Content */}
          <div>{children}</div>
        </div>

        {/* Minimal Footer */}
        <footer className="w-full pt-3 text-center text-xs text-secondary-text/80">
          <p>
            Secure, encrypted &amp; HIPAA compliant. © {new Date().getFullYear()} TeleHealth.
          </p>
        </footer>
      </section>
    </main>
  );
}
