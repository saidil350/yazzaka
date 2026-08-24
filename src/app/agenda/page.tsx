"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { formatDateIndonesian } from "@/lib/utils";
import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const { events } = useSchoolData();
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "completed">("all");

  const filtered = events.filter((e) => {
    if (filterStatus === "all") return true;
    return e.status === filterStatus;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] font-bold text-xs mb-3 shadow-xs">
              <Calendar className="h-3.5 w-3.5" />
              <span>Kalender Akademik &amp; Kegiatan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Agenda &amp; Kegiatan Kampus
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Jadwal pelaksanaan penerimaan santri, seminar parenting, wisuda tahfiz, haflah khotmil Quran, dan kegiatan kesiswaan.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Filter */}
            <div className="flex items-center gap-2 p-1 rounded-full bg-[#FAF6EE] border border-[#E8E2D8] w-fit">
              <button
                onClick={() => setFilterStatus("all")}
                className={[
                  "px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer",
                  filterStatus === "all"
                    ? "bg-[#FA6400] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#1E2330] hover:bg-white",
                ].join(" ")}
              >
                Semua Agenda
              </button>
              <button
                onClick={() => setFilterStatus("upcoming")}
                className={[
                  "px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer",
                  filterStatus === "upcoming"
                    ? "bg-[#FA6400] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#1E2330] hover:bg-white",
                ].join(" ")}
              >
                Akan Datang
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={[
                  "px-3.5 py-1 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer",
                  filterStatus === "completed"
                    ? "bg-[#FA6400] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#1E2330] hover:bg-white",
                ].join(" ")}
              >
                Telah Selesai
              </button>
            </div>

            {/* Event List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border-2 border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-44 relative overflow-hidden bg-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={evt.coverImage}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#FA6400] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                        {evt.category}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA] px-3 py-1 rounded-xl text-center shrink-0">
                          <span className="block text-[9px] font-bold uppercase">
                            {new Date(evt.date).toLocaleDateString("id-ID", { month: "short" })}
                          </span>
                          <span className="text-base font-black">
                            {new Date(evt.date).getDate()}
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

                      <h2 className="text-base font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors leading-snug">
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

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
