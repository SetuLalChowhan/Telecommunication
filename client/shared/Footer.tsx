"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <BrandLogo showTagline={true} />
            <p className="text-xs text-muted-foreground leading-relaxed pt-2">
              Next-generation telemedicine platform connecting licensed doctors and patients
              with end-to-end encrypted consultations and secure records.
            </p>
          </div>

          {/* For Patients */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              For Patients
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/doctors" className="hover:text-primary transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Create Patient Account
                </Link>
              </li>
              <li>
                <Link href="/patient/dashboard" className="hover:text-primary transition-colors">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* For Doctors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              For Doctors
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/register/clinic" className="hover:text-primary transition-colors">
                  Join as Doctor
                </Link>
              </li>
              <li>
                <Link href="/doctor-verification" className="hover:text-primary transition-colors">
                  Verification Portal
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="hover:text-primary transition-colors">
                  Doctor Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TeleHealth Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            HIPAA Compliant &bull; 256-Bit Encrypted Telehealth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;