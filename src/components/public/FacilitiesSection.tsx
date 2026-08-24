"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Users } from "lucide-react";

export function FacilitiesSection() {
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
    <section className="py-14 lg:py-16 bg-[#FFFDF9] border-b border-[#E8E2D8]">
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
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#FAF6EE] border border-[#E8E2D8] w-fit">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={[
                  "px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer",
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

        {/* Facilities Grid with Headspace Rounded Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map((fac) => (
            <div
              key={fac.id}
              className="bg-white border-2 border-[#E8E2D8] rounded-2xl overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md hover:border-[#FA6400]/50 transition-all duration-200"
            >
              <div className="h-48 relative overflow-hidden bg-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fac.imageUrl}
                  alt={fac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-stone-800 text-[11px] font-bold shadow-xs border border-white">
                    {fac.category}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E2330] leading-snug group-hover:text-[#FA6400] transition-colors">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1 font-medium line-clamp-2">
                    {fac.description}
                  </p>
                </div>

                {fac.capacity && (
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-semibold text-stone-500">
                    <Users className="h-3 w-3 text-[#FA6400]" />
                    <span>Kapasitas: {fac.capacity}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
