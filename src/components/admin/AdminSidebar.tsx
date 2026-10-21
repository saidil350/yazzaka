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
  ExternalLink,
  SlidersHorizontal,
  GraduationCap,
  Building2,
  Trophy,
  Quote,
  FileText,
  PhoneCall,
  Globe,
  Mail,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  UserPlus,
  Compass,
} from "lucide-react";

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
  const { role, currentUser, logout } = useAuth();
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

  const navGroups = [
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
      type: "group",
      key: "content",
      title: "Konten Landing Page",
      icon: Layers,
      roles: ["super_admin", "editor"],
      items: [
        { label: "Penerimaan Santri (PPDB)", href: "/admin/content/pendaftaran", icon: UserPlus },
        { label: "Program Pendidikan", href: "/admin/content/program", icon: GraduationCap },
        { label: "Fasilitas Sekolah", href: "/admin/content/fasilitas", icon: Building2 },
        { label: "Prestasi Santri", href: "/admin/content/pengumuman", icon: Trophy },
        { label: "Pimpinan & Dewan Asatidz", href: "/admin/organization/tim", icon: Users },
        { label: "Testimoni Wali & Alumni", href: "/admin/content/testimoni", icon: Quote },
        { label: "Berita & Artikel", href: "/admin/content/berita", icon: FileText },
      ],
    },
    {
      type: "group",
      key: "settings",
      title: "Identitas & Kontak",
      icon: Settings,
      roles: ["super_admin"],
      items: [
        { label: "Profil & Slogan", href: "/admin/organization/profil", icon: Globe },
        { label: "Visi & Misi", href: "/admin/organization/visi-misi", icon: Compass },
        { label: "Kontak & Sosmed", href: "/admin/settings/contact", icon: PhoneCall },
        {
          label: "Pesan Masuk",
          href: "/admin/settings/pesan",
          icon: Mail,
          badge: newMessagesCount > 0 ? `${newMessagesCount}` : undefined,
        },
        { label: "SEO Global", href: "/admin/settings/seo", icon: Settings },
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

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Navigasi CMS Landing Page"
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col h-screen",
          "bg-muted text-foreground",
          "border-r border-border",
          "transition-all duration-300 shrink-0",
          // Mobile state
          isMobileOpen
            ? "translate-x-0 w-64 shadow-lg"
            : "-translate-x-full lg:translate-x-0",
          // Desktop state
          "lg:static lg:z-30 lg:shadow-none",
          isCollapsed ? "lg:w-20" : "lg:w-64",
        ].join(" ")}
      >
        {/* ── Brand Header (Full Logo Clean) ──────────────────────── */}
        <div
          className={[
            "h-16 px-4 flex items-center border-b border-border bg-card shrink-0",
            isCollapsed ? "justify-center" : "justify-between gap-2",
          ].join(" ")}
        >
          <Link
            href="/admin"
            className={[
              "flex items-center group py-1 min-w-0 flex-1",
              isCollapsed ? "justify-center" : "justify-start",
            ].join(" ")}
            title="Dashboard Yazzakka"
          >
            <div className="flex items-center">
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
                className={[
                  "w-auto object-contain transition-all duration-200",
                  isCollapsed ? "h-7 max-w-[36px]" : "h-8 max-w-[160px]",
                ].join(" ")}
                priority
              />
            </div>
          </Link>

          {/* Desktop Toggle Collapse Button */}
          {!isCollapsed && onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label="Kecilkan sidebar"
              title="Kecilkan sidebar"
              className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>


        {/* ── Navigation Menu (Scroll Mandiri & Bebas Bug) ──────────── */}
        <nav
          aria-label="Menu Utama CMS"
          className={[
            "flex-1 py-3 space-y-1.5 overflow-y-auto overflow-x-hidden",
            isCollapsed ? "px-2" : "px-3",
          ].join(" ")}
        >
          {navGroups.map((group) => {
            const isAllowed = role === "super_admin" || group.roles.includes(role);
            if (!isAllowed) return null;

            // Single item
            if (group.type === "single") {
              const isActive = pathname === group.href;
              const Icon = group.icon!;

              return (
                <Link
                  key={group.href}
                  href={group.href!}
                  onClick={onMobileClose}
                  aria-current={isActive ? "page" : undefined}
                  title={isCollapsed ? group.title : undefined}
                  className={[
                    "flex items-center rounded-md text-xs font-medium transition-colors duration-150 group",
                    isCollapsed
                      ? "justify-center h-11 w-11 mx-auto"
                      : "gap-3 px-3.5 py-2 w-full",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-card",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground",
                    ].join(" ")}
                  />
                  {!isCollapsed && <span>{group.title}</span>}
                </Link>
              );
            }

            // Group with collapsible sub-items
            const isGroupOpen = openSubmenu === group.key;
            const Icon = group.icon!;
            const hasActiveChild = group.items?.some(
              (item) => pathname === item.href || pathname.startsWith(item.href + "/")
            );

            // Tampilan saat Collapsed (Mode Ikon Ringkas)
            if (isCollapsed) {
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
                    className={[
                      "flex items-center justify-center h-11 w-11 rounded-md text-xs font-medium transition-colors duration-150 group cursor-pointer",
                      hasActiveChild
                        ? "text-primary bg-card border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-card",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-4 w-4 shrink-0 transition-colors",
                        hasActiveChild ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      ].join(" ")}
                    />
                  </button>
                </div>
              );
            }

            // Tampilan Normal (Lebar Penuh)
            return (
              <div key={group.key} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(group.key!)}
                  aria-expanded={isGroupOpen}
                  className={[
                    "w-full flex items-center justify-between px-3.5 py-2 rounded-md text-xs font-medium",
                    "transition-colors duration-150 cursor-pointer group",
                    hasActiveChild
                      ? "text-primary bg-card border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-card",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={[
                        "h-4 w-4 shrink-0 transition-colors",
                        hasActiveChild ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      ].join(" ")}
                    />
                    <span>{group.title}</span>
                  </span>
                  <ChevronRight
                    className={[
                      "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
                      isGroupOpen ? "rotate-90 text-primary" : "",
                    ].join(" ")}
                  />
                </button>

                {isGroupOpen && (
                  <div className="ml-4 pl-3 py-1 space-y-1 border-l-2 border-border">
                    {group.items?.map((item) => {
                      const isActive = pathname === item.href;
                      const SubIcon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onMobileClose}
                          aria-current={isActive ? "page" : undefined}
                          className={[
                            "flex items-center justify-between px-3 py-1.5 rounded-md text-xs",
                            "transition-colors duration-150 group",
                            isActive
                              ? "bg-primary/10 text-primary font-medium border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-card font-medium",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2 truncate">
                            {SubIcon && (
                              <SubIcon
                                className={[
                                  "h-3.5 w-3.5 shrink-0",
                                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                                ].join(" ")}
                              />
                            )}
                            <span className="truncate">{item.label}</span>
                          </span>
                          {item.badge && (
                            <span className="ml-2 flex h-4 min-w-4 px-1.5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground shrink-0">
                              {item.badge}
                            </span>
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

        {/* ── Footer Logout & Sidebar Toggle ───────────────────────── */}
        <div
          className={[
            "border-t border-border bg-card shrink-0",
            isCollapsed ? "p-2 text-center space-y-2" : "p-3 space-y-2",
          ].join(" ")}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar dari CMS (Logout)"
                aria-label="Keluar dari CMS"
                className="flex items-center justify-center h-10 w-10 rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Besarkan sidebar"
                  aria-label="Besarkan sidebar"
                  className="hidden lg:flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className={[
                "w-full flex items-center justify-between px-4 py-2.5 rounded-md text-xs font-medium",
                "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/20",
                "transition-colors duration-150 group cursor-pointer",
              ].join(" ")}
            >
              <span>Keluar (Logout)</span>
              <LogOut className="h-3.5 w-3.5 shrink-0 text-destructive group-hover:text-destructive-foreground transition-colors" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
