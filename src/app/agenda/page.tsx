"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { formatDateIndonesian } from "@/lib/utils";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function EventsPage() {
  const { events } = useSchoolData();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <Badge variant="secondary" className="gap-2 mb-3">
              <Calendar className="h-3.5 w-3.5 text-yazzaka-orange" />
              <span>Kalender Akademik &amp; Kegiatan</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Agenda &amp; Kegiatan Sekolah
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Jadwal pelaksanaan penerimaan santri/siswa, seminar parenting, wisuda tahfiz, haflah khotmil Quran, dan kegiatan kesiswaan.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Event List or EmptyState */}
            {events.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Tidak Ada Agenda yang Ditemukan"
                description="Saat ini belum ada jadwal agenda kegiatan."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-white rounded-3xl border-2 border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                        {evt.coverImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={evt.coverImage}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Calendar className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA] px-3 py-1 rounded-xl text-center shrink-0">
                            <span className="block text-[9px] font-bold uppercase">
                              {new Date(`${evt.date}T00:00:00Z`).toLocaleDateString("id-ID", { month: "short", timeZone: "UTC" })}
                            </span>
                            <span className="text-base font-black">
                              {new Date(`${evt.date}T00:00:00Z`).getUTCDate()}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-stone-500 font-medium block">
                              {formatDateIndonesian(evt.date)}
                            </span>
                            <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-stone-400" />
                              {evt.time}
                            </span>
                          </div>
                        </div>

                        <h2 className="text-base font-bold text-[#1E2330] leading-snug">
                          {evt.title}
                        </h2>

                        <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-2">
                          {evt.description}
                        </p>

                        <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-[#FA6400] shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <Link href="/pendaftaran" className="block">
                        <Button
                          variant="outline"
                          size="default"
                          className="w-full justify-between font-bold text-xs h-9"
                        >
                          <span>Informasi Pendaftaran</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
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
