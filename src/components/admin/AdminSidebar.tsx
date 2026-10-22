"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import {
  LayoutDashboard,
  Layers,
  Image as ImageIcon,
  Settings,
  Users,
  ChevronRight,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export interface AdminSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAuth();
  const { messages, profile } = useSchoolData();

  const handleLogout = async () => {
    await logout();
    onMobileClose();
    router.push("/login");
  };

  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    if (pathname.includes("/admin/content") || pathname.includes("/admin/organization/tim")) return "content";
    if (pathname.includes("/admin/settings") || pathname.includes("/admin/organization")) return "settings";
    return null;
  });

  const toggleSubmenu = (menuKey: string) => {
    setOpenSubmenu(openSubmenu === menuKey ? null : menuKey);
  };

  const navGroups: Array<{
    type: "single" | "group";
    key?: string;
    title: string;
    href?: string;
    icon?: React.ElementType;
    roles: string[];
    items?: Array<{ label: string; href: string; badge?: string; roles?: string[] }>;
  }> = [
    {
      type: "single",
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["super_admin", "editor"],
    },
    {
      type: "single",
      title: "Tata Letak Beranda",
      href: "/admin/pages/beranda",
      icon: SlidersHorizontal,
      roles: ["super_admin", "editor"],
    },
    {
      type: "single",
      title: "Berita & Artikel",
      href: "/admin/berita",
      icon: Newspaper,
      roles: ["super_admin", "editor"],
    },
    {
      type: "group",
      key: "content",
      title: "Konten Landing Page",
      icon: Layers,
      roles: ["super_admin", "editor"],
      items: [
        // Hero disimpan di school_profile via /api/profile — mutasi hanya
        // untuk super_admin (lihat ADMIN_ONLY_MUTATION_PREFIXES di src/proxy.ts).
        { label: "Hero Beranda", href: "/admin/content/hero", roles: ["super_admin"] },
        { label: "Penerimaan Santri (PPDB)", href: "/admin/content/pendaftaran" },
        { label: "Program Pendidikan", href: "/admin/content/program" },
        { label: "Fasilitas Sekolah", href: "/admin/content/fasilitas" },
        { label: "Prestasi Santri", href: "/admin/content/pengumuman" },
        { label: "Agenda & Kegiatan", href: "/admin/content/kegiatan" },
        // Data tim tersimpan via /api/organization — mutasi super_admin-only
        // (ADMIN_ONLY_MUTATION_PREFIXES di src/proxy.ts + gate halaman).
        { label: "Pimpinan & Dewan Asatidz", href: "/admin/organization/tim", roles: ["super_admin"] },
        { label: "Testimoni Wali & Alumni", href: "/admin/content/testimoni" },
      ],
    },
    {
      type: "group",
      key: "settings",
      title: "Identitas & Kontak",
      icon: Settings,
      roles: ["super_admin"],
      items: [
        { label: "Profil & Slogan", href: "/admin/organization/profil" },
        { label: "Visi, Misi & Nilai", href: "/admin/organization/visi-misi" },
        { label: "Kontak & Lokasi", href: "/admin/settings/contact" },
        { label: "Media Sosial", href: "/admin/settings/social" },
        { label: "Branding & Warna", href: "/admin/settings/general" },
        {
          label: "Pesan Masuk",
          href: "/admin/settings/pesan",
          badge: newMessagesCount > 0 ? `${newMessagesCount}` : undefined,
        },
        { label: "SEO Global", href: "/admin/settings/seo" },
      ],
    },
    {
      type: "single",
      title: "Media Library",
      href: "/admin/media",
      icon: ImageIcon,
      roles: ["super_admin", "editor"],
    },
    {
      type: "single",
      title: "Manajemen Pengguna",
      href: "/admin/users",
      icon: Users,
      roles: ["super_admin"],
    },
  ];

  // ── Bagian sidebar yang dibagikan antara tampilan desktop dan drawer mobile ──

  const brandHeader = (collapsed: boolean) => (
    <div
      className={cn(
        "h-16 px-4 flex items-center border-b border-border shrink-0",
        collapsed ? "justify-center" : "justify-between gap-2"
      )}
    >
      <Link
        href="/admin"
        className={cn(
          "flex items-center group py-1 min-w-0 flex-1",
          collapsed ? "justify-center" : "justify-start"
        )}
        title="Dashboard Yazzakka"
      >
        <Image
          src={
            profile?.branding?.logoUrl && profile.branding.logoUrl !== "/logo-yazzaka.svg"
              ? profile.branding.logoUrl
              : "/yazzakka.png"
          }
          alt="Logo Yazzakka"
          width={160}
          height={40}
          style={{ width: "auto", height: "auto" }}
          className={cn(
            "w-auto object-contain",
            collapsed ? "h-7 max-w-9" : "h-8 max-w-40"
          )}
          priority
        />
      </Link>

      {!collapsed && onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Kecilkan sidebar"
          title="Kecilkan sidebar"
          className="hidden lg:inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer shrink-0"
        >
          <PanelLeftClose className="size-4" />
        </button>
      )}
    </div>
  );

  const navMenu = (collapsed: boolean, onNavigate: () => void) => (
    <nav
      aria-label="Menu Utama CMS"
      className={cn(
        "flex-1 py-3 space-y-1 overflow-y-auto overflow-x-hidden",
        collapsed ? "px-2" : "px-3"
      )}
    >
      {navGroups.map((group) => {
        const isAllowed = role === "super_admin" || group.roles.includes(role);
        if (!isAllowed) return null;

        // Item tunggal
        if (group.type === "single") {
          const isActive = pathname === group.href;
          const Icon = group.icon!;

          return (
            <Link
              key={group.href}
              href={group.href!}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? group.title : undefined}
              className={cn(
                "flex items-center rounded-md text-sm font-medium transition-colors group",
                collapsed ? "justify-center h-11 w-11 mx-auto" : "gap-3 px-3 py-2 w-full",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && <span>{group.title}</span>}
            </Link>
          );
        }

        // Grup dengan sub-item yang dapat dilipat
        const isGroupOpen = openSubmenu === group.key;
        const Icon = group.icon!;
        // Item dapat membatasi role sendiri (mis. Hero Beranda hanya super_admin)
        const visibleItems = group.items?.filter((item) => {
          if (!("roles" in item) || !item.roles) return true;
          return role === "super_admin" || item.roles.includes(role);
        });
        const hasActiveChild = visibleItems?.some(
          (item) => pathname === item.href || pathname.startsWith(item.href + "/")
        );

        // Mode collapse desktop: ikon saja
        if (collapsed) {
          return (
            <div key={group.key} className="space-y-1 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (onToggleCollapse) onToggleCollapse();
                  setOpenSubmenu(group.key!);
                }}
                title={`${group.title} (Klik untuk buka)`}
                aria-label={group.title}
                className={cn(
                  "flex items-center justify-center h-11 w-11 rounded-md text-sm font-medium transition-colors group cursor-pointer",
                  hasActiveChild
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    hasActiveChild ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
              </button>
            </div>
          );
        }

        // Mode lebar penuh
        return (
          <div key={group.key} className="space-y-0.5">
            <button
              type="button"
              onClick={() => toggleSubmenu(group.key!)}
              aria-expanded={isGroupOpen}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium",
                "transition-colors cursor-pointer group",
                hasActiveChild
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    hasActiveChild ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{group.title}</span>
              </span>
              <ChevronRight
                className={cn(
                  "size-4 text-muted-foreground transition-transform shrink-0",
                  isGroupOpen && "rotate-90"
                )}
              />
            </button>

            {isGroupOpen && (
              <div className="ml-4 pl-3 border-l border-border py-1 space-y-0.5">
                {visibleItems?.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-card font-normal"
                      )}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-2 h-5 min-w-5 rounded-full px-1.5 tabular-nums shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  const sidebarFooter = (collapsed: boolean) => (
    <div
      className={cn(
        "border-t border-border shrink-0",
        collapsed ? "p-2" : "p-3"
      )}
    >
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar dari CMS (Logout)"
            aria-label="Keluar dari CMS"
            className="flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Besarkan sidebar"
              aria-label="Besarkan sidebar"
              className="hidden lg:flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
            "text-muted-foreground hover:text-foreground hover:bg-card",
            "transition-colors cursor-pointer"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          <span>Keluar</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Sidebar desktop — mode collapse hanya berlaku di sini; drawer mobile selalu penuh */}
      <aside
        aria-label="Navigasi CMS Landing Page"
        className={cn(
          "hidden lg:flex flex-col h-screen shrink-0",
          "bg-muted text-foreground",
          "border-r border-border",
          "transition-[width] duration-200",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {brandHeader(isCollapsed)}
        {navMenu(isCollapsed, () => {})}
        {sidebarFooter(isCollapsed)}
      </aside>

      {/* Navigasi mobile via Sheet */}
      <Sheet
        open={isMobileOpen}
        onOpenChange={(open) => {
          if (!open) onMobileClose();
        }}
      >
        <SheetContent
          side="left"
          aria-label="Navigasi CMS Landing Page"
          className="w-64 max-w-64 p-0 gap-0 bg-muted"
        >
          <SheetTitle className="sr-only">Navigasi CMS Landing Page</SheetTitle>
          {brandHeader(false)}
          {navMenu(false, onMobileClose)}
          {sidebarFooter(false)}
        </SheetContent>
      </Sheet>
    </>
  );
}
