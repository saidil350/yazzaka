"use client";

import React from "react";
import { SchoolDataProvider } from "@/context/SchoolDataContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import type { HeroContent, PageSectionConfig } from "@/lib/types";

export function Providers({
  children,
  initialSections,
  initialHero,
}: {
  children: React.ReactNode;
  initialSections?: PageSectionConfig[];
  initialHero?: Partial<HeroContent> | null;
}) {
  return (
    <AuthProvider>
      <SchoolDataProvider initialSections={initialSections} initialHero={initialHero}>
        <ToastProvider>{children}</ToastProvider>
      </SchoolDataProvider>
    </AuthProvider>
  );
}
