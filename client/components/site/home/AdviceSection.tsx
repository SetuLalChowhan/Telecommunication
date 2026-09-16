"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Video, ShieldCheck, FileText, Lock, MessageSquare } from "lucide-react";
import { ContactModal } from "./ContactModal";

export const AdviceSection: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section className="w-full bg-slate-50/70 dark:bg-slate-900/30 py-14 sm:py-16 lg:py-20 border-b border-border/70 overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Friendly Certified Doctor in Clinic Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] sm:aspect-[14/11] overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-[16px] rounded-bl-[16px] sm:rounded-tl-[48px] sm:rounded-br-[48px] sm:rounded-tr-[24px] sm:rounded-bl-[24px] border border-border/80 shadow-2xl shadow-slate-900/[0.06] bg-card group">
              <Image
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80"
                alt="Friendly experienced physician available for online medical advice"
                fill
                priority
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top sm:object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Eyebrow, Heading, Description, 4 Telemedicine Benefits, Contact Us Button */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            {/* Eyebrow Pill Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3.5 py-1.5 border border-primary/20 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Online Advice</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] font-bold leading-[1.18] tracking-tight text-foreground">
              Find Doctor Online Today And{" "}
              <span className="text-primary">Skip The Waiting Room</span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-[15px] leading-relaxed text-secondary-text max-w-xl">
              Connect with certified medical specialists from the comfort of your home.
              Get timely virtual diagnosis, digital prescriptions, and expert medical follow-ups in minutes.
            </p>

            {/* 4 Feature Points Grid - Project Aligned Telehealth Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 pt-1">
              {/* Point 1: 24/7 Virtual Care */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">24/7 Virtual Care</h4>
                  <p className="text-xs text-secondary-text mt-0.5">Consult anytime, day or night</p>
                </div>
              </div>

              {/* Point 2: Board-Certified Specialists */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">Certified Doctors</h4>
                  <p className="text-xs text-secondary-text mt-0.5">Over 20+ top medical fields</p>
                </div>
              </div>

              {/* Point 3: Digital Prescriptions */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">Instant Digital Rx</h4>
                  <p className="text-xs text-secondary-text mt-0.5">Direct e-prescription delivery</p>
                </div>
              </div>

              {/* Point 4: 100% Encrypted & Private */}
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">100% Private & Safe</h4>
                  <p className="text-xs text-secondary-text mt-0.5">HIPAA compliant encryption</p>
                </div>
              </div>
            </div>

            {/* Contact Us Button -> Opens Shadcn Modal */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white px-7 py-2.5 text-sm font-semibold transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-primary/20 group"
              >
                <MessageSquare className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Contact Us</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Shadcn Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </section>
  );
};

export default AdviceSection;
