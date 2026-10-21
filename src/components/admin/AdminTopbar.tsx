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
  const { role, currentUser } = useAuth();
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
      className="h-16 flex items-center justify-between gap-4 bg-card border-b border-border px-4 sm:px-6 sticky top-0 z-30 shrink-0"
    >
      {/* ── Left: Toggle + Breadcrumb ─────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Buka/tutup sidebar navigasi"
          className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Besarkan sidebar" : "Kecilkan sidebar"}
          title={isCollapsed ? "Besarkan sidebar" : "Kecilkan sidebar"}
          className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground">CMS Panel</span>
            <span className="text-border">/</span>
            <span className="font-medium text-foreground truncate">{getBreadcrumb()}</span>
          </div>
        </div>
      </div>

      {/* ── Right: Tools ──────────────────────────────── */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Active User Profile Pill */}
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-border bg-card">
          <div className="relative shrink-0">
            <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-medium">
              {currentUser?.name?.charAt(0) ?? "A"}
            </div>
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success border border-card" />
          </div>
          <div className="min-w-0 hidden sm:block text-left">
            <p className="text-xs font-medium text-foreground leading-none truncate max-w-[140px]">
              {currentUser?.name ?? "Super Admin Yazzaka"}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize leading-tight mt-0.5 truncate">
              {role.replace("_", " ")}
            </p>
          </div>
        </div>

        {/* Message Notification Bell */}
        {newMessages > 0 ? (
          <Link href="/admin/settings/pesan" aria-label={`${newMessages} pesan baru`}>
            <div className="relative h-9 w-9 inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                {newMessages}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/admin/settings/pesan" aria-label="Kotak pesan masuk">
            <div className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
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
          className="hidden xl:inline-flex h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        {/* Live Preview Button */}
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lihat Web Publik</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
