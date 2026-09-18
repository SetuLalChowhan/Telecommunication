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
    role: "Head of Virtual Triage & Primary Care",
    qualifications: "MBBS, MRCP (UK), FCPS (Medicine)",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    bmdc: "BMDC-A-48921",
    bio: "Pioneer in telehealth workflow design with extensive hospital medicine background across tertiary healthcare centers.",
  },
  {
    name: "Dr. Rezaul Karim",
    role: "Cardiovascular Care Advisor",
    qualifications: "MBBS, MD (Cardiology), FSCAI",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    bmdc: "BMDC-A-33890",
    bio: "Senior Interventional Cardiologist specializing in preventative cardiology protocols and remote health monitoring.",
  },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="w-full bg-slate-50/60 dark:bg-slate-900/20 py-14 sm:py-20 border-b border-border">
        <div className="max-w-[1920px] mx-auto section-padding-x">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
              About Our Platform
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Connecting Patients with Trusted Doctors Anytime, Anywhere
            </h1>
            <p className="text-base sm:text-lg text-secondary-text max-w-2xl mx-auto leading-relaxed">
              We are building a reliable and human-centered telehealth platform in Bangladesh — combining verified medical expertise, instant HD video consultations, and secure electronic health records.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <Link href="/doctors">
                <Button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm">
                  <span>Find a Doctor</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blogs">
                <Button variant="outline" className="h-11 px-6 rounded-xl border-border font-semibold hover:bg-muted">
                  <span>Health Articles</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Grid */}
      <section className="w-full border-b border-border py-12 bg-card">
        <div className="max-w-[1920px] mx-auto section-padding-x">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col space-y-1.5 p-5 rounded-2xl bg-muted/20 border border-border/60">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {stat.label}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {stat.subtext}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="w-full py-16 sm:py-20 border-b border-border">
        <div className="max-w-[1920px] mx-auto section-padding-x space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Designed with Clinical Rigor and Human Care
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
              We prioritize patient well-being above everything else. Every feature we build is guided by clinical best practices and rigorous safety standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {PRINCIPLES.map((principle, idx) => {
              const Icon = principle.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-3.5 shadow-xs hover:border-primary/40 transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clinical Leadership Team */}
      <section className="w-full py-16 sm:py-20 border-b border-border bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-[1920px] mx-auto section-padding-x space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
              Medical Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Led by Verified Healthcare Professionals
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
              Our clinical advisory board ensures high standards of care, medical ethics, and patient safety across every digital consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {LEADERSHIP.map((leader, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-5 shadow-xs hover:border-primary/40 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                      <AvatarImage src={leader.avatar} alt={leader.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        DR
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                        {leader.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-primary">
                        {leader.bmdc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">
                      {leader.role}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {leader.qualifications}
                    </p>
                  </div>

                  <p className="text-xs text-secondary-text leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/80 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Medical Board</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="w-full py-16">
        <div className="max-w-[1920px] mx-auto section-padding-x">
          <div className="max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Start Your Care Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Ready to Consult with a Doctor?
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text">
                Connect with verified BMDC specialists or explore medical articles from our physicians.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <Link href="/doctors" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm">
                  <span>Browse Doctors</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
