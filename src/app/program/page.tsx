"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Program } from "@/lib/types";
import { ArrowRight, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProgramsDirectoryPage() {
  const { programs, profile } = useSchoolData();
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

  const getUnitBadge = (prog: Program) => {
    const cat = (prog.category || "").toLowerCase();
    const slug = (prog.slug || "").toLowerCase();

    if (cat.includes("wakaf") || slug.includes("peradaban")) {
      return { tag: "Wakaf Pembangunan", target: "Program Strategis Umat", color: "bg-[#FA6400] text-white border-[#FA6400]" };
    }
    if (cat.includes("tahfiz") || slug.includes("darul-quran")) {
      return { tag: "Tahfiz 30 Juz Bersanad", target: "Santri & Pelajar Formal", color: "bg-[#FEF9C3] text-[#A16207] border-[#FEF08A]" };
    }
    if (slug.includes("tpa")) {
      return { tag: "Pendidikan Al-Qur'an", target: "Usia 4–12 Tahun", color: "bg-[#FFF0E5] text-[#FA6400] border-[#FED7AA]" };
    }
    if (slug.includes("tkit")) {
      return { tag: "TK Islam Terpadu", target: "Usia 4–6 Tahun", color: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]" };
    }
    if (slug.includes("pkbm")) {
      return { tag: "Kesetaraan & Vokasi", target: "Paket A / B / C Resmi", color: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]" };
    }
    if (slug.includes("anak-shalih") || slug.includes("karakter")) {
      return { tag: "Pembinaan Karakter", target: "Santri Cilik & Remaja", color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]" };
    }
    return { tag: prog.category || "Program Unggulan", target: "Pendidikan Terpadu", color: "bg-[#FFF0E5] text-[#FA6400] border-[#FED7AA]" };
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] font-bold text-xs mb-3 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>Unit Pendidikan &amp; Program Strategis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Struktur Pendidikan {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Menaungi {published.length} unit pendidikan formal, non-formal, tahfiz intensif Al-Qur&apos;an, serta program strategis di {profile.city}, {profile.province}.
            </p>
          </div>
        </section>

        {/* ── Directory Grid with Filter ──────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Filter Pills */}
            {published.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedFilter(opt.key)}
                    className={[
                      "px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border",
                      selectedFilter === opt.key
                        ? "bg-[#1E2330] text-white border-[#1E2330] shadow-xs"
                        : "bg-[#FAF6EE] text-stone-600 border-[#E8E2D8] hover:bg-stone-100 hover:text-[#1E2330]",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Programs Cards Grid or EmptyState */}
            {filteredPrograms.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="Tidak Ada Program Ditemukan"
                description={
                  selectedFilter !== "all"
                    ? "Unit pendidikan yang dipilih saat ini belum aktif atau dalam penyusunan kurikulum."
                    : "Belum ada program pendidikan yang dipublikasikan."
                }
                action={
                  selectedFilter !== "all"
                    ? {
                        label: "Tampilkan Semua Unit",
                        onClick: () => setSelectedFilter("all"),
                      }
                    : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((prog, idx) => {
                  const badgeInfo = getUnitBadge(prog);
                  const isSpecialWakaf = prog.category?.toLowerCase().includes("wakaf") || prog.slug.includes("peradaban");

                  return (
                    <div
                      key={prog.id}
                      className={[
                        "border-2 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200 group shadow-xs",
                        isSpecialWakaf
                          ? "bg-[#FFF9F2] border-[#FA6400] ring-2 ring-[#FA6400]/20"
                          : "bg-white border-[#E8E2D8] hover:border-[#FA6400]/50",
                      ].join(" ")}
                    >
                      <div>
                        {/* Banner Image */}
                        <div className="h-52 relative overflow-hidden bg-stone-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prog.imageUrl}
                            alt={prog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                          {/* Badges on Image */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${badgeInfo.color}`}>
                              {badgeInfo.tag}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                              {badgeInfo.target}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 text-white text-xs font-bold drop-shadow-xs">
                            Unit 0{idx + 1} • {profile.name}
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-5 space-y-3">
                          <h2 className="text-base sm:text-lg font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug">
                            {prog.title}
                          </h2>
                          <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                            {prog.shortDesc}
                          </p>

                          {/* Features & Targets */}
                          {prog.features && prog.features.length > 0 && (
                            <div className="pt-3 border-t border-stone-100 space-y-2">
                              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                                Fokus Kurikulum &amp; Output:
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

                      {/* Action Button */}
                      <div className="p-5 pt-0">
                        <Link href={`/program/${prog.slug}`}>
                          <Button
                            variant={isSpecialWakaf ? "default" : "outline"}
                            className={[
                              "w-full justify-between font-bold text-xs h-10",
                              isSpecialWakaf ? "bg-[#FA6400] hover:bg-[#E05A00] text-white shadow-xs" : "",
                            ].join(" ")}
                          >
                            <span>{isSpecialWakaf ? "Detail Wakaf & Masterplan" : "Rincian Kurikulum & Pendaftaran"}</span>
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

      </main>
      <Footer />
    </div>
  );
}
