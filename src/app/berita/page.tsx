"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { formatDateIndonesian } from "@/lib/utils";
import { Search, Calendar, Clock, ArrowRight, Tag, Newspaper } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

export default function NewsIndexPage() {
  const { articles, profile } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const published = articles.filter((a) => a.status === "published");

  // Dynamic categories extracted from articles in database
  const categories = [
    "Semua",
    ...Array.from(new Set(published.map((a) => a.category).filter(Boolean))),
  ];

  const filtered = published.filter((art) => {
    const matchCategory =
      selectedCategory === "Semua" || art.category === selectedCategory;
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(art.tags) && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
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
              Warta &amp; Publikasi {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Dokumentasi kegiatan santri, wawasan pendidikan islami, capaian prestasi, dan informasi resmi pesantren.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#FAF6EE] border border-[#E8E2D8] w-full md:w-auto">
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

              <div className="w-full md:w-72">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <Input
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-[#FAF6EE] border-[#E8E2D8] rounded-full text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-3xl border-2 border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all flex flex-col justify-between group"
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
                      <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-stone-400" />
                          {formatDateIndonesian(art.publishedDate)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-stone-400" />
                          {art.readTime}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h2>

                      <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-3">
                        {art.excerpt}
                      </p>

                      {Array.isArray(art.tags) && art.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {art.tags.slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF6EE] border border-[#E8E2D8] text-stone-600 font-semibold flex items-center gap-0.5"
                            >
                              <Tag className="h-2.5 w-2.5 text-stone-400" />
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link href={`/berita/${art.slug}`} className="block">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FA6400] group-hover:translate-x-1 transition-transform">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <EmptyState
                icon={Newspaper}
                title="Tidak Ada Artikel Ditemukan"
                description={
                  searchQuery
                    ? `Tidak ditemukan warta dengan kata kunci "${searchQuery}".`
                    : "Belum ada artikel yang dipublikasikan dalam kategori ini."
                }
                action={
                  searchQuery || selectedCategory !== "Semua"
                    ? {
                        label: "Reset Pencarian",
                        onClick: () => {
                          setSearchQuery("");
                          setSelectedCategory("Semua");
                        },
                      }
                    : undefined
                }
              />
            )}

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
