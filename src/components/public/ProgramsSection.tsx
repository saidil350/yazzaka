"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Program } from "@/lib/types";
import { ArrowRight, Sparkles, CheckCircle2, BookOpen, GraduationCap, Award, Globe, Heart, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function ProgramsSection() {
  const { programs } = useSchoolData();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const published = programs
    .filter((p) => p.status === "published")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  // Dynamic filter options generated from database
  const filterOptions = [
    { key: "all", label: `Semua Unit (${published.length})` },
    ...published.map((p) => ({
      key: p.slug,
      label: p.title,
    })),
  ];

  const filteredPrograms = published.filter((prog) => {
    if (selectedFilter === "all") return true;
    return prog.slug === selectedFilter;
  });

  const getUnitIcon = (iconName: string, slug: string) => {
    if (slug.includes("tpa")) return BookOpen;
    if (slug.includes("tkit")) return Sparkles;
    if (slug.includes("anak-shalih") || slug.includes("karakter")) return Heart;
    if (slug.includes("pkbm")) return GraduationCap;
    if (slug.includes("darul-quran") || slug.includes("tahfiz")) return Award;
    if (slug.includes("peradaban") || slug.includes("wakaf")) return Globe;
    return BookOpen;
  };

  const getUnitBadge = (prog: Program) => {
    const cat = (prog.category || "").toLowerCase();
    const slug = (prog.slug || "").toLowerCase();

    if (cat.includes("wakaf") || slug.includes("peradaban")) {
      return { tag: "Wakaf Pembangunan", target: "Program Strategis Umat", color: "bg-[#FA6400] text-white border-[#FA6400]" };
    }
    if (cat.includes("tahfiz") || slug.includes("darul-quran")) {
      return { tag: "Tahfiz 30 Juz Bersanad", target: "Santri Intensif", color: "bg-[#FEF9C3] text-[#A16207] border-[#FEF08A]" };
    }
    if (slug.includes("tpa")) {
      return { tag: "Pendidikan Al-Qur'an", target: "Usia 4–12 Thn", color: "bg-[#FFF0E5] text-[#FA6400] border-[#FED7AA]" };
    }
    if (slug.includes("tkit")) {
      return { tag: "TK Islam Terpadu", target: "Usia 4–6 Thn", color: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]" };
    }
    if (slug.includes("pkbm")) {
      return { tag: "Kesetaraan & Vokasi", target: "Paket A / B / C", color: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]" };
    }
    if (slug.includes("anak-shalih") || slug.includes("karakter")) {
      return { tag: "Pembinaan Karakter", target: "Santri Cilik", color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" };
    }
    return { tag: prog.category || "Program Unggulan", target: "Santri", color: "bg-stone-100 text-stone-700 border-stone-200" };
  };

  return (
    <section id="program" className="landing-section py-16 lg:py-20 bg-secondary/35 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] font-bold text-xs">
              <Sparkles className="h-3 w-3 text-[#0284C7]" />
              <span>Unit Pendidikan &amp; Program Strategis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Lembaga Pendidikan &amp; Pembinaan
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Menaungi pendidikan usia dini, tahfiz Al-Qur&apos;an, kesetaraan masyarakat, hingga perintisan Pesantren Peradaban 6.0.
            </p>
          </div>

          <Link href="/program">
            <Button
              variant="outline"
              size="default"
              className="font-bold text-xs h-9 px-4 shrink-0 shadow-xs"
            >
              <span>Lihat Detail Semua Unit</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Category Filter Pills */}
        {published.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E2D8]">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedFilter(opt.key)}
                className={[
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border",
                  selectedFilter === opt.key
                    ? "bg-[#1E2330] text-white border-[#1E2330] shadow-xs"
                    : "bg-white text-stone-600 border-[#E8E2D8] hover:bg-stone-50 hover:text-[#1E2330]",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* 6 Interactive Cards Grid or EmptyState */}
        {filteredPrograms.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Belum Ada Program Ditemukan"
            description="Saat ini belum ada unit atau program pendidikan yang aktif untuk kriteria yang dipilih."
            action={{
              label: "Reset Filter",
              onClick: () => setSelectedFilter("all"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog, idx) => {
              const badgeInfo = getUnitBadge(prog);
              const Icon = getUnitIcon(prog.iconName, prog.slug);
              const isSpecialWakaf = prog.category?.toLowerCase().includes("wakaf") || prog.slug.includes("peradaban");

              return (
                <div
                  key={prog.id}
                  className={[
                    "interactive-lift rounded-[1.25rem] border overflow-hidden flex flex-col justify-between group shadow-xs",
                    isSpecialWakaf
                      ? "bg-[#FFF9F2] border-[#FA6400] ring-2 ring-[#FA6400]/20"
                      : "bg-white border-[#E8E2D8] hover:border-[#FA6400]/50",
                  ].join(" ")}
                >
                  <div>
                    {/* Card Image Banner */}
                    <div className="h-48 relative overflow-hidden bg-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prog.imageUrl}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                      {/* Top Chips */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${badgeInfo.color}`}>
                          {badgeInfo.tag}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                          {badgeInfo.target}
                        </span>
                      </div>

                      {/* Bottom Title on Image for special feel */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-white/95 text-[#1E2330] flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className="h-4 w-4 text-[#FA6400]" />
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-xs">
                          Unit 0{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-base sm:text-lg font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                        {prog.shortDesc}
                      </p>

                      {/* Bullet Features */}
                      {prog.features && prog.features.length > 0 && (
                        <div className="pt-3 border-t border-stone-100 space-y-1.5">
                          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                            Fokus &amp; Capaian:
                          </span>
                          {prog.features.slice(0, 3).map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-2 text-xs text-stone-700 font-semibold"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <div className="p-5 pt-0">
                    <Link href={`/program/${prog.slug}`}>
                      <Button
                        variant={isSpecialWakaf ? "default" : "outline"}
                        className={[
                          "w-full justify-between font-bold text-xs h-10",
                          isSpecialWakaf ? "bg-[#FA6400] hover:bg-[#E05A00] text-white shadow-xs" : "",
                        ].join(" ")}
                      >
                        <span>{isSpecialWakaf ? "Pelajari Info Wakaf & Masterplan" : "Rincian & Pendaftaran Unit"}</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
