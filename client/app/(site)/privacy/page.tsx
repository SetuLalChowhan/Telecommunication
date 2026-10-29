import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2, UserCheck, EyeOff, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Data Protection & HIPAA Compliance | DocConnect",
  description:
    "Review DocConnect's privacy policy, medical data protection measures, and commitment to patient privacy and confidentiality.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="container-page max-w-4xl space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground shadow-xs">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Patient Confidentiality & Data Security</span>
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-secondary-text">
            Last updated: October 2026 &bull; Effective immediately
          </p>
        </div>

        {/* Intro Banner */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 text-sm text-foreground space-y-2">
          <h2 className="font-semibold text-base flex items-center gap-2 text-primary">
            <Lock className="h-4.5 w-4.5" />
            Our Core Privacy Commitment
          </h2>
          <p className="text-secondary-text leading-relaxed">
            At DocConnect, your health information is strictly confidential. We believe medical privacy is a fundamental human right. We never sell, monetize, or disclose your clinical or personal records to third-party advertisers or brokers.
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-secondary-text">
          {/* Section 1 */}
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              1. Information We Collect
            </h2>
            <p>
              When you use DocConnect for telemedicine consultations and digital health management, we collect information essential to deliver verified medical care:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-2">
              <li>
                <strong>Personal Identity:</strong> Full name, verified email address, phone number, date of birth, and identity credentials.
              </li>
              <li>
                <strong>Clinical & Health Records:</strong> Symptoms described, consultation notes, digital prescriptions, lab reports, and medical history shared with your consulting physician.
              </li>
              <li>
                <strong>Doctor Credentials:</strong> Bangladesh Medical and Dental Council (BMDC) registration numbers, medical degrees, specializations, and verification documentation.
              </li>
              <li>
                <strong>Encrypted Teleconsultation Metadata:</strong> Session timestamps, call duration, and connection diagnostics. Video and audio streams are processed through end-to-end encrypted tunnels.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
              <UserCheck className="h-5 w-5 text-primary" />
              2. How Your Health Information Is Used
            </h2>
            <p>
              Your personal and health information is strictly used for clinical care delivery, appointment scheduling, and patient-doctor communication:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-2">
              <li>Connecting you in real-time with verified, licensed doctors for video consultations.</li>
              <li>Generating digitally signed medical prescriptions accessible solely by you and your doctor.</li>
              <li>Sending automated SMS and email reminders for upcoming appointments and schedule changes.</li>
              <li>Fulfilling legal and clinical record-keeping obligations required by medical authorities.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
              <Server className="h-5 w-5 text-primary" />
              3. Security Standards & Data Protection
            </h2>
            <p>
              DocConnect implements state-of-the-art security safeguards designed for medical-grade platforms:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-1.5">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide">Data in Transit</p>
                <p className="text-xs text-secondary-text">
                  All platform traffic is encrypted using TLS 1.3 cryptographic protocols with perfect forward secrecy.
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-1.5">
                <p className="font-semibold text-foreground text-xs uppercase tracking-wide">Data at Rest</p>
                <p className="text-xs text-secondary-text">
                  Prescriptions, documents, and medical reports are stored with AES-256 military-grade encryption.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-foreground">
              <EyeOff className="h-5 w-5 text-primary" />
              4. Patient Rights & Record Access
            </h2>
            <p>
              As a patient, you retain full ownership of your health records. You have the right to:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-2">
              <li>Access and download your digital prescriptions and consultation summaries at any time.</li>
              <li>Request correction of any inaccurate personal details in your account profile.</li>
              <li>Request permanent account deletion and removal of non-mandatory audit logs in compliance with medical record retention laws.</li>
            </ul>
          </section>

          {/* Footer Callout */}
          <div className="rounded-2xl border border-border bg-muted/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-semibold text-foreground">Have questions about your medical privacy?</p>
              <p className="text-xs text-muted-foreground">
                Contact our Data Protection and Compliance Officer at privacy@docconnect.com
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary-dark transition-colors shrink-0"
            >
              Contact Support Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
