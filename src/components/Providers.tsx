"use client";

import React from "react";
import { SchoolDataProvider } from "@/context/SchoolDataContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";
import type { PageSectionConfig } from "@/lib/types";

export function Providers({
  children,
  initialSections,
}: {
  children: React.ReactNode;
  initialSections?: PageSectionConfig[];
}) {
  return (
    <AuthProvider>
      <SchoolDataProvider initialSections={initialSections}>
        <ToastProvider>{children}</ToastProvider>
      </SchoolDataProvider>
    </AuthProvider>
  );
}
