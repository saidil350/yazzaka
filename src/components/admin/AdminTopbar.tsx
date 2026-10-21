"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Menu, ExternalLink, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopbar({
  onToggleMobileSidebar,
}: {
  onToggleMobileSidebar?: () => void;
}) {
  const pathname = usePathname();
  const { role, currentUser } = useAuth();
  const { messages } = useSchoolData();

  const newMessages = messages.filter((m) => m.status === "new").length;
  const isSuperAdmin = role === "super_admin";

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
        {/* Active User */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
            {currentUser?.name?.charAt(0) ?? "A"}
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

        {/* Message Notification Bell — menu Pesan Masuk hanya untuk super_admin */}
        {isSuperAdmin && (
          <Link
            href="/admin/settings/pesan"
            aria-label={newMessages > 0 ? `${newMessages} pesan baru` : "Kotak pesan masuk"}
            className="relative h-9 w-9 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell className="h-4 w-4" />
            {newMessages > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {newMessages}
              </span>
            )}
          </Link>
        )}

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
