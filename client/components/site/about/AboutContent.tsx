"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STATS = [
  { value: "50,000+", label: "Successful Consultations", subtext: "Across general & specialist care" },
  { value: "250+", label: "BMDC-Verified Doctors", subtext: "Stringently credentialed physicians" },
  { value: "< 10 min", label: "Average Response Time", subtext: "Instant virtual queue connection" },
  { value: "98.4%", label: "Patient Satisfaction", subtext: "Based on verified post-consult reviews" },
];

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Clinical Rigor & Verification",
    description:
      "Every physician on our platform undergoes multi-tier credential verification, including BMDC registration checks, specialty certification validation, and peer clinical reviews.",
  },
  {
    icon: Lock,
    title: "Strict Health Data Privacy",
    description:
      "We treat patient confidentiality with the utmost seriousness. Consultations and electronic health records are protected with bank-grade encryption and HIPAA-aligned security protocols.",
  },
  {
    icon: FileCheck,
    title: "Verified Digital Prescriptions",
    description:
      "Prescriptions issued through the platform contain verifiable doctor digital signatures and registration numbers, making them universally accepted at pharmacies nationwide.",
  },
  {
    icon: HeartHandshake,
    title: "Transparent, Fair Pricing",
    description:
      "We believe high-quality healthcare must be accessible. Doctor fees are displayed upfront with zero hidden booking charges or surprise facility fees.",
  },
];

const LEADERSHIP = [
  {
    name: "Prof. Dr. Tariqul Islam",
    role: "Chief Medical Officer & Clinical Lead",
    qualifications: "MBBS, FCPS (Medicine), MD, FACP",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    bmdc: "BMDC-A-21045",
    bio: "Over 22 years of clinical practice and hospital administration. Oversees platform clinical guidelines and physician onboarding quality.",
  },
  {
    name: "Dr. Farhana Rahman",
    role: "Head of Patient Safety & Protocols",
    qualifications: "MBBS, DGO, FCPS (Obs & Gynae)",
    avatar: "https://images.unsplash.com/photo-1594824813580-0a2569260c68?auto=format&fit=crop&w=400&q=80",
    bmdc: "BMDC-A-34890",
    bio: "Leading specialist in women's health with 15+ years experience. Champions patient advocacy and maternal telehealth initiatives.",
  },
  {
    name: "Dr. Mahfuzur Khan",
    role: "Director of Digital Health Integration",
    qualifications: "MBBS, MS (Orthopaedics), MPH (Epidemiology)",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    bmdc: "BMDC-A-18234",
    bio: "Pioneer in health informatics with deep expertise in optimizing remote clinical workflows and electronic health record architecture.",
  },
];

export function AboutContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="border-b border-border/60 bg-muted/30 py-16 sm:py-20">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <span className="eyebrow-text block text-primary">
              About DocConnect
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight text-foreground">
              Bridging the gap between compassionate care &amp; modern medicine.
            </h1>
            <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
              We are on a mission to make certified clinical consultations instantly accessible to every individual, regardless of location, background, or mobility.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Key Impact Metrics */}
      <section className="py-12 sm:py-16 border-b border-border bg-card">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1.5 p-4">
                <p className="text-3xl font-semibold text-primary tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base font-semibold text-foreground">
                  {stat.label}
                </p>
                <p className="text-xs text-secondary-text hidden sm:block">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Clinical Principles */}
      <section className="py-16 sm:py-20 border-b border-border">
        <div className="max-w-[1920px] mx-auto section-padding-x space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Our Core Clinical Principles
            </h2>
            <p className="text-sm sm:text-base text-secondary-text">
              We design every interaction to uphold the highest benchmarks of medical ethics and patient safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {PRINCIPLES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-card p-6 space-y-3 transition-colors hover:border-primary/40"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Medical Leadership */}
      <section className="py-16 sm:py-20 border-b border-border/60 bg-muted/30">
        <div className="max-w-[1920px] mx-auto section-padding-x space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Clinical Leadership &amp; Governance
            </h2>
            <p className="text-sm sm:text-base text-secondary-text">
              Guided by senior medical specialists and healthcare advocates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {LEADERSHIP.map((leader, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-6 flex flex-col items-center text-center space-y-4"
              >
                <Avatar className="h-24 w-24 rounded-xl border border-border">
                  <AvatarImage src={leader.avatar} alt={leader.name} />
                  <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="space-y-1 w-full">
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary">
                    {leader.role}
                  </p>
                  <p className="text-xs text-secondary-text font-medium">
                    {leader.qualifications}
                  </p>
                  <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground mt-1">
                    {leader.bmdc}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-secondary-text leading-relaxed text-justify sm:text-center pt-2 border-t border-border/80">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="rounded-xl bg-primary text-primary-foreground p-8 sm:p-12 max-w-5xl mx-auto text-center space-y-6">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Ready to experience accessible, verified healthcare?
              </h2>
              <p className="text-sm text-primary-foreground/85 leading-relaxed">
                Connect with a licensed specialist in under 10 minutes or book a scheduled consultation at your convenience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/doctors">
                <Button className="w-full sm:w-auto h-11 px-6 rounded-lg bg-white text-primary hover:bg-white/90 font-semibold text-sm gap-2">
                  <span>Find a doctor</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-11 px-6 rounded-lg border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold text-sm"
                >
                  Create patient account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
