"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { formatDateIndonesian } from "@/lib/utils";
import { Search, Calendar, Clock, ArrowRight, Tag, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NewsIndexPage() {
  const { articles } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = [
    "Semua",
    "Berita Sekolah",
    "Wawasan & Opini",
    "Prestasi",
    "Kegiatan Santri",
    "Pengumuman",
  ];

  const published = articles.filter((a) => a.status === "published");

  const filtered = published.filter((art) => {
    const matchCategory =
      selectedCategory === "Semua" || art.category === selectedCategory;
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D28D9] font-bold text-xs mb-3 shadow-xs">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Warta &amp; Kabar Terkini</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Warta &amp; Publikasi Yazzaka
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Dokumentasi kegiatan santri, wawasan pendidikan islami, capaian prestasi, dan informasi resmi pesantren.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF6EE] p-3 sm:p-4 rounded-2xl border-2 border-[#E8E2D8] shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={[
                        "px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer",
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

              <div className="w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Cari berita atau topik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-xs bg-white"
                />
              </div>
            </div>

            {/* Articles List */}
            {filtered.length === 0 ? (
              <div className="bg-[#FAF6EE] rounded-3xl p-10 text-center border-2 border-[#E8E2D8] space-y-2">
                <p className="text-base font-bold text-[#1E2330]">
                  Tidak ada artikel yang sesuai dengan pencarian Anda.
                </p>
                <p className="text-xs text-stone-500 font-medium">
                  Coba gunakan kata kunci lain atau pilih kategori &quot;Semua&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white rounded-3xl border-2 border-[#E8E2D8] overflow-hidden flex flex-col justify-between hover:border-[#FA6400]/40 hover:shadow-md transition-all shadow-xs group"
                  >
                    <div>
                      <div className="h-48 relative overflow-hidden bg-stone-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#FA6400] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                          {art.category}
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <span className="text-[11px] text-stone-500 font-semibold block">
                          {formatDateIndonesian(art.publishedDate)} • {art.readTime}
                        </span>

                        <Link href={`/berita/${art.slug}`}>
                          <h2 className="text-base font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug line-clamp-2">
                            {art.title}
                          </h2>
                        </Link>

                        <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 font-medium">Oleh {art.author}</span>
                        <Link
                          href={`/berita/${art.slug}`}
                          className="font-bold text-xs text-[#FA6400] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Baca Detail</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
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
