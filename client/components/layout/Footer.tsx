"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";
import { currentAppYear } from "@/lib/time";
import { ShieldCheck, Lock, Mail, Phone, HeartHandshake } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-[#f8f7f4] dark:bg-[#1a1917] transition-colors">
      <div className="container-page py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo showTagline={true} />
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed max-w-sm pt-1">
              Certified telemedicine platform connecting patients with licensed physicians for
              confidential video consultations, signed digital prescriptions, and secure health management.
            </p>
            <div className="pt-2 space-y-2 text-xs text-secondary-text">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href="mailto:support@docconnect.com" className="hover:text-foreground transition-colors">
                  support@docconnect.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>+880 (02) 880-9900 &bull; 24/7 Clinical Helpdesk</span>
              </div>
            </div>
          </div>

          {/* Clinical Care & Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Care & Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/doctors" className="hover:text-foreground transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/consult" className="hover:text-foreground transition-colors">
                  Video Consultation
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-foreground transition-colors">
                  Health Blogs & Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Our Network
                </Link>
              </li>
            </ul>
          </div>

          {/* For Medical Professionals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              For Healthcare Providers
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Join as Registered Doctor
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Clinical Standards & Ethics
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Provider Support Desk
                </Link>
              </li>
              <li>
                <Link href="/consult" className="hover:text-foreground transition-colors">
                  Consultation Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust, Legal & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  Patient Safety
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Security & Regulatory Strip */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-text">
          <p>
            &copy; {currentAppYear()} DocConnect Telemedicine Inc. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs font-medium text-foreground">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              BMDC-Verified Specialists
            </span>
            <span className="hidden sm:inline text-border">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-primary">
              <Lock className="h-3.5 w-3.5" />
              256-Bit Encrypted Video Rooms
            </span>
            <span className="hidden sm:inline text-border">&bull;</span>
            <span className="inline-flex items-center gap-1.5 text-secondary-text">
              <HeartHandshake className="h-3.5 w-3.5" />
              HIPAA Compliant
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-foreground hover:underline transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground hover:underline transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground hover:underline transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
