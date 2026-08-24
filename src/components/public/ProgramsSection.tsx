"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProgramsSection() {
  const { programs } = useSchoolData();

  const published = programs
    .filter((p) => p.status === "published")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const featuredProgram = published[0];
  const sidePrograms = published.slice(1, 5);

  const categoryPalettes = [
    { bg: "bg-[#FFF0E5]", border: "border-[#FED7AA]", badge: "bg-[#FA6400] text-white", text: "text-[#C2410C]" },
    { bg: "bg-[#E0F2FE]", border: "border-[#BAE6FD]", badge: "bg-[#0284C7] text-white", text: "text-[#0369A1]" },
    { bg: "bg-[#EDE9FE]", border: "border-[#DDD6FE]", badge: "bg-[#7C3AED] text-white", text: "text-[#6D28D9]" },
    { bg: "bg-[#DCFCE7]", border: "border-[#BBF7D0]", badge: "bg-[#16A34A] text-white", text: "text-[#15803D]" },
  ];

  return (
    <section className="py-14 lg:py-16 bg-[#FAF6EE] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] font-bold text-xs">
              <Sparkles className="h-3 w-3 text-[#0284C7]" />
              <span>Kurikulum Unggulan &amp; Pembinaan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Program Belajar yang Menyenangkan &amp; Bermakna
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Kurikulum nasional, pengayaan sains modern, tahfiz 30 juz, serta penanaman adab dan bahasa internasional aktif yang aplikatif.
            </p>
          </div>

          <Link href="/program">
            <Button
              variant="outline"
              size="default"
              className="font-bold text-xs h-9 px-4 shrink-0"
            >
              <span>Lihat Semua Program</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Headspace Program Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Main Featured Program (6 cols) */}
          {featuredProgram && (
            <div className="lg:col-span-6 bg-white border-2 border-[#E8E2D8] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all duration-200">
              <div className="space-y-4">
                <div className="h-52 relative overflow-hidden rounded-2xl bg-stone-200 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredProgram.imageUrl}
                    alt={featuredProgram.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FA6400] text-white text-[11px] font-bold shadow-xs">
                      {featuredProgram.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E2330] leading-snug">
                    {featuredProgram.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {featuredProgram.fullDesc || featuredProgram.shortDesc}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#E8E2D8]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Target Utama Santri:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {featuredProgram.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-stone-700 font-semibold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E8E2D8]">
                <Link href={`/program/${featuredProgram.slug}`}>
                  <Button className="w-full justify-between font-bold h-10 text-xs">
                    <span>Pelajari Rincian Kurikulum</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Side Programs Cards (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-3">
            {sidePrograms.map((prog, idx) => {
              const palette = categoryPalettes[(idx + 1) % categoryPalettes.length];
              return (
                <Link
                  key={prog.id}
                  href={`/program/${prog.slug}`}
                  className="block group"
                >
                  <div className={`${palette.bg} ${palette.border} border-2 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full ${palette.badge} text-[10px] font-bold`}>
                          0{idx + 2} • {prog.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug">
                        {prog.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">
                        {prog.shortDesc}
                      </p>
                    </div>

                    <div className="h-8 w-8 rounded-full bg-white text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-[#FA6400] group-hover:text-white transition-all shadow-xs">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
