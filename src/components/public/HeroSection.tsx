"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, CheckCircle2, Heart, Award, Globe } from "lucide-react";

export function HeroSection() {
  const { profile, admission } = useSchoolData();

  return (
    <section
      id="beranda"
      aria-labelledby="hero-heading"
      className="landing-section relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20 border-b border-border scroll-mt-24"
    >
      {/* ── Headspace Subtle Playful Background Blobs ────────────── */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FFEBD4]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-8 -mb-16 w-72 h-72 rounded-full bg-[#EAF9F9]/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left: Friendly Headline & Mission (7 cols) ─────── */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">

            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#C2410C] font-bold text-xs shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#EE6D2B]" />
              <span>Pendidikan Islam Holistik &amp; Berwawasan Global</span>
            </div>

            {/* Proportional Friendly Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#1E2330] tracking-tight leading-[1.2]"
            >
              Belajar Lebih Tenang, <br className="hidden sm:inline" />
              Tumbuh Berkarakter <span className="text-[#EE6D2B] underline decoration-[#EE6D2B]/30 decoration-wavy underline-offset-4">Qur&apos;ani</span>.
            </h1>

            {/* Welcoming Body copy */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              {profile.tagline} Di <strong className="font-bold text-[#1E2330]">{profile.name}</strong>, proses pendidikan memadukan kedalaman tradisi keilmuan Islam, tahfiz Al-Qur&apos;an 30 juz bersanad, penguasaan bahasa Arab &amp; Inggris aktif, serta kurikulum sains modern berbasis riset.
            </p>

            {/* Pill Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link href="/pendaftaran">
                <Button
                  size="default"
                  className="font-bold text-xs sm:text-sm h-11 px-6 w-full sm:w-auto shadow-sm"
                >
                  <span>{admission.isOpen ? "Daftar Santri Baru" : "Informasi PPDB"}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/tentang-kami">
                <Button
                  variant="outline"
                  size="default"
                  className="font-bold text-xs sm:text-sm h-11 px-6 w-full sm:w-auto"
                >
                  <BookOpen className="h-4 w-4 text-[#EE6D2B]" />
                  <span>Jelajahi Profil</span>
                </Button>
              </Link>
            </div>

            {/* Quick Benefits in Pill Badges */}
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[11px] font-bold text-stone-700 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Akreditasi A Unggul</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[11px] font-bold text-stone-700 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Tahfiz 30 Juz Bersanad</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D8] text-[11px] font-bold text-stone-700 shadow-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Bahasa Arab &amp; Inggris 24 Jam</span>
              </div>
            </div>
          </div>

          {/* ── Right: Playful Media Card with Floating Chips (5 cols) ── */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">

            {/* Decorative colored backdrop card */}
            <div className="absolute inset-0 bg-[#FFD8BA] rounded-3xl transform rotate-2 translate-y-2 translate-x-2" />

            {/* Main Rounded Card */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-white bg-white shadow-xl">
              <div className="aspect-[4/3] sm:aspect-[16/11] relative max-h-[340px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                  alt="Aktivitas santri ceria di Pesantren Yazzaka"
                  className="w-full h-full object-cover"
                  loading="eager"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2330]/80 via-transparent to-black/10" />

                {/* Floating Pill Badge 1 — Top Right (Lilac) */}
                <div className="absolute top-3 right-3 animate-float">
                  <div className="px-3 py-1 rounded-xl bg-[#EAF9F9]/95 backdrop-blur-xs border border-[#DDD6FE] text-[#008080] font-bold text-[11px] shadow-md flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 fill-violet-500 text-violet-500" />
                    <span>Lingkungan Nyaman</span>
                  </div>
                </div>

                {/* Floating Pill Badge 2 — Middle Left (Mint) */}
                <div className="absolute top-1/3 -left-2 animate-float-delayed">
                  <div className="px-3 py-1 rounded-xl bg-[#DCFCE7]/95 backdrop-blur-xs border border-[#BBF7D0] text-[#15803D] font-bold text-[11px] shadow-md flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Karakter &amp; Adab</span>
                  </div>
                </div>

                {/* Floating Pill Badge 3 — Bottom Content Bar */}
                <div className="absolute inset-x-3 bottom-3 p-3 rounded-2xl bg-white/95 backdrop-blur-xs border border-white shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#FFF0E5] text-[#EE6D2B] text-[9px] font-extrabold uppercase tracking-wide">
                        Sekolah Terpadu
                      </span>
                      <h4 className="text-xs font-bold text-[#1E2330] mt-0.5">
                        Sekolah Formal &amp; Pesantren Yazzakka
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        Mendidik generasi Qur&apos;ani berkarakter mulia
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-[#EE6D2B] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      <Globe className="h-4 w-4" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
