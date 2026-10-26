"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_HERO } from "@/lib/data/initialData";
import { BookOpen, Landmark, Image as ImageIcon } from "lucide-react";

/**
 * Satu kolom marquee vertikal untuk kolase galeri hero.
 * Daftar digandakan di dalam track — translate -50% menggeser tepat
 * satu panjang daftar sehingga animasi loop tanpa sambungan terlihat.
 */
function CollageColumn({
  items,
  altBase,
  reverse = false,
  duration,
}: {
  items: string[];
  altBase: string;
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div className="h-full overflow-hidden rounded-lg">
      <div
        className={`hero-collage-track flex flex-col ${
          reverse ? "hero-collage-track--reverse" : ""
        }`}
        style={{ "--collage-duration": duration } as React.CSSProperties}
      >
        {[items, items].map((list, half) => (
          <div key={half} className="shrink-0" aria-hidden={half === 1 ? true : undefined}>
            {list.map((url, i) => (
              <div key={`${half}-${i}`} className="pb-3 sm:pb-4">
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${altBase} (${i + 1})`}
                    className="w-full aspect-[4/3] object-cover bg-muted"
                    // Dua gambar teratas tiap kolase ada di viewport awal —
                    // muat eager berprioritas tinggi; sisanya (termasuk salinan
                    // marquee) tetap lazy.
                    loading={half === 0 && i < 2 ? "eager" : "lazy"}
                    fetchPriority={half === 0 && i < 2 ? "high" : "auto"}
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  const { profile } = useSchoolData();
  // hero di DB bersifat parsial (JSONB default '{}') — gabungkan dengan default
  // agar seksi tetap tampil utuh sebelum konten diisi dari CMS.
  const hero = { ...DEFAULT_HERO, ...profile.hero };
  // Item kosong (ditambahkan admin tapi belum diisi) dilewati agar tidak
  // merusak loop marquee maupun syarat minimal 2 gambar.
  const heroGallery = (hero.gallery ?? []).filter((url) => url.trim() !== "");

  return (
    <section
      id="beranda"
      aria-labelledby="hero-heading"
      className="landing-section relative overflow-hidden bg-background py-12 sm:py-16 lg:py-20 border-b border-border scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left: Friendly Headline & Mission (7 cols) ───────
              hero-stagger: anak-anak kolom ini muncul berurutan
              (editorial stagger) saat halaman dimuat. */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 hero-stagger">

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
          </div>

          {/* ── Right: Gallery Collage Blocks (5 cols) ── */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            {heroGallery.length >= 2 ? (
              /* Kolase galeri dua kolom beranimasi slide (dikelola via CMS).
                 Hover/fokus menjeda animasi; prefers-reduced-motion
                 mendapatkan kolase statis lewat aturan global. */
              <div
                className="hero-collage grid grid-cols-2 gap-3 sm:gap-4 h-[300px] sm:h-[360px] lg:h-[380px]"
                aria-label="Kolase galeri aktivitas santri"
              >
                <CollageColumn
                  items={heroGallery.filter((_, i) => i % 2 === 0)}
                  altBase={`Aktivitas santri di ${profile.name}`}
                  duration="36s"
                />
                <CollageColumn
                  items={heroGallery.filter((_, i) => i % 2 === 1)}
                  altBase={`Aktivitas santri di ${profile.name}`}
                  reverse
                  duration="46s"
                />
              </div>
            ) : (
              /* Fallback: kartu gambar tunggal (hero.imageUrl) saat kolase
                 belum diisi dari CMS. */
              <div className="relative rounded-lg overflow-hidden border border-border bg-card shadow-sm">
                <div className="aspect-[4/3] sm:aspect-[16/11] relative">
                  {hero.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={hero.imageUrl}
                      alt={`Aktivitas santri di ${profile.name}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs font-medium">Foto hero diunggah via CMS</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
