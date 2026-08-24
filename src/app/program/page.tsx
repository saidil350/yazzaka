"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProgramsDirectoryPage() {
  const { programs } = useSchoolData();

  const published = programs
    .filter((p) => p.status === "published")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] font-bold text-xs mb-3 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>Kurikulum &amp; Pembinaan Santri</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Program Pendidikan Terpadu
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Struktur kurikulum terintegrasi yang dirancang untuk mengoptimalkan potensi intelektual, spiritual, dan kepemimpinan santri.
            </p>
          </div>
        </section>

        {/* ── Directory Grid ──────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((prog) => (
                <div
                  key={prog.id}
                  className="border-2 border-[#E8E2D8] rounded-3xl overflow-hidden bg-white flex flex-col justify-between hover:border-[#FA6400]/50 hover:shadow-md transition-all group shadow-xs"
                >
                  <div>
                    <div className="h-48 relative overflow-hidden bg-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prog.imageUrl}
                        alt={prog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#FA6400] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        {prog.category}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h2 className="text-base sm:text-lg font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug">
                        {prog.title}
                      </h2>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                        {prog.shortDesc}
                      </p>

                      <div className="pt-3 border-t border-stone-100 space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          Capaian Utama:
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
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link href={`/program/${prog.slug}`}>
                      <Button
                        variant="outline"
                        size="default"
                        className="w-full justify-between font-bold text-xs h-9"
                      >
                        <span>Rincian Kurikulum</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
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
