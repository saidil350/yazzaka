"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/lib/types";
import {
  Menu,
  RotateCcw,
  ExternalLink,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const { role, switchRole } = useAuth();
  const { resetToDefault, messages } = useSchoolData();
  const { toast } = useToast();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    switchRole(newRole);
    toast(`Peran dialihkan ke: ${newRole.replace("_", " ").toUpperCase()}`, "info");
  };

  const handleReset = () => {
    if (confirm("Apakah Anda yakin ingin mereset seluruh data simulasi ke pengaturan awal sekolah?")) {
      resetToDefault();
      toast("Seluruh data berhasil direset ke seed awal!", "success");
    }
  };

  const newMessages = messages.filter((m) => m.status === "new").length;

  const getBreadcrumb = () => {
    const parts = pathname.replace("/admin", "").split("/").filter(Boolean);
    return parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace("-", " "))
      .join(" / ");
  };

  return (
    <header
      role="banner"
      className="h-14 flex items-center justify-between gap-4 bg-background border-b border-border px-4 sm:px-5 sticky top-0 z-30"
    >
      {/* ── Left: Toggle + Breadcrumb ─────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Buka/tutup sidebar navigasi"
          className="lg:hidden h-8 w-8 inline-flex items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden sm:block min-w-0">
          <span className="text-xs text-muted-foreground block">
            Admin
            {getBreadcrumb() && (
              <span className="text-foreground font-medium"> / {getBreadcrumb()}</span>
            )}
          </span>
        </div>
      </div>

      {/* ── Right: Tools ──────────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Role Switcher */}
        <div className="flex items-center h-8 px-2.5 rounded-md border border-input bg-background text-xs text-muted-foreground">
          <select
            value={role}
            onChange={handleRoleChange}
            aria-label="Ganti peran pengguna"
            className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
          >
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="admission_staff">Admission Staff</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Message Notification Bell */}
        {newMessages > 0 && (
          <Link href="/admin/settings/pesan" aria-label={`${newMessages} pesan baru`}>
            <div className="relative h-8 w-8 inline-flex items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150 cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {newMessages}
              </span>
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
          className="hidden xl:inline-flex h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>

        {/* Live Preview */}
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <ExternalLink className="h-3 w-3" />
            <span className="hidden sm:inline">Lihat Web</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
