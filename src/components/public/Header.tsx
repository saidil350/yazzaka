"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import {
  Menu,
  X,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  MapPin,
  BookOpen,
  GraduationCap,
  Heart,
  Award,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavLinkItem {
  label: string;
  href: string;
  sectionId?: string;
}

const primaryNavLinks: NavLinkItem[] = [
  { label: "Beranda", href: "/", sectionId: "beranda" },
  { label: "Tentang", href: "/tentang-kami", sectionId: "tentang" },
  { label: "Program", href: "/program", sectionId: "program" },
  { label: "Fasilitas", href: "/fasilitas", sectionId: "fasilitas" },
  { label: "Kontak", href: "/kontak" },
];

const secondaryNavLinks = [
  {
    label: "Warta & Berita",
    href: "/berita",
    desc: "Kabar kegiatan, opini & artikel",
    icon: Newspaper,
    badge: "Terbaru",
  },
  {
    label: "Agenda Sekolah",
    href: "/agenda",
    desc: "Kalender event & jadwal PPDB",
    icon: Calendar,
  },
  {
    label: "Galeri Foto & Video",
    href: "/galeri",
    desc: "Dokumentasi kehidupan santri",
    icon: ImageIcon,
  },
  {
    label: "Kontak & Sekretariat",
    href: "/kontak",
    desc: "Lokasi sekolah & nomor layanan",
    icon: MapPin,
  },
];

const quickUnits = [
  { label: "TPA Yazzakka", href: "/program/tpa-yazzakka", icon: BookOpen },
  { label: "TKIT Yazzakka", href: "/program/tkit-yazzakka", icon: Sparkles },
  { label: "Sekolah Anak Shalih", href: "/program/sekolah-anak-shalih", icon: Heart },
  { label: "PKBM Yazzakka", href: "/program/pkbm-yazzakka", icon: GraduationCap },
  { label: "Darul Quran (Tahfiz)", href: "/program/darul-quran-yazzakka", icon: Award },
  { label: "Wakaf Pesantren 6.0", href: "/program/pesantren-peradaban-60", icon: Globe },
];

export function Header() {
  const { profile, admission } = useSchoolData();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Tutup mobile drawer otomatis saat rute berubah (pola state render React)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Hook Scrollspy untuk deteksi seksi aktif saat di halaman beranda
  const sectionIds = ["beranda", "statistik", "tentang", "program", "keunggulan", "fasilitas", "prestasi", "testimoni"];
  const { activeSection, scrollToSection } = useActiveSection(sectionIds, 90);

  // Deteksi scroll untuk elevation shadow & scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 16);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kunci scroll saat drawer mobile terbuka
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Tutup dropdown dan mobile drawer saat Escape ditekan atau klik di luar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Penentu apakah suatu link primer sedang aktif (baik secara rute maupun scrollspy di beranda)
  const isLinkActive = (link: NavLinkItem) => {
    if (pathname === "/") {
      if (link.sectionId === "beranda") {
        return activeSection === "beranda" || activeSection === "statistik";
      }
      if (link.sectionId === "tentang") {
        return activeSection === "tentang";
      }
      if (link.sectionId === "program") {
        return activeSection === "program" || activeSection === "keunggulan";
      }
      if (link.sectionId === "fasilitas") {
        return activeSection === "fasilitas";
      }
      if (link.sectionId === "prestasi") {
        return activeSection === "prestasi" || activeSection === "testimoni";
      }
      return false;
    }

    // Untuk subhalaman (contoh: /program/tpa-yazzakka aktifkan /program)
    if (link.href === "/") {
      return pathname === "/";
    }
    return pathname === link.href || pathname.startsWith(link.href + "/");
  };

  // Cek apakah ada menu sekunder yang sedang aktif
  const isSecondaryActive = secondaryNavLinks.some(
    (sec) => pathname === sec.href || pathname.startsWith(sec.href + "/")
  );

  // Handler navigasi dual-mode: in-page anchor saat di beranda vs page router saat di subpage
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: NavLinkItem
  ) => {
    if (pathname === "/" && link.sectionId) {
      e.preventDefault();
      scrollToSection(link.sectionId);
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", link.sectionId === "beranda" ? "/" : `#${link.sectionId}`);
      }
    }
  };

  return (
    <>
      {/* ── Top Announcement Sub-Bar ───────────── */}
      <div
        className="bg-[#262B35] text-[#FAF6EE] border-b border-white/10 relative z-50"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            {admission.isOpen ? (
              <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FA6400]/25 border-transparent text-[#FFB07A] font-bold text-[11px]">
                <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: "6s" }} />
                PPDB {admission.academicYear || "2026/2027"} Dibuka
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-700/80 border-transparent text-stone-300 font-bold text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                PPDB {admission.academicYear || "2026/2027"} Ditutup
              </Badge>
            )}
            <span className="hidden md:inline text-white/30">·</span>
            <span className="hidden md:inline text-stone-300 font-medium text-[11px]">
              {admission.isOpen ? "Informasi & Pendaftaran Santri / Siswa Baru" : "Informasi Jadwal & Persyaratan PPDB"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-stone-300">
            <span className="hidden lg:inline-flex items-center gap-1.5 font-medium text-[11px]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Akreditasi {profile.accreditation} (NPSN {profile.npsn})
            </span>
            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] transition-all"
            >
              <Phone className="h-2.5 w-2.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>WhatsApp CS</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Sticky Header ──────── */}
      <header
        className={[
          "sticky top-0 z-40 backdrop-blur-md transition-all duration-200",
          isScrolled
            ? "bg-[#FCF8F1]/95 shadow-[0_4px_20px_rgba(30,35,48,0.06)] border-b border-[#E8E2D8]"
            : "bg-[#FCF8F1]/90 border-b border-[#E8E2D8]/80",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">

          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group py-1">
            <div className="relative h-10 w-auto flex items-center group-hover:opacity-95 transition-opacity">
              <Image
                src={
                  profile.branding?.logoUrl && profile.branding.logoUrl !== "/logo-yazzaka.svg"
                    ? profile.branding.logoUrl
                    : "/yazzakka.png"
                }
                alt={profile.name}
                width={160}
                height={40}
                className="h-10 w-[160px] object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Structured Navigation (Clean & Ergonomic) */}
          <nav aria-label="Navigasi utama" className="hidden lg:flex items-center gap-1 bg-[#F3EFE6]/90 p-1 rounded-full border border-[#E8E2D8]">
            {primaryNavLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap",
                    active
                      ? "bg-white text-[#FA6400] shadow-xs"
                      : "text-stone-600 hover:text-[#1E2330] hover:bg-white/60",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Informasi & Warta Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={[
                  "px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap flex items-center gap-1 cursor-pointer",
                  isSecondaryActive || dropdownOpen
                    ? "bg-white text-[#FA6400] shadow-xs"
                    : "text-stone-600 hover:text-[#1E2330] hover:bg-white/60",
                ].join(" ")}
              >
                <span>Informasi</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180 text-[#FA6400]" : "text-stone-400"
                  }`}
                />
              </button>

              {/* Popover Dropdown Card */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white p-2 border-2 border-[#E8E2D8] shadow-xl z-50 animate-fade-in">
                  <div className="space-y-0.5">
                    {secondaryNavLinks.map((item) => {
                      const Icon = item.icon;
                      const isCurrent = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className={[
                            "flex items-start gap-2.5 p-2.5 rounded-xl transition-all",
                            isCurrent
                              ? "bg-[#FFF0E5] text-[#FA6400]"
                              : "text-[#1E2330] hover:bg-[#FAF6EE]",
                          ].join(" ")}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                              isCurrent ? "bg-[#FA6400] text-white" : "bg-[#FAF6EE] text-[#FA6400]"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold truncate">{item.label}</span>
                              {item.badge && (
                                <Badge variant="default" className="text-[9px] font-extrabold uppercase px-1.5 py-0 rounded-full bg-[#FA6400] hover:bg-[#FA6400] text-white border-transparent shadow-none">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-medium">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            {pathname !== "/pendaftaran" && (
              <Link href="/pendaftaran" className="hidden sm:inline-flex">
                <Button
                  variant={admission.isOpen ? "default" : "outline"}
                  size="default"
                  className="px-4 py-2 text-xs font-bold h-9"
                >
                  <span>{admission.isOpen ? "Daftar Sekarang" : "Info PPDB"}</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full bg-[#F3EFE6] text-[#1E2330] border border-[#E8E2D8] hover:bg-white transition-all active:scale-95 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Scroll Progress Bar directly under header ──── */}
        <div className="w-full h-[2.5px] bg-transparent overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FA6400] via-[#FF7A1A] to-[#FA6400] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progres gulir halaman"
          />
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ─────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          aria-label="Menu navigasi mobile"
        >
          {/* Backdrop with Fade Animation */}
          <div
            className="absolute inset-0 bg-[#1E2330]/50 backdrop-blur-xs animate-fade-backdrop"
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel with Slide-in Animation */}
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="absolute inset-y-0 right-0 w-[min(320px,86vw)] bg-[#FCF8F1] flex flex-col overflow-y-auto border-l border-[#E8E2D8] shadow-2xl p-5 animate-slide-in-right"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2D8] shrink-0">
              <div className="flex items-center gap-2">
                <Image
                  src={
                    profile.branding?.logoUrl && profile.branding.logoUrl !== "/logo-yazzaka.svg"
                      ? profile.branding.logoUrl
                      : "/yazzakka.png"
                  }
                  alt={profile.name}
                  width={140}
                  height={35}
                  className="h-8 w-[140px] object-contain object-left"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F3EFE6] text-stone-600 hover:text-black transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav Links in Pill List */}
            <nav className="flex-1 py-3 space-y-3">
              {/* Primary Section */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 px-3 block">
                  Menu Utama
                </span>
                {primaryNavLinks.map((link) => {
                  const active = isLinkActive(link);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(e, link);
                        setMobileMenuOpen(false);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all",
                        active
                          ? "bg-[#FA6400] text-white shadow-xs"
                          : "text-stone-700 hover:bg-[#F3EFE6]",
                      ].join(" ")}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Informational Sub-Links */}
              <div className="pt-2 border-t border-[#E8E2D8] space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 px-3 block">
                  Warta &amp; Layanan
                </span>
                {secondaryNavLinks.map((item) => {
                  const isCurrent = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={[
                        "flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all",
                        isCurrent
                          ? "bg-[#FFF0E5] text-[#FA6400]"
                          : "text-stone-700 hover:bg-[#F3EFE6]",
                      ].join(" ")}
                    >
                      <Icon className="h-3.5 w-3.5 text-[#FA6400] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Quick Units Pills */}
              <div className="pt-2 border-t border-[#E8E2D8] space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 px-3 block">
                  6 Unit Pendidikan
                </span>
                <div className="grid grid-cols-1 gap-1 px-1">
                  {quickUnits.map((u) => {
                    const Icon = u.icon;
                    return (
                      <Link
                        key={u.href}
                        href={u.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-stone-600 hover:text-[#FA6400] hover:bg-white transition-colors"
                      >
                        <Icon className="h-3 w-3 text-stone-400" />
                        <span className="truncate">{u.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Drawer Footer Actions */}
            <div className="pt-3.5 border-t border-[#E8E2D8] space-y-2 shrink-0">
              <Link href="/pendaftaran" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full justify-center font-bold h-10 text-xs">
                  {admission.isOpen ? "Daftar Santri Baru (PPDB)" : "Informasi PPDB (Ditutup)"}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
              <a
                href={`https://wa.me/${profile.whatsapp}?text=Assalamu'alaikum%20Admin%20Yazzakka`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-600" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
