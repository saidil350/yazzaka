"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load preferensi collapse dari localStorage jika tersedia
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yazzakka_admin_sidebar_collapsed");
      if (saved !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- dibaca setelah hidrasi, bukan saat render
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Abaikan error SSR/localStorage
    }
  }, []);

  // Proteksi rute admin — arahkan ke /login jika tidak memiliki sesi aktif
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("next", window.location.pathname);
      router.replace(loginUrl.pathname + loginUrl.search);
    }
  }, [isInitialized, isAuthenticated, router]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("yazzakka_admin_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  // State loading sementara saat verifikasi sesi inisialisasi
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FCF8F1] text-[#1E2330] gap-3">
        <div className="h-7 w-7 rounded-full border-2 border-[#FA6400] border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-stone-500">Memverifikasi sesi pengelola...</p>
      </div>
    );
  }

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
