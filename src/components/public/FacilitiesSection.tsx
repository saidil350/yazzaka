"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function FacilitiesSection() {
  const { facilities } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const published = facilities.filter((f) => f.status === "published");

  // Dynamic category list extracted from database
  const categories = [
    "Semua",
    ...Array.from(new Set(published.map((f) => f.category).filter(Boolean))),
  ];

  const filtered =
    selectedCategory === "Semua"
      ? published
      : published.filter((f) => f.category === selectedCategory);

  return (
    <section id="fasilitas" className="py-14 lg:py-16 bg-[#FFFDF9] border-b border-[#E8E2D8] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] font-bold text-xs">
              <Building className="h-3.5 w-3.5 text-[#16A34A]" />
              <span>Sarana &amp; Lingkungan Terpadu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Fasilitas Kampus Modern &amp; Asri
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Infrastruktur terintegrasi untuk mendukung proses belajar mengajar, praktikum sains, ibadah berjamaah, dan kenyamanan hidup asrama.
            </p>
          </div>

          <Link href="/fasilitas">
            <Button
              variant="outline"
              size="default"
              className="font-bold text-xs h-9 px-4 shrink-0"
            >
              <span>Jelajahi Semua Fasilitas</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Headspace Pill Filter Bar */}
        {categories.length > 1 && (
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
        )}

        {/* Grid or EmptyState */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Building}
            title="Belum Ada Fasilitas Ditemukan"
            description="Saat ini belum ada sarana atau fasilitas yang tersedia untuk kategori ini."
            action={{
              label: "Reset Filter",
              onClick: () => setSelectedCategory("Semua"),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-3xl border-2 border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 relative overflow-hidden bg-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fac.imageUrl}
                      alt={fac.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#1E2330] px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs border border-white">
                      {fac.category}
                    </div>
                    {fac.capacity && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#1E2330] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#E8E2D8] shadow-xs">
                        {fac.capacity}
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-base sm:text-lg text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                      {fac.description}
                    </p>
                  </div>
                </div>

                {fac.capacity && (
                  <div className="p-5 pt-0">
                    <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                      <Users className="h-3 w-3 text-[#FA6400]" />
                      <span>Daya Tampung: {fac.capacity}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
