"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import {
  LayoutDashboard,
  Images,
  Image as ImageIcon,
  Inbox,
  School,
  Award,
  CalendarDays,
  MessageSquareQuote,
  SlidersHorizontal,
  Building2,
  Target,
  UsersRound,
  Type,
  MapPin,
  Share2,
  Search,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
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

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  roles?: string[];
}

interface NavSection {
  label: string;
  roles: string[];
  items: NavItem[];
}

export function AdminSidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { role } = useAuth();
  const { messages, profile } = useSchoolData();

  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  const isAllowed = (itemRoles?: string[]) =>
    !itemRoles || role === "super_admin" || itemRoles.includes(role);

  // Item tunggal di paling atas — akses paling sering dipakai.
  const primaryItems: Array<{
    title: string;
    href: string;
    icon: React.ElementType;
    roles: string[];
    badge?: string;
  }> = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["super_admin", "editor"],
    },
    {
      title: "Kotak Masuk",
      href: "/admin/settings/pesan",
      icon: Inbox,
      roles: ["super_admin"],
      badge: newMessagesCount > 0 ? `${newMessagesCount}` : undefined,
    },
  ];

  // Seksi menu selalu terlihat (tanpa submenu lipat) — item dikelompokkan
  // per fungsi agar mudah dipindai. Seksi dengan roles super_admin hilang
  // untuk editor beserta seluruh isinya.
  const navSections: NavSection[] = [
    {
      label: "Konten Situs",
      roles: ["super_admin", "editor"],
      items: [
        { label: "Berita & Artikel", href: "/admin/berita", icon: Newspaper },
        { label: "Program Pendidikan", href: "/admin/content/program", icon: School },
        { label: "Prestasi Santri", href: "/admin/content/pengumuman", icon: Award },
        { label: "Agenda & Kegiatan", href: "/admin/content/kegiatan", icon: CalendarDays },
        { label: "Testimoni Wali & Alumni", href: "/admin/content/testimoni", icon: MessageSquareQuote },
      ],
    },
    {
      label: "Beranda & Media",
      roles: ["super_admin", "editor"],
      items: [
        // Hero disimpan di school_profile via /api/profile — mutasi hanya
        // untuk super_admin (lihat ADMIN_ONLY_MUTATION_PREFIXES di src/proxy.ts).
        { label: "Hero Beranda", href: "/admin/content/hero", icon: Images, roles: ["super_admin"] },
        { label: "Tata Letak Beranda", href: "/admin/pages/beranda", icon: SlidersHorizontal },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      label: "Profil Lembaga",
      roles: ["super_admin"],
      items: [
        { label: "Profil & Slogan", href: "/admin/organization/profil", icon: Building2 },
        { label: "Visi, Misi & Nilai", href: "/admin/organization/visi-misi", icon: Target },
        // Data tim tersimpan via /api/organization — mutasi super_admin-only
        // (ADMIN_ONLY_MUTATION_PREFIXES di src/proxy.ts + gate halaman).
        { label: "Pimpinan & Dewan Asatidz", href: "/admin/organization/tim", icon: UsersRound },
      ],
    },
    {
      label: "Pengaturan",
      roles: ["super_admin"],
      items: [
        { label: "Nama & Tagline", href: "/admin/settings/general", icon: Type },
        { label: "Kontak & Lokasi", href: "/admin/settings/contact", icon: MapPin },
        { label: "Media Sosial", href: "/admin/settings/social", icon: Share2 },
        { label: "SEO Global", href: "/admin/settings/seo", icon: Search },
      ],
    },
    {
      label: "Administrasi",
      roles: ["super_admin"],
      items: [
        { label: "Manajemen Pengguna", href: "/admin/users", icon: Users },
      ],
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
        "flex-1 py-3 overflow-y-auto overflow-x-hidden",
        collapsed ? "px-2" : "px-3"
      )}
    >
      {/* Item tunggal: Dashboard & Kotak Masuk */}
      <div className={cn("space-y-1", collapsed && "flex flex-col items-center")}>
        {primaryItems
          .filter((item) => isAllowed(item.roles))
          .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "relative flex items-center rounded-md text-sm font-medium transition-colors group",
                  collapsed
                    ? "justify-center h-11 w-11 mx-auto"
                    : "gap-3 px-3 py-2 w-full",
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
                {!collapsed && <span>{item.title}</span>}
                {item.badge && !collapsed && (
                  <Badge className="ml-auto h-5 min-w-5 rounded-full px-1.5 tabular-nums shrink-0">
                    {item.badge}
                  </Badge>
                )}
                {item.badge && collapsed && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground tabular-nums">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
      </div>

      {/* Seksi konten dengan label kategori — semua item langsung terlihat */}
      {navSections.map((section) => {
        if (!isAllowed(section.roles)) return null;
        const visibleItems = section.items.filter((item) => isAllowed(item.roles));
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.label} className="pt-4">
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground px-3 pb-1">
                {section.label}
              </p>
            )}
            <div className={cn("space-y-0.5", collapsed && "flex flex-col items-center")}>
              {visibleItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                if (collapsed) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      title={item.label}
                      aria-label={item.label}
                      className={cn(
                        "flex items-center justify-center h-11 w-11 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-card"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-card font-normal"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );

  // Logout hanya tersedia via menu akun di AdminTopbar agar tidak ada dua pintu keluar.
  const sidebarFooter = (collapsed: boolean) =>
    collapsed ? (
      <div className="border-t border-border shrink-0 p-2 flex flex-col items-center">
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
    ) : null;

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
