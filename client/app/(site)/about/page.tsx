import React from "react";
import type { Metadata } from "next";
import { AboutContent } from "@/components/site/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us - Our Mission & Clinical Leadership | DocConnect",
  description:
    "Learn about DocConnect's mission to make certified clinical telemedicine accessible to everyone. Meet our clinical leadership and explore our patient safety standards.",
  keywords: [
    "about DocConnect",
    "telehealth mission",
    "clinical leadership",
    "doctor verification",
    "healthcare governance",
    "digital medicine",
  ],
  openGraph: {
    title: "About Us - Our Mission & Clinical Leadership | DocConnect",
    description:
      "Learn about DocConnect's mission to make certified clinical telemedicine accessible to everyone.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
