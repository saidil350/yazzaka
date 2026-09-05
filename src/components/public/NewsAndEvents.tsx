"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { formatDateIndonesian } from "@/lib/utils";
import { ArrowRight, Clock, Newspaper, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export function NewsAndEvents() {
  const { articles, events } = useSchoolData();

  const publishedArticles = articles
    .filter((a) => a.status === "published")
    .slice(0, 3);

  const upcomingEvents = events
    .filter((e) => e.status === "upcoming")
    .slice(0, 3);

  const leadArticle = publishedArticles[0];
  const sideArticles = publishedArticles.slice(1);

  return (
    <section className="py-14 lg:py-16 bg-[#FFFDF9] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="outline" className="gap-2 px-3 py-1 rounded-full bg-stone-100/90 border-stone-200 text-stone-700 font-semibold text-xs shadow-2xs">
              <Newspaper className="h-3.5 w-3.5 text-[#FA6400]" />
              <span>Kabar Terkini &amp; Agenda Sekolah</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Warta Kegiatan &amp; Agenda Sekolah
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Dokumentasi dinamika kegiatan santri, wawasan parenting islami, dan agenda kegiatan penting yayasan.
            </p>
          </div>

          <Link href="/berita">
            <Button
              variant="outline"
              size="default"
              className="font-bold text-xs h-9 px-4 shrink-0"
            >
              <span>Indeks Warta Lengkap</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Column: News Articles (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {publishedArticles.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Belum Ada Warta Terbaru"
                description="Saat ini belum ada warta atau pengumuman yang dipublikasikan. Silakan cek kembali nanti."
                action={{
                  label: "Buka Halaman Warta",
                  href: "/berita",
                }}
              />
            ) : (
              <>
                {/* Lead Story Card */}
                {leadArticle && (
                  <div className="bg-white border-2 border-[#E8E2D8] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col md:flex-row group">
                    <div className="md:w-1/2 h-52 md:h-auto relative overflow-hidden bg-stone-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={leadArticle.coverImage}
                        alt={leadArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white border-transparent text-[11px] font-bold shadow-xs">
                          {leadArticle.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <span className="text-[11px] text-stone-500 font-semibold block">
                          {formatDateIndonesian(leadArticle.publishedDate)} • {leadArticle.readTime}
                        </span>
                        <Link href={`/berita/${leadArticle.slug}`}>
                          <h3 className="text-lg sm:text-xl font-bold text-[#1E2330] hover:text-[#FA6400] transition-colors leading-snug">
                            {leadArticle.title}
                          </h3>
                        </Link>
                        <p className="text-stone-600 text-xs leading-relaxed font-medium line-clamp-2">
                          {leadArticle.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs text-stone-500 font-medium">Oleh {leadArticle.author}</span>
                        <Link
                          href={`/berita/${leadArticle.slug}`}
                          className="font-bold text-xs text-[#FA6400] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Baca Lengkap</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Secondary Stories Grid */}
                {sideArticles.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sideArticles.map((art) => (
                      <div
                        key={art.id}
                        className="bg-[#FAF6EE] border-2 border-[#E8E2D8] rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:bg-white hover:border-[#FA6400]/40 hover:shadow-xs transition-all duration-200"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="px-2 py-0.5 rounded-full bg-white border-stone-200 text-[9px] font-bold text-stone-700">
                              {art.category}
                            </Badge>
                            <span className="text-[11px] text-stone-500 font-medium">
                              {formatDateIndonesian(art.publishedDate)}
                            </span>
                          </div>

                          <Link href={`/berita/${art.slug}`}>
                            <h4 className="text-sm sm:text-base font-bold text-[#1E2330] hover:text-[#FA6400] transition-colors line-clamp-2 leading-snug">
                              {art.title}
                            </h4>
                          </Link>

                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">
                            {art.excerpt}
                          </p>
                        </div>

                        <div className="pt-3 mt-2 border-t border-stone-200/60 flex items-center justify-between">
                          <span className="text-[10px] text-stone-500">{art.author}</span>
                          <Link
                            href={`/berita/${art.slug}`}
                            className="font-bold text-xs text-[#FA6400] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Detail</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column: Upcoming Events & Notice (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
              <h3 className="text-base font-bold text-[#1E2330]">
                Agenda Terdekat
              </h3>
              <Link
                href="/agenda"
                className="text-xs font-bold text-[#FA6400] hover:underline"
              >
                Kalender Lengkap
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon={Calendar}
                  title="Belum Ada Agenda Terdekat"
                  description="Jadwal agenda kegiatan baru akan segera diumumkan."
                />
              ) : (
                upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white border-2 border-[#E8E2D8] rounded-xl p-3.5 flex items-start gap-3 hover:border-[#FA6400]/40 transition-all shadow-xs"
                  >
                    {/* Calendar Pill Block */}
                    <div className="bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA] p-2 rounded-xl text-center shrink-0 w-12 shadow-xs">
                      <span className="block text-[9px] font-extrabold uppercase leading-none">
                        {new Date(evt.date).toLocaleDateString("id-ID", { month: "short" })}
                      </span>
                      <span className="text-lg font-black leading-none block mt-1">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-xs">
                      <Badge variant="outline" className="px-2 py-0.5 rounded-full bg-stone-100 border-stone-200 text-stone-700 font-bold text-[9px] inline-block">
                        {evt.category}
                      </Badge>
                      <h4 className="text-xs font-bold text-[#1E2330] leading-snug">
                        {evt.title}
                      </h4>
                      <p className="text-stone-500 flex items-center gap-1 font-medium text-[11px] pt-0.5">
                        <Clock className="h-2.5 w-2.5 text-stone-400" />
                        <span>{evt.time}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Official Admission Notice Box */}
            <div className="rounded-2xl border-2 border-[#FED7AA] bg-[#FFF0E5] p-5 space-y-2.5 shadow-xs">
              <Badge variant="default" className="inline-block px-2.5 py-0.5 rounded-full bg-[#FA6400] hover:bg-[#FA6400] text-white border-transparent text-[10px] font-bold shadow-xs">
                Pemberitahuan Resmi PPDB
              </Badge>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                Pendaftaran santri baru jalur beasiswa tahfiz 10 juz dan olimpiade sains ditutup sesuai kuota gelombang 1.
              </p>
              <Link href="/pendaftaran" className="block pt-1">
                <Button className="w-full text-xs font-bold h-9">
                  <span>Informasi Biaya &amp; Kuota</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
