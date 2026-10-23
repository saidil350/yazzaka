"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_HERO } from "@/lib/data/initialData";
import { ArrowRight, BookOpen, CheckCircle2, Landmark } from "lucide-react";

export function HeroSection() {
  const { profile, admission } = useSchoolData();
  // hero di DB bersifat parsial (JSONB default '{}') — gabungkan dengan default
  // agar seksi tetap tampil utuh sebelum konten diisi dari CMS.
  const hero = { ...DEFAULT_HERO, ...profile.hero };

  return (
    <section
      id="beranda"
      aria-labelledby="hero-heading"
      className="landing-section relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20 border-b border-border scroll-mt-24"
    >
      {/* ── Headspace Subtle Playful Background Blobs ────────────── */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-yazzaka-teal-soft/80 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-8 -mb-16 w-72 h-72 rounded-full bg-yazzaka-teal-soft/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left: Friendly Headline & Mission (7 cols) ─────── */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">

            {/* Pill Eyebrow */}
            <Badge variant="secondary" className="gap-2">
              <Landmark className="h-3.5 w-3.5 text-yazzaka-teal-dark" strokeWidth={1.8} />
              <span>{hero.eyebrow}</span>
            </Badge>

            {/* Proportional Friendly Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-[#1E2330] tracking-tight leading-[1.2]"
            >
              {hero.headline}
            </h1>

            {/* Welcoming Body copy */}
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              {hero.body}
            </p>

            {/* Pill Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              {admission.showHeroCta && (
                <Link href="/pendaftaran">
                  <Button
                    size="default"
                    className="font-bold text-xs sm:text-sm h-11 px-6 w-full sm:w-auto shadow-sm"
                  >
                    <span>{admission.isOpen ? "Daftar Santri Baru" : "Informasi PPDB"}</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
              <Link href="/tentang-kami">
                <Button
                  variant="outline"
                  size="default"
                  className="font-bold text-xs sm:text-sm h-11 px-6 w-full sm:w-auto"
                >
                  <BookOpen className="h-4 w-4 text-yazzaka-teal-dark" />
                  <span>Jelajahi Profil</span>
                </Button>
              </Link>
            </div>

            {/* Quick Benefits in Pill Badges */}
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-wrap items-center gap-2 sm:gap-3">
              {hero.badges.map((badge) => (
                <Badge key={badge} variant="outline" className="gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-yazzaka-teal-dark shrink-0" />
                  <span>{badge}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* ── Right: Media Card (5 cols) ── */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">

            {/* Decorative colored backdrop card */}
            <div className="absolute inset-0 bg-yazzaka-teal rounded-3xl transform rotate-2 translate-y-2 translate-x-2" />

            {/* Main Rounded Card */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-white bg-white shadow-xl">
              <div className="aspect-[4/3] sm:aspect-[16/11] relative max-h-[340px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.imageUrl}
                  alt={`Aktivitas santri di ${profile.name}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                />

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
