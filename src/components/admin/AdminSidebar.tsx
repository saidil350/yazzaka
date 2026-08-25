"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const { role, currentUser } = useAuth();
  const { messages, profile } = useSchoolData();

  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    if (pathname.includes("/admin/content")) return "content";
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
      roles: ["super_admin", "admin", "editor", "admission_staff", "viewer"],
    },
    {
      type: "single",
      title: "Tata Letak Beranda",
      href: "/admin/pages/beranda",
      icon: SlidersHorizontal,
      roles: ["super_admin", "admin", "editor"],
    },
    {
      type: "group",
      key: "content",
      title: "Konten Landing Page",
      icon: Layers,
      roles: ["super_admin", "admin", "editor", "admission_staff"],
      items: [
        { label: "Program Pendidikan", href: "/admin/content/program", icon: GraduationCap },
        { label: "Fasilitas Kampus", href: "/admin/content/fasilitas", icon: Building2 },
        { label: "Prestasi Santri", href: "/admin/content/pengumuman", icon: Trophy },
        { label: "Testimoni Wali & Alumni", href: "/admin/content/testimoni", icon: Quote },
        { label: "Berita & Artikel", href: "/admin/content/berita", icon: FileText },
      ],
    },
    {
      type: "group",
      key: "settings",
      title: "Identitas & Kontak",
      icon: Settings,
      roles: ["super_admin", "admin"],
      items: [
        { label: "Profil & Slogan", href: "/admin/organization/profil", icon: Globe },
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
      roles: ["super_admin", "admin", "editor"],
    },
    {
      type: "single",
      title: "Manajemen Pengguna",
      href: "/admin/users",
      icon: Users,
      roles: ["super_admin", "admin"],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Navigasi CMS Landing Page"
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col h-screen",
          "bg-[#FAF6EE] text-[#1E2330]",
          "border-r border-[#E8E2D8]",
          "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0",
          // Mobile state
          isMobileOpen
            ? "translate-x-0 w-64 shadow-2xl"
            : "-translate-x-full lg:translate-x-0",
          // Desktop state
          "lg:static lg:z-30 lg:shadow-none",
          isCollapsed ? "lg:w-20" : "lg:w-64",
        ].join(" ")}
      >
        {/* ── Brand Header (Full Logo Clean) ──────────────────────── */}
        <div
          className={[
            "h-16 px-4 flex items-center border-b border-[#E8E2D8] bg-white shrink-0",
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
                  "object-contain transition-all duration-200 group-hover:scale-[1.02]",
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
              className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:text-[#FA6400] hover:bg-[#FFF0E5] transition-colors cursor-pointer shrink-0"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Active User Profile Strip ─────────────────────────────── */}
        <div
          className={[
            "py-2.5 border-b border-[#E8E2D8] bg-white/60 shrink-0",
            isCollapsed ? "px-2 text-center" : "px-3.5",
          ].join(" ")}
        >
          {isCollapsed ? (
            <div
              className="flex justify-center"
              title={`${currentUser?.name ?? "Administrator"} (${role.replace("_", " ")})`}
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-[#FFF0E5] border border-[#FED7AA] flex items-center justify-center text-[#FA6400] text-xs font-extrabold shadow-2xs">
                  {currentUser?.name?.charAt(0) ?? "A"}
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-[#FFF0E5] border border-[#FED7AA] flex items-center justify-center text-[#FA6400] text-xs font-extrabold shrink-0 shadow-2xs">
                  {currentUser?.name?.charAt(0) ?? "A"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#1E2330] truncate">
                    {currentUser?.name ?? "Administrator"}
                  </p>
                  <p className="text-[10px] text-stone-500 font-bold capitalize truncate">
                    {role.replace("_", " ")}
                  </p>
                </div>
              </div>
              <span
                className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.6)] shrink-0"
                title="Online"
              />
            </div>
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
                    "flex items-center rounded-full text-xs font-bold transition-all duration-150 group",
                    isCollapsed
                      ? "justify-center h-11 w-11 mx-auto"
                      : "gap-3 px-3.5 py-2 w-full",
                    isActive
                      ? "bg-[#FA6400] text-white shadow-[0_3px_0_#cc5000] active:translate-y-0.5"
                      : "text-stone-700 hover:text-[#1E2330] hover:bg-white shadow-2xs hover:shadow-xs",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-white" : "text-stone-500 group-hover:text-[#FA6400]",
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
                      "flex items-center justify-center h-11 w-11 rounded-full text-xs font-bold transition-all duration-150 group cursor-pointer",
                      hasActiveChild
                        ? "text-[#FA6400] bg-white border border-[#FED7AA] shadow-xs"
                        : "text-stone-700 hover:text-[#FA6400] hover:bg-white",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-4 w-4 shrink-0 transition-colors",
                        hasActiveChild ? "text-[#FA6400]" : "text-stone-500 group-hover:text-[#FA6400]",
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
                    "w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-bold",
                    "transition-all duration-150 cursor-pointer group",
                    hasActiveChild
                      ? "text-[#FA6400] bg-white border border-[#FED7AA] shadow-xs"
                      : "text-stone-700 hover:text-[#1E2330] hover:bg-white",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={[
                        "h-4 w-4 shrink-0 transition-colors",
                        hasActiveChild ? "text-[#FA6400]" : "text-stone-500 group-hover:text-[#FA6400]",
                      ].join(" ")}
                    />
                    <span>{group.title}</span>
                  </span>
                  <ChevronRight
                    className={[
                      "h-3.5 w-3.5 text-stone-400 transition-transform duration-200 shrink-0",
                      isGroupOpen ? "rotate-90 text-[#FA6400]" : "",
                    ].join(" ")}
                  />
                </button>

                {isGroupOpen && (
                  <div className="ml-4 pl-3 py-1 space-y-1 border-l-2 border-[#E8E2D8]">
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
                            "flex items-center justify-between px-3 py-1.5 rounded-full text-xs",
                            "transition-all duration-150 group",
                            isActive
                              ? "bg-[#FFF0E5] text-[#FA6400] font-extrabold border border-[#FED7AA] shadow-2xs"
                              : "text-stone-600 hover:text-[#FA6400] hover:bg-white font-medium",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2 truncate">
                            {SubIcon && (
                              <SubIcon
                                className={[
                                  "h-3.5 w-3.5 shrink-0",
                                  isActive ? "text-[#FA6400]" : "text-stone-400 group-hover:text-[#FA6400]",
                                ].join(" ")}
                              />
                            )}
                            <span className="truncate">{item.label}</span>
                          </span>
                          {item.badge && (
                            <span className="ml-2 flex h-4 min-w-4 px-1.5 items-center justify-center rounded-full bg-[#FA6400] text-[10px] font-bold text-white shrink-0 shadow-xs">
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

        {/* ── Footer Link to Public Landing Page ────────────────────── */}
        <div
          className={[
            "border-t border-[#E8E2D8] bg-white shrink-0",
            isCollapsed ? "p-2 text-center" : "p-3",
          ].join(" ")}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="Buka Situs Publik"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-[#FFF0E5] text-[#C2410C] hover:bg-[#FA6400] hover:text-white border border-[#FED7AA] transition-all shadow-2xs"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Besarkan sidebar"
                  aria-label="Besarkan sidebar"
                  className="hidden lg:flex items-center justify-center h-8 w-8 rounded-full text-stone-400 hover:text-[#FA6400] hover:bg-[#FAF6EE] transition-colors cursor-pointer"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-extrabold",
                "bg-[#FFF0E5] text-[#C2410C] hover:bg-[#FA6400] hover:text-white border border-[#FED7AA]",
                "transition-all duration-150 shadow-2xs group active:scale-95",
              ].join(" ")}
            >
              <span>Buka Situs Publik</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-current group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
