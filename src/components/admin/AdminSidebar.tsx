"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Image as ImageIcon,
  Building2,
  Settings,
  Users,
  ChevronRight,
  GraduationCap,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { role, currentUser } = useAuth();
  const { messages } = useSchoolData();

  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(() => {
    if (pathname.includes("/admin/pages")) return "pages";
    if (pathname.includes("/admin/content")) return "content";
    if (pathname.includes("/admin/media")) return "media";
    if (pathname.includes("/admin/organization")) return "organization";
    if (pathname.includes("/admin/settings")) return "settings";
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
      type: "group",
      key: "pages",
      title: "Pages",
      icon: FileText,
      roles: ["super_admin", "admin", "editor"],
      items: [
        { label: "Beranda", href: "/admin/pages/beranda" },
        { label: "Tentang Kami", href: "/admin/pages/tentang-kami" },
        { label: "Program", href: "/admin/pages/program" },
        { label: "Kontak", href: "/admin/pages/kontak" },
      ],
    },
    {
      type: "group",
      key: "content",
      title: "Content",
      icon: Layers,
      roles: ["super_admin", "admin", "editor", "admission_staff"],
      items: [
        { label: "Berita & Artikel", href: "/admin/content/berita" },
        { label: "Kegiatan / Events", href: "/admin/content/kegiatan" },
        { label: "Program Pendidikan", href: "/admin/content/program" },
        { label: "Prestasi & Pengumuman", href: "/admin/content/pengumuman" },
        { label: "Fasilitas Kampus", href: "/admin/content/fasilitas" },
        { label: "Pendaftaran (PPDB)", href: "/admin/content/pendaftaran" },
        { label: "Testimoni", href: "/admin/content/testimoni" },
      ],
    },
    {
      type: "group",
      key: "media",
      title: "Media",
      icon: ImageIcon,
      roles: ["super_admin", "admin", "editor"],
      items: [
        { label: "Media Library", href: "/admin/media" },
        { label: "Images", href: "/admin/media?type=image" },
        { label: "Videos", href: "/admin/media?type=video" },
        { label: "Documents", href: "/admin/media?type=document" },
      ],
    },
    {
      type: "group",
      key: "organization",
      title: "Organization",
      icon: Building2,
      roles: ["super_admin", "admin"],
      items: [
        { label: "Profil Sekolah", href: "/admin/organization/profil" },
        { label: "Visi & Misi", href: "/admin/organization/visi-misi" },
        { label: "Struktur Organisasi", href: "/admin/organization/struktur" },
        { label: "Tim & Tenaga Pendidik", href: "/admin/organization/tim" },
      ],
    },
    {
      type: "group",
      key: "settings",
      title: "Website Settings",
      icon: Settings,
      roles: ["super_admin", "admin"],
      items: [
        { label: "General & Branding", href: "/admin/settings/general" },
        { label: "SEO Global", href: "/admin/settings/seo" },
        { label: "Social Media", href: "/admin/settings/social" },
        { label: "Contact Info", href: "/admin/settings/contact" },
        {
          label: "Pesan Masuk",
          href: "/admin/settings/pesan",
          badge: newMessagesCount > 0 ? `${newMessagesCount}` : undefined,
        },
      ],
    },
    {
      type: "single",
      title: "Users",
      href: "/admin/users",
      icon: Users,
      roles: ["super_admin", "admin"],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        aria-label="Navigation CMS"
        className={[
          "fixed inset-y-0 left-0 z-50 w-60 flex flex-col",
          "bg-[#0f172a] text-slate-300",
          "border-r border-white/[0.08]",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* ── Brand Header ───────────────────────────── */}
        <div className="flex flex-col">
          <div className="h-14 px-4 flex items-center gap-3 border-b border-white/[0.08]">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-md flex items-center justify-center bg-white/10 shrink-0">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-white block leading-none truncate">
                  CMS Yazzaka
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                  Admin Dashboard
                </span>
              </div>
            </Link>
          </div>

          {/* User Identity Strip */}
          <div className="px-3 py-2.5 border-b border-white/[0.08]">
            <p className="text-xs font-medium text-white truncate">
              {currentUser?.name ?? "Administrator"}
            </p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {role.replace("_", " ")}
            </p>
          </div>

          {/* Navigation */}
          <nav
            aria-label="Menu CMS"
            className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto"
          >
            {navGroups.map((group) => {
              const isAllowed = role === "super_admin" || group.roles.includes(role);
              if (!isAllowed) return null;

              // Single link
              if (group.type === "single") {
                const isActive = pathname === group.href;
                const Icon = group.icon!;
                return (
                  <Link
                    key={group.href}
                    href={group.href!}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm",
                      "transition-colors duration-150",
                      isActive
                        ? "bg-white/[0.1] text-white font-medium"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.05] font-normal",
                    ].join(" ")}
                  >
                    <Icon className={[
                      "h-4 w-4 shrink-0",
                      isActive ? "text-white" : "text-slate-500",
                    ].join(" ")} />
                    <span>{group.title}</span>
                  </Link>
                );
              }

              // Group with submenu
              const isGroupOpen = openSubmenu === group.key;
              const Icon = group.icon!;
              const hasActiveChild = group.items?.some(
                (item) => pathname === item.href || pathname.startsWith(item.href + "/")
              );

              return (
                <div key={group.key}>
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(group.key!)}
                    aria-expanded={isGroupOpen}
                    className={[
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm",
                      "transition-colors duration-150 cursor-pointer",
                      hasActiveChild
                        ? "text-white bg-white/[0.05] font-medium"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.05] font-normal",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={[
                        "h-4 w-4 shrink-0",
                        hasActiveChild ? "text-white" : "text-slate-500",
                      ].join(" ")} />
                      <span>{group.title}</span>
                    </span>
                    <ChevronRight
                      className={[
                        "h-3.5 w-3.5 text-slate-600 transition-transform duration-150 shrink-0",
                        isGroupOpen ? "rotate-90" : "",
                      ].join(" ")}
                    />
                  </button>

                  {isGroupOpen && (
                    <div className="ml-4 mt-0.5 pl-3 py-1 space-y-0.5 border-l border-white/[0.08]">
                      {group.items?.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            aria-current={isActive ? "page" : undefined}
                            className={[
                              "flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px]",
                              "transition-colors duration-150",
                              isActive
                                ? "text-white bg-white/[0.08] font-medium"
                                : "text-slate-500 hover:text-white hover:bg-white/[0.05] font-normal",
                            ].join(" ")}
                          >
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span className="ml-2 flex h-4 min-w-4 px-1 items-center justify-center rounded bg-destructive text-[9px] font-bold text-white shrink-0">
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
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div className="px-2 py-2 border-t border-white/[0.08]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs",
              "text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]",
              "transition-colors duration-150",
            ].join(" ")}
          >
            <span>Lihat Situs Publik</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </Link>
        </div>
      </aside>
    </>
  );
}
