"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load preferensi collapse dari localStorage jika tersedia
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yazzakka_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Abaikan error SSR/localStorage
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("yazzakka_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FCF8F1] text-[#1E2330] flex selection:bg-[#FFF0E5] selection:text-[#FA6400]">
      {/* Sidebar Navigasi Independen & Bebas Bug Scroll */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Konten Utama Mandiri dengan Scroll Terpisah */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminTopbar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onToggleMobileSidebar={() => setIsMobileOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
