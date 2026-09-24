"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";
import { currentAppYear } from "@/lib/time";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <BrandLogo showTagline={true} />
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed pt-2">
              Next-generation telemedicine platform connecting licensed doctors and patients
              with end-to-end encrypted consultations and secure digital healthcare.
            </p>
          </div>

          {/* For Patients */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3.5">
              For Patients
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary-text">
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3.5">
              For Doctors & Clinics
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/register" className="hover:text-primary transition-colors">
                  Join as Registered Doctor
                </Link>
              </li>
              <li>
                <Link href="/doctor-verification" className="hover:text-primary transition-colors">
                  BMDC Verification Portal
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="hover:text-primary transition-colors">
                  Doctor Clinical Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3.5">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-primary transition-colors">
                  Health Blogs
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

        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-text">
          <p>&copy; {currentAppYear()} TeleHealth Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-medium text-foreground/80">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            HIPAA Compliant &bull; 256-Bit Encrypted Telehealth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
