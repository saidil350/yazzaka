"use client";

import React, { useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Trophy, Award } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AchievementsPage() {
  const { achievements, profile } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  // Dynamic categories extracted from database
  const categories = [
    "Semua",
    ...Array.from(new Set(achievements.map((a) => a.category).filter(Boolean))),
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
            <Badge variant="secondary" className="gap-2 mb-3">
              <Trophy className="h-3.5 w-3.5 text-yazzaka-orange" />
              <span>Rekam Jejak Keberhasilan</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Prestasi &amp; Penghargaan Santri
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Apresiasi capaian santri {profile.name} di ajang olimpiade sains nasional, kejuaraan robotik internasional, dan musabaqah tahfiz.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Headspace Pill Filter Bar */}
            {categories.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}

            {/* Grid or EmptyState */}
            {filtered.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="Tidak Ada Prestasi Ditemukan"
                description={
                  selectedCategory !== "Semua"
                    ? `Belum ada catatan prestasi dalam kategori "${selectedCategory}".`
                    : "Belum ada rekaman prestasi santri yang dipublikasikan."
                }
                action={
                  selectedCategory !== "Semua"
                    ? {
                        label: "Tampilkan Semua Prestasi",
                        onClick: () => setSelectedCategory("Semua"),
                      }
                    : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {filtered.map((ach) => (
                  <div
                    key={ach.id}
                    className="bg-white border-2 border-[#E8E2D8] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FA6400]/40 hover:shadow-md transition-all shadow-xs"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ach.imageUrl}
                        alt={ach.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-1.5">
                          {ach.category} • {ach.year}
                        </Badge>
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
            )}

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
