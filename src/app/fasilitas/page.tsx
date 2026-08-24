"use client";

import React, { useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Building, Users, Sparkles } from "lucide-react";

export default function FacilitiesPage() {
  const { facilities } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = [
    "Semua",
    "Ruang Belajar",
    "Laboratorium & Riset",
    "Asrama & Hunian",
    "Sarana Ibadah & Olahraga",
  ];

  const filtered =
    selectedCategory === "Semua"
      ? facilities.filter((f) => f.status === "published")
      : facilities.filter(
          (f) => f.status === "published" && f.category === selectedCategory
        );

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] font-bold text-xs mb-3 shadow-xs">
              <Building className="h-3.5 w-3.5 text-[#16A34A]" />
              <span>Infrastruktur &amp; Lingkungan Terpadu</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Fasilitas Modern &amp; Asri
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Mendukung ekosistem belajar yang nyaman, higienis, berteknologi mutakhir, dan kondusif bagi santri untuk beribadah dan berkarya.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white rounded-3xl border-2 border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all flex flex-col group justify-between"
                >
                  <div>
                    <div className="h-52 relative overflow-hidden bg-stone-200">
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

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
