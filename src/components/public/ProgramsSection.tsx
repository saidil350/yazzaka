"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { ArrowRight, Sparkles, CheckCircle2, Layers, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export function ProgramsSection() {
  const { programs } = useSchoolData();

  const published = programs
    .filter((p) => p.status === "published")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="program" className="landing-section py-16 lg:py-20 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="h-3 w-3 text-yazzaka-teal-dark" />
              <span>Unit Pendidikan &amp; Program Strategis</span>
            </Badge>
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

        {/* 6 Interactive Cards Grid or EmptyState */}
        {published.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Belum Ada Program Ditemukan"
            description="Saat ini belum ada unit atau program pendidikan yang aktif."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((prog) => {
              const isSpecialWakaf = prog.category?.toLowerCase().includes("wakaf") || prog.slug.includes("peradaban");

              return (
                <div
                  key={prog.id}
                  className="interactive-lift rounded-[1.25rem] border border-[#E8E2D8] overflow-hidden flex flex-col justify-between group shadow-xs bg-white"
                >
                  <div>
                    {/* Card Image Banner */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                      {prog.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={prog.imageUrl}
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <ImageIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-base sm:text-lg font-bold text-[#1E2330] leading-snug">
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
                              <CheckCircle2 className="h-3.5 w-3.5 text-yazzaka-teal-dark shrink-0" />
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
                        <span>{isSpecialWakaf ? "Pelajari Info Wakaf & Masterplan" : "Rincian Lebih Lanjut"}</span>
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
