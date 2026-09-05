"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Quote, Sparkles, Compass } from "lucide-react";

export function EditorialAbout() {
  const { profile } = useSchoolData();

  return (
    <section id="tentang" className="py-14 lg:py-16 bg-[#FFFDF9] border-b border-[#E8E2D8] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Title Header */}
        <div className="max-w-3xl space-y-2">
          <Badge variant="outline" className="gap-2 px-3 py-1 rounded-full bg-stone-100/90 border-stone-200 text-stone-700 font-semibold text-xs shadow-2xs">
            <Sparkles className="h-3 w-3 text-[#FA6400]" />
            <span>Sambutan Pimpinan &amp; Filosofi</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
            Membentuk Karakter Melalui Keteladanan, Adab, &amp; Kedalaman Ilmu
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Pendidikan bukan sekadar transfer wawasan, melainkan proses menumbuhkan fitrah, mengasah kecerdasan, dan meneguhkan integritas moral.
          </p>
        </div>

        {/* Headspace Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Principal Card with Speech Bubble */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#FAF6EE] border-2 border-[#E8E2D8] rounded-3xl p-5 shadow-xs">
              <div className="aspect-[16/10] relative overflow-hidden rounded-2xl border border-white shadow-sm bg-stone-200 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.principal.photoUrl}
                  alt={profile.principal.name}
                  className="w-full h-full object-cover"
                />
                <Badge variant="outline" className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border-stone-200 text-xs font-bold text-[#1E2330] shadow-xs">
                  {profile.principal.name}
                </Badge>
              </div>

              {/* Message Quote */}
              <div className="relative bg-white rounded-xl p-4 border border-[#E8E2D8] shadow-xs">
                <Quote className="h-5 w-5 text-[#FA6400]/40 mb-1.5" />
                <p className="text-stone-700 text-xs sm:text-sm italic leading-relaxed whitespace-pre-line font-medium">
                  &ldquo;{profile.principal.welcomeMessage}&rdquo;
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-500">{profile.principal.title}</span>
                  <Badge variant="outline" className="text-[10px] font-bold text-stone-700 bg-stone-100 border-stone-200 px-2 py-0.5 rounded-full">
                    Pimpinan Pesantren
                  </Badge>
                </div>
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

            {/* Vision Card — Neutral Stone Elegant */}
            <div className="bg-[#FAF6EE] border-2 border-[#E8E2D8] rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-[#1E2330] text-white flex items-center justify-center">
                  <Compass className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Visi Utama Lembaga
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-[#1E2330] leading-snug">
                &ldquo;{profile.vision}&rdquo;
              </p>
            </div>

            {/* Strategic Mission */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Misi Strategis Pendidikan
              </span>
              <div className="grid grid-cols-1 gap-2">
                {profile.mission.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E8E2D8] flex items-start gap-3 transition-all hover:bg-white hover:border-[#FA6400]/40"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      0{idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values (Panca Jiwa) */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                Pilar Karakter Santri
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {profile.values.slice(0, 3).map((val, idx) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-[#E8E2D8] rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-[#FA6400]/40 hover:shadow-xs"
                  >
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FA6400] block mb-1">
                      Pilar 0{idx + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-[#1E2330] mb-1">
                      {val.title}
                    </h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
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
