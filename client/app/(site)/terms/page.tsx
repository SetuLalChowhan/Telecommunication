import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Scale, AlertCircle, FileCheck, Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service - Telemedicine Consultation Terms | DocConnect",
  description:
    "Read the terms and conditions governing the use of the DocConnect telemedicine platform, clinical consultations, and booking policies.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="container-page max-w-4xl">
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground">
            <Scale className="h-3.5 w-3.5 text-primary" />
            <span>Platform Agreement & Usage Terms</span>
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm text-secondary-text">
            Last updated: October 2026 • Effective immediately
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-secondary-text">
          <section className="space-y-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Stethoscope className="h-5 w-5 text-primary" />
              1. Telemedicine & Emergency Care Disclaimer
            </h2>
            <p>
              DocConnect connects patients with licensed healthcare professionals for non-emergency medical consultations.
            </p>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
              <strong>EMERGENCY NOTICE:</strong> If you are experiencing a life-threatening medical emergency, chest pain, shortness of breath, or severe trauma, please call your local emergency services (e.g. 911 / 999) or visit the nearest hospital emergency room immediately. DocConnect is not intended for acute emergency care.
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
              <FileCheck className="h-5 w-5 text-primary" />
              2. User Accounts & Verification
            </h2>
            <p>
              Users must provide accurate, current, and complete information during registration. Doctors on the platform undergo rigorous credential verification before being permitted to consult with patients.
            </p>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
              <AlertCircle className="h-5 w-5 text-primary" />
              3. Cancellation & Refund Policy
            </h2>
            <p>
              Consultations may be rescheduled or cancelled up to 2 hours prior to the scheduled appointment time for a full credit refund. Cancellations made within 2 hours or no-shows may incur a cancellation fee.
            </p>
          </section>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Questions regarding these terms? Contact legal@docconnect.com
            </p>
            <Link
              href="/"
              className="text-xs font-medium text-primary hover:underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
