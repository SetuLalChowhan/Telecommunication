"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Video, ShieldCheck, FileText, Lock, MessageSquare } from "lucide-react";
import { ContactModal } from "./ContactModal";

const BENEFITS = [
  {
    icon: Video,
    title: "24/7 virtual care",
    description: "Consult anytime, day or night",
  },
  {
    icon: ShieldCheck,
    title: "Verified doctors",
    description: "BMDC authorized specialists",
  },
  {
    icon: FileText,
    title: "Digital prescription",
    description: "Sent directly to your dashboard",
  },
  {
    icon: Lock,
    title: "Private & secure",
    description: "Encrypted video consultations",
  },
];

export const AdviceSection: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section className="w-full border-b border-border/60 bg-muted/30 py-16 sm:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Image */}
          <div className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] sm:aspect-[14/11] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80"
                alt="Physician available for an online medical consultation"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top sm:object-center"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="space-y-4">
              <span className="eyebrow-text block text-primary">Online telemedicine</span>
              <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-foreground">
                Consult with doctors online and skip the waiting room
              </h2>
              <p className="text-sm leading-relaxed text-secondary-text max-w-xl">
                Connect with certified medical specialists from home. Get timely virtual
                diagnosis, digital prescriptions, and expert follow-ups in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BENEFITS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                    <p className="text-[11px] text-secondary-text mt-0.5">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Contact support</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} />
    </section>
  );
};

export default AdviceSection;
