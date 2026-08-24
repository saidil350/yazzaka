"use client";

import React from "react";
import { SchoolDataProvider } from "@/context/SchoolDataContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SchoolDataProvider>
        <ToastProvider>{children}</ToastProvider>
      </SchoolDataProvider>
    </AuthProvider>
  );
}
