"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Video, ShieldCheck, FileText, Lock, MessageSquare } from "lucide-react";
import { ContactModal } from "./ContactModal";

export const AdviceSection: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section className="w-full bg-slate-50/60 dark:bg-slate-900/20 py-14 sm:py-16 lg:py-20 border-b border-border overflow-hidden">
      <div className="max-w-[1920px] mx-auto section-padding-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Doctor Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] sm:aspect-[14/11] overflow-hidden rounded-2xl border border-border shadow-lg bg-card group">
              <Image
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80"
                alt="Experienced physician available for online medical consultations"
                fill
                priority
                sizes="(min-width: 1280px) 700px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top sm:object-center transition-transform duration-500 group-hover:scale-102"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Eyebrow, Heading, Description, 4 Benefits, Contact Us Button */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="space-y-4 sm:space-y-5">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase block">
                Online Telemedicine
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground">
                Consult with Doctors Online & Skip the Waiting Room
              </h2>

              <p className="text-sm sm:text-[15px] leading-relaxed text-secondary-text max-w-xl">
                Connect with certified medical specialists from the comfort of your home.
                Get timely virtual diagnosis, digital prescriptions, and expert medical follow-ups in minutes.
              </p>
            </div>

            {/* 4 Feature Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Point 1 */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Video className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">24/7 Virtual Care</h4>
                  <p className="text-[11px] text-secondary-text mt-0.5">Consult anytime, day or night</p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">Verified Doctors</h4>
                  <p className="text-[11px] text-secondary-text mt-0.5">BMDC authorized specialists</p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">Digital Prescription</h4>
                  <p className="text-[11px] text-secondary-text mt-0.5">Sent directly to your dashboard</p>
                </div>
              </div>

              {/* Point 4 */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground">100% Private & Safe</h4>
                  <p className="text-[11px] text-secondary-text mt-0.5">Encrypted video consultations</p>
                </div>
              </div>
            </div>

            {/* Contact Us Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white px-6 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Contact Support</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </section>
  );
};

export default AdviceSection;
