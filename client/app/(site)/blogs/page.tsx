import React from "react";
import type { Metadata } from "next";
import { BlogsClient } from "@/components/site/blogs/BlogsClient";

export const metadata: Metadata = {
  title: "Health Articles & Medical Advice | DocConnect",
  description:
    "Read health tips, clinical guidelines, and wellness articles written by certified medical professionals.",
  keywords: [
    "health articles",
    "medical advice",
    "doctor blogs",
    "telehealth guidance",
    "wellness tips",
  ],
  openGraph: {
    title: "Health Articles & Medical Advice | DocConnect",
    description:
      "Read health tips, clinical guidelines, and wellness articles written by certified medical professionals.",
    type: "website",
  },
};

export default function BlogsPage() {
  return <BlogsClient />;
}
