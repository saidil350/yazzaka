"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSchoolData } from "@/context/SchoolDataContext";
import {
  Menu,
  X,
  Phone,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang-kami" },
  { label: "Program", href: "/program" },
  { label: "Fasilitas", href: "/fasilitas" },
  { label: "Prestasi", href: "/prestasi" },
  { label: "Berita", href: "/berita" },
  { label: "Agenda", href: "/agenda" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

export function Header() {
  const { profile } = useSchoolData();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection — slight shadow and blur increase
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── Top Cheerful Announcement Sub-Bar ───────────── */}
      <div
        className="bg-[#262B35] text-[#FAF6EE] border-b border-white/10"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FA6400]/25 text-[#FFB07A] font-bold text-[11px]">
              <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: "6s" }} />
              PPDB 2026/2027 Dibuka
            </span>
            <span className="hidden md:inline text-white/30">·</span>
            <span className="hidden md:inline text-stone-300 font-medium text-[11px]">
              Jalur Prestasi Tahfiz &amp; Beasiswa Sains Tersedia
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
            <Link
              href="/admin"
              className="hidden lg:inline font-semibold text-stone-400 hover:text-amber-300 transition-colors border-l border-white/15 pl-3 text-[11px]"
            >
              CMS Admin
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Sticky Header (Compact & Responsive Headspace Bar) ──────── */}
      <header
        className={[
          "sticky top-0 z-40 backdrop-blur-md transition-all duration-200",
          isScrolled
            ? "bg-[#FCF8F1]/95 shadow-[0_2px_15px_rgba(0,0,0,0.06)] border-b border-[#E8E2D8]"
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
                style={{ width: "auto", height: "auto" }}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Pill Navigation (Clean & Compact) */}
          <nav aria-label="Navigasi utama" className="hidden xl:flex items-center gap-0.5 bg-[#F3EFE6]/90 p-1 rounded-full border border-[#E8E2D8]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap",
                    isActive
                      ? "bg-white text-[#FA6400] shadow-xs"
                      : "text-stone-600 hover:text-[#1E2330] hover:bg-white/60",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/pendaftaran" className="hidden sm:inline-flex">
              <Button
                variant="default"
                size="default"
                className="px-4 py-2 text-xs font-bold h-9"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
              className="xl:hidden h-9 w-9 flex items-center justify-center rounded-full bg-[#F3EFE6] text-[#1E2330] border border-[#E8E2D8] hover:bg-white transition-all active:scale-95"
            >
              {mobileMenuOpen
                ? <X className="h-4 w-4" />
                : <Menu className="h-4 w-4" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ─────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          aria-label="Menu navigasi mobile"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1E2330]/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            className="absolute inset-y-0 right-0 w-[min(320px,85vw)] bg-[#FCF8F1] flex flex-col overflow-y-auto border-l border-[#E8E2D8] shadow-2xl p-5"
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
                  style={{ width: "auto", height: "auto" }}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F3EFE6] text-stone-600 hover:text-black transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav Links in Pill List */}
            <nav className="flex-1 py-3 space-y-1">
              {[...navLinks, { label: "Pendaftaran PPDB", href: "/pendaftaran" }].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#FA6400] text-white shadow-xs"
                        : "text-stone-700 hover:bg-[#F3EFE6]",
                    ].join(" ")}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer Actions */}
            <div className="pt-3.5 border-t border-[#E8E2D8] space-y-2">
              <Link href="/pendaftaran" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full justify-center font-bold h-10 text-xs">
                  Daftar Santri Baru
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="outline" className="w-full justify-center text-xs h-9">
                  Portal Admin CMS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
