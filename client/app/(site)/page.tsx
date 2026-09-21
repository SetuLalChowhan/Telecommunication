import React from "react";
import type { Metadata } from "next";
import Banner from "@/components/site/home/Banner";
import SpecialtiesSection from "@/components/site/home/SpecialtiesSection";
import HowItWorksSection from "@/components/site/home/HowItWorksSection";
import DoctorsSection from "@/components/site/home/DoctorsSection";
import AdviceSection from "@/components/site/home/AdviceSection";
import TestimonialsSection from "@/components/site/home/TestimonialsSection";
import BlogSection from "@/components/site/home/BlogSection";

export const metadata: Metadata = {
  title: "DocConnect - Instant Online Doctor Consultation & Telemedicine",
  description:
    "Consult verified doctors and specialists online within minutes. Book video appointments, receive digital prescriptions, and securely manage your medical records.",
  keywords: [
    "telemedicine",
    "online doctor consultation",
    "doctor video call",
    "book doctor appointment",
    "verified doctors",
    "digital prescription",
    "healthcare platform",
  ],
  openGraph: {
    title: "DocConnect - Instant Online Doctor Consultation & Telemedicine",
    description:
      "Consult verified doctors online within minutes. Instant video calls, secure prescriptions, and clinical care from anywhere.",
    type: "website",
    locale: "en_US",
    siteName: "DocConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocConnect - Instant Online Doctor Consultation",
    description:
      "Consult verified doctors online within minutes. Instant video calls and secure digital prescriptions.",
  },
};

const HomePage = () => {
  return (
    <main className="flex flex-col w-full">
      <Banner />
      <SpecialtiesSection />
      <HowItWorksSection />
      <DoctorsSection />
      <AdviceSection />
      <TestimonialsSection />
      <BlogSection />
    </main>
  );
};

export default HomePage;