"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { formatDateIndonesian } from "@/lib/utils";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { articles } = useSchoolData();

  const article = articles.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const related = articles
    .filter((a) => a.id !== article.id && a.status === "published")
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Article Header & Metadata ───────────────── */}
        <section className="bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-3">
            <Link
              href="/berita"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FA6400] hover:underline mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Warta Berita</span>
            </Link>

            <div className="flex items-center gap-2.5 text-xs text-stone-500 font-semibold">
              <span className="bg-[#FA6400] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                {article.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateIndonesian(article.publishedDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
              Oleh <strong className="text-[#1E2330]">{article.author}</strong> • Dewan Redaksi Media Yazzakka
            </p>
          </div>
        </section>

        {/* ── Article Body ────────────────────────────── */}
        <section className="py-10 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">

            {/* Featured Image */}
            <div className="rounded-3xl overflow-hidden border-2 border-[#E8E2D8] bg-[#FAF6EE] p-2 shadow-xs">
              <div className="aspect-video relative overflow-hidden rounded-2xl bg-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Article Content */}
            <div className="text-stone-800 leading-relaxed space-y-5 text-sm sm:text-base font-normal">
              <p className="text-base sm:text-lg font-semibold text-[#1E2330] leading-relaxed border-l-4 border-[#FA6400] pl-4 italic bg-[#FFF0E5]/50 p-4 rounded-r-2xl">
                {article.excerpt}
              </p>

              <div className="whitespace-pre-line space-y-4 pt-2 text-stone-700 leading-relaxed font-normal">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-6 border-t border-[#E8E2D8] flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-500 mr-2">Topik Terkait:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#FAF6EE] text-stone-700 border border-[#E8E2D8] px-3 py-1 rounded-full text-xs font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>

          </div>
        </section>

        {/* ── Related Articles ────────────────────────── */}
        {related.length > 0 && (
          <section className="py-12 bg-[#FAF6EE] border-b border-[#E8E2D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
              <h2 className="text-xl font-bold text-[#1E2330]">
                Warta &amp; Berita Terkait Lainnya
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/berita/${rel.slug}`}
                    className="bg-white border-2 border-[#E8E2D8] rounded-2xl p-4 space-y-2 block group shadow-xs hover:border-[#FA6400]/40 transition-all"
                  >
                    <span className="text-[10px] font-bold text-[#FA6400] bg-[#FFF0E5] px-2 py-0.5 rounded-full">
                      {rel.category}
                    </span>
                    <h3 className="text-xs font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <span className="text-[10px] text-stone-500 block">
                      {formatDateIndonesian(rel.publishedDate)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
