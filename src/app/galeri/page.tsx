"use client";

import React, { useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Image as ImageIcon, Video, FileText, X, ExternalLink, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function GalleryPage() {
  const { media, profile } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  // Dynamic categories extracted from media library in database
  const categories = [
    "Semua",
    ...Array.from(new Set(media.map((m) => m.category).filter(Boolean))),
  ];

  const filtered =
    selectedCategory === "Semua"
      ? media
      : media.filter((m) => m.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D28D9] font-bold text-xs mb-3 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dokumentasi Visual &amp; Multimedia</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Galeri Kegiatan {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Merekam dinamika keseharian santri, suasana pembelajaran di kelas, keasrian lingkungan sekolah, dan kebersamaan ukhuwah.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Filter Tabs */}
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

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all group flex flex-col cursor-pointer"
                  onClick={() => {
                    if (item.fileType === "image") {
                      setActiveLightbox(item.fileUrl);
                    } else if (item.fileType === "video") {
                      window.open(item.fileUrl, "_blank");
                    }
                  }}
                >
                  <div className="h-60 relative overflow-hidden bg-stone-200">
                    {item.fileType === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.fileUrl}
                        alt={item.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : item.fileType === "video" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1E2330] text-white p-6 text-center">
                        <Video className="h-10 w-10 text-[#FA6400] mb-2" />
                        <span className="text-xs font-bold text-white">Video Dokumentasi</span>
                        <span className="text-[11px] text-amber-300 font-semibold mt-1 flex items-center gap-1">
                          Buka di Tab Baru <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-700 p-6 text-center">
                        <FileText className="h-10 w-10 text-[#FA6400] mb-2" />
                        <span className="text-xs font-bold">{item.fileName}</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#1E2330] px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs border border-white">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-4 bg-white flex items-center justify-between">
                    <p className="text-xs font-bold text-[#1E2330] truncate group-hover:text-[#FA6400] transition-colors">
                      {item.altText || item.fileName}
                    </p>
                    <span className="text-[10px] font-semibold text-stone-400 uppercase">
                      {item.fileType}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <EmptyState
                icon={ImageIcon}
                title="Tidak Ada Media Ditemukan"
                description={
                  selectedCategory !== "Semua"
                    ? `Belum ada dokumentasi foto atau video dalam kategori "${selectedCategory}".`
                    : "Belum ada berkas media galeri yang dipublikasikan."
                }
                action={
                  selectedCategory !== "Semua"
                    ? {
                        label: "Tampilkan Semua Media",
                        onClick: () => setSelectedCategory("Semua"),
                      }
                    : undefined
                }
              />
            )}

          </div>
        </section>

      </main>
      <Footer />

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white p-2">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeLightbox}
              alt="Preview Galeri"
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
