"use client";

import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { TrustStats } from "@/components/public/TrustStats";
import { EditorialAbout } from "@/components/public/EditorialAbout";
import { ProgramsSection } from "@/components/public/ProgramsSection";
import { WhyUsSection } from "@/components/public/WhyUsSection";
import { FacilitiesSection } from "@/components/public/FacilitiesSection";
import { AchievementsSection } from "@/components/public/AchievementsSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { AdmissionCTA } from "@/components/public/AdmissionCTA";
import { useSchoolData } from "@/context/SchoolDataContext";

export default function HomePage() {
  const { sections } = useSchoolData();

  // Memeriksa status enabled seksi beranda sesuai urutan konfigurasi CMS
  const isSectionEnabled = (key: string) => {
    const sec = sections.find((s) => s.key === key);
    return sec ? sec.isEnabled : true;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {isSectionEnabled("hero") && <HeroSection />}
        {isSectionEnabled("stats") && <TrustStats />}
        {isSectionEnabled("about") && <EditorialAbout />}
        {isSectionEnabled("programs") && <ProgramsSection />}
        {isSectionEnabled("whyus") && <WhyUsSection />}
        {isSectionEnabled("facilities") && <FacilitiesSection />}
        {isSectionEnabled("achievements") && <AchievementsSection />}
        {isSectionEnabled("testimonials") && <TestimonialsSection />}
        {isSectionEnabled("admission_cta") && <AdmissionCTA />}
      </main>
      <Footer />
    </div>
  );
}
