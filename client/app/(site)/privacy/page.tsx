import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy - Data Protection & HIPAA Compliance | DocConnect",
  description:
    "Review DocConnect's privacy policy, medical data protection measures, and commitment to patient privacy and confidentiality.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="container-page max-w-4xl">
        <div className="mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Patient Confidentiality & Security</span>
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-secondary-text">
            Last updated: October 2026 • Effective immediately
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-secondary-text">
          <section className="space-y-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Lock className="h-5 w-5 text-primary" />
              1. Information We Collect
            </h2>
            <p>
              When you use DocConnect, we collect information necessary to provide certified telemedicine consultations and securely store your medical history. This includes:
            </p>
            <ul className="list-inside list-disc space-y-1.5 pl-2">
              <li>Personal identity details (full name, email address, phone number, date of birth).</li>
              <li>Medical consultation records, prescription history, and uploaded lab reports.</li>
              <li>Encrypted video consultation metadata and session timestamps.</li>
              <li>Account credentials managed with end-to-end encrypted session tokens.</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              2. How Your Health Information Is Used
            </h2>
            <p>
              Your health information is strictly used for clinical care delivery, appointment scheduling, and patient-doctor communication:
            </p>
            <ul className="list-inside list-disc space-y-1.5 pl-2">
              <li>Facilitating secure live video consultations with verified doctors.</li>
              <li>Generating digital prescriptions and clinical treatment summaries.</li>
              <li>Sending appointment reminders and important health updates.</li>
              <li>We <strong>never sell</strong> or monetize your personal or clinical medical records.</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              3. Security Standards & Compliance
            </h2>
            <p>
              DocConnect employs banking-grade AES-256 encryption for data at rest and TLS 1.3 encryption for data in transit. Access to clinical records is restricted to licensed medical practitioners involved in your direct consultation.
            </p>
          </section>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Have questions about your privacy? Contact our Data Protection Officer at privacy@docconnect.com
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
