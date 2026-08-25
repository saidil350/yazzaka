"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import {
  Menu,
  RotateCcw,
  ExternalLink,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminTopbar({
  isCollapsed,
  onToggleCollapse,
  onToggleMobileSidebar,
}: {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onToggleMobileSidebar?: () => void;
}) {
  const pathname = usePathname();
  const { role } = useAuth();
  const { resetToDefault, messages } = useSchoolData();
  const { toast } = useToast();

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin mereset seluruh data simulasi ke pengaturan awal sekolah?")) {
      resetToDefault();
      toast("Seluruh data berhasil direset ke seed awal!", "success");
    }
  };

  const newMessages = messages.filter((m) => m.status === "new").length;

  const getBreadcrumb = () => {
    const parts = pathname.replace("/admin", "").split("/").filter(Boolean);
    if (parts.length === 0) return "Dashboard";
    return parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace("-", " "))
      .join(" / ");
  };

  return (
    <header
      role="banner"
      className="h-16 flex items-center justify-between gap-4 bg-white/90 backdrop-blur-md border-b border-[#E8E2D8] px-4 sm:px-6 sticky top-0 z-30 shadow-2xs shrink-0"
    >
      {/* ── Left: Toggle + Breadcrumb ─────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Buka/tutup sidebar navigasi"
          className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#E8E2D8] bg-white text-stone-600 hover:bg-[#FAF6EE] hover:text-[#FA6400] transition-colors shadow-2xs cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Besarkan sidebar" : "Kecilkan sidebar"}
          title={isCollapsed ? "Besarkan sidebar" : "Kecilkan sidebar"}
          className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E2D8] bg-white text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] hover:border-[#FED7AA] transition-colors shadow-2xs cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-extrabold text-[#FA6400]">CMS Panel</span>
            <span className="text-[#E8E2D8]">/</span>
            <span className="font-extrabold text-[#1E2330] truncate">{getBreadcrumb()}</span>
          </div>
        </div>
      </div>

      {/* ── Right: Tools ──────────────────────────────── */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Current Role Badge (read-only, dikelola server-side) */}
        <Badge
          variant="secondary"
          className="h-9 px-3 rounded-full text-xs font-extrabold uppercase border-2 border-[#E8E2D8] bg-white text-[#1E2330]"
        >
          {role.replace("_", " ")}
        </Badge>

        {/* Message Notification Bell */}
        {newMessages > 0 ? (
          <Link href="/admin/settings/pesan" aria-label={`${newMessages} pesan baru`}>
            <div className="relative h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#FED7AA] bg-[#FFF0E5] text-[#FA6400] hover:bg-[#FFE3CF] transition-colors cursor-pointer shadow-2xs">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-[#FA6400] text-[9px] font-extrabold text-white shadow-xs">
                {newMessages}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin/settings/pesan" aria-label="Kotak pesan masuk">
            <div className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#E8E2D8] bg-white text-stone-500 hover:bg-[#FAF6EE] hover:text-[#FA6400] transition-colors cursor-pointer shadow-2xs">
              <Bell className="h-4 w-4" />
            </div>
          </Link>
        )}

        {/* Reset Demo Data */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          title="Reset Data Demo ke Seed Awal"
          aria-label="Reset data demo"
          className="hidden xl:inline-flex h-9 w-9 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        {/* Live Preview Button */}
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-extrabold gap-1.5 rounded-full border-2 border-[#E8E2D8] hover:border-[#FA6400] hover:bg-[#FAF6EE] hover:text-[#FA6400] text-[#1E2330] shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#FA6400]" />
            <span className="hidden sm:inline">Lihat Web Publik</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
