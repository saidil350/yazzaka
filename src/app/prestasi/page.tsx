"use client";

import React, { useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Trophy, Award } from "lucide-react";

export default function AchievementsPage() {
  const { achievements } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = [
    "Semua",
    "Akademik & Sains",
    "Tahfiz & Keagamaan",
    "Robotika & Riset",
    "Bahasa & Seni",
  ];

  const filtered =
    selectedCategory === "Semua"
      ? achievements
      : achievements.filter((a) => a.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9C3] border border-[#FEF08A] text-[#A16207] font-bold text-xs mb-3 shadow-xs">
              <Trophy className="h-3.5 w-3.5 text-[#CA8A04]" />
              <span>Rekam Jejak Keberhasilan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Prestasi &amp; Penghargaan Santri
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Apresiasi capaian santri Yazzakka di ajang olimpiade sains nasional, kejuaraan robotik internasional, dan musabaqah tahfiz.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Headspace Pill Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#FAF6EE] border border-[#E8E2D8] w-fit">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={[
                      "px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer",
                      isActive
                        ? "bg-[#FA6400] text-white shadow-xs"
                        : "text-stone-600 hover:text-[#1E2330] hover:bg-white",
                    ].join(" ")}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white border-2 border-[#E8E2D8] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FA6400]/40 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="h-44 relative overflow-hidden bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ach.imageUrl}
                      alt={ach.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#FA6400] text-white text-[10px] font-bold shadow-xs">
                        Tingkat {ach.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#FFF0E5] text-[#C2410C] text-[9px] font-bold uppercase tracking-wider mb-1.5">
                        {ach.category} • {ach.year}
                      </span>
                      <h3 className="text-sm font-bold text-[#1E2330] leading-snug line-clamp-2">
                        {ach.title}
                      </h3>
                    </div>

                    <div className="pt-2.5 border-t border-stone-100 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                        <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>{ach.studentName}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1 font-medium">
                        {ach.competitionName}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
