"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Quote, Image as ImageIcon } from "lucide-react";

export function EditorialAbout() {
  const { profile } = useSchoolData();

  return (
    <section id="tentang" className="py-14 lg:py-16 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Title Header */}
        <div className="max-w-3xl space-y-2">
          <Badge variant="secondary">Sambutan Pimpinan &amp; Filosofi</Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
            Membentuk Karakter Melalui Keteladanan, Adab, &amp; Kedalaman Ilmu
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Pendidikan bukan sekadar transfer wawasan, melainkan proses menumbuhkan fitrah, mengasah kecerdasan, dan meneguhkan integritas moral.
          </p>
        </div>

        {/* Headspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Principal Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="aspect-[16/10] relative overflow-hidden rounded-md bg-muted mb-4">
                {profile.principal.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.principal.photoUrl}
                    alt={profile.principal.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Message Quote */}
              <Quote className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-xs sm:text-sm italic leading-relaxed whitespace-pre-line">
                &ldquo;{profile.principal.welcomeMessage}&rdquo;
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-foreground">{profile.principal.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{profile.principal.title}</p>
              </div>
            </div>

            <Link href="/tentang-kami" className="inline-block">
              <Button
                variant="outline"
                size="default"
                className="font-bold text-xs h-9 px-4"
              >
                <span>Baca Profil Lengkap Lembaga</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Right Column: Vision, Mission & Values */}
          <div className="lg:col-span-7 space-y-6">

            {/* Vision */}
            <div className="bg-card border border-border rounded-lg p-5 sm:p-6">
              <span className="text-xs font-semibold text-muted-foreground block mb-2">
                Visi Utama Lembaga
              </span>
              <p className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                &ldquo;{profile.vision}&rdquo;
              </p>
            </div>

            {/* Strategic Mission */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-muted-foreground block">
                Misi Strategis Pendidikan
              </span>
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                {profile.mission.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 px-4 py-3">
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums pt-0.5 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values (Panca Jiwa) */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-muted-foreground block">
                Pilar Karakter Santri
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {profile.values.slice(0, 3).map((val, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <span className="text-xs text-muted-foreground block mb-1.5">
                      Pilar {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      {val.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
