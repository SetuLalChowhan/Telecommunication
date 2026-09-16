import React from "react";
import Banner from "@/components/site/home/Banner";
import SpecialtiesSection from "@/components/site/home/SpecialtiesSection";
import HowItWorksSection from "@/components/site/home/HowItWorksSection";
import DoctorsSection from "@/components/site/home/DoctorsSection";
import AdviceSection from "@/components/site/home/AdviceSection";
import TestimonialsSection from "@/components/site/home/TestimonialsSection";
import BlogSection from "@/components/site/home/BlogSection";

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