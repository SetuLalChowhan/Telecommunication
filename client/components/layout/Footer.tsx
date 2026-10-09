"use client";

import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/common/BrandLogo";
import { currentAppYear } from "@/lib/time";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-[#f3f1eb]">
      <div className="container-page py-16">
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
            <h4 className="text-xs font-medium uppercase tracking-[0.24px] text-foreground mb-4">
              For Patients
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/doctors" className="hover:text-foreground transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Create Patient Account
                </Link>
              </li>
              <li>
                <Link href="/patient/dashboard" className="hover:text-foreground transition-colors">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* For Doctors */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.24px] text-foreground mb-4">
              For Doctors & Clinics
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Join as Registered Doctor
                </Link>
              </li>
              <li>
                <Link href="/doctor-verification" className="hover:text-foreground transition-colors">
                  BMDC Verification Portal
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="hover:text-foreground transition-colors">
                  Doctor Clinical Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.24px] text-foreground mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-secondary-text">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-foreground transition-colors">
                  Health Blogs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary-text">
          <p>&copy; {currentAppYear()} TeleHealth Inc. All rights reserved.</p>
          <p className="flex items-center gap-2 font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-[#c8dfaa] inline-block border border-border" />
            HIPAA Compliant &bull; 256-Bit Encrypted Telehealth
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
