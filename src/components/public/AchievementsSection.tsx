"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { ArrowRight, Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AchievementsSection() {
  const { achievements } = useSchoolData();

  return (
    <section className="py-14 lg:py-16 bg-[#FAF6EE] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9C3] border border-[#FEF08A] text-[#A16207] font-bold text-xs">
              <Trophy className="h-3 w-3 text-[#CA8A04]" />
              <span>Rekam Jejak Keberhasilan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Prestasi Santri &amp; Siswa Unggulan
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Capaian membanggakan santri Yazzaka di ajang olimpiade sains nasional, musabaqah hifdzil Quran internasional, dan riset robotika.
            </p>
          </div>

          <Link href="/prestasi">
            <Button
              variant="outline"
              size="default"
              className="font-bold text-xs h-9 px-4 shrink-0"
            >
              <span>Lihat Semua Prestasi</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Headspace Achievement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {achievements.slice(0, 4).map((ach) => (
            <div
              key={ach.id}
              className="bg-white border-2 border-[#E8E2D8] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FA6400]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-xs"
            >
              <div className="h-40 relative overflow-hidden bg-stone-100">
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
                  <h4 className="text-sm font-bold text-[#1E2330] leading-snug line-clamp-2">
                    {ach.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Award className="h-3 w-3 text-amber-500" />
                    <span>{ach.studentName}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 line-clamp-1 font-medium">
                    {ach.competitionName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
