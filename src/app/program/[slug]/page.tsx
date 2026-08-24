"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Clock, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { programs } = useSchoolData();

  const program = programs.find((p) => p.slug === resolvedParams.slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link
              href="/program"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FA6400] hover:underline mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Direktori Program</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFF0E5] text-[#FA6400] font-bold text-xs border border-[#FED7AA] block w-fit mb-2">
              {program.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              {program.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed font-medium">
              {program.shortDesc}
            </p>
          </div>
        </section>

        {/* ── Content Details ─────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Left Main (8 cols) */}
              <div className="lg:col-span-8 space-y-6">

                <div className="rounded-3xl overflow-hidden border-2 border-[#E8E2D8] bg-[#FAF6EE] p-2 shadow-xs">
                  <div className="aspect-video relative overflow-hidden rounded-2xl bg-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-stone-700 leading-relaxed font-medium">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2330]">
                    Deskripsi &amp; Metodologi Pembelajaran
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed text-stone-600">
                    {program.fullDesc}
                  </p>
                </div>

                {/* Features list */}
                <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2 border-[#E8E2D8] space-y-3 shadow-xs">
                  <h3 className="text-base font-bold text-[#1E2330]">
                    Target Capaian &amp; Keunggulan Khusus
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {program.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#FAF6EE] p-6 rounded-3xl border-2 border-[#E8E2D8] space-y-4 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FA6400] block">
                    Pendaftaran Santri Baru
                  </span>
                  <h3 className="text-base font-bold text-[#1E2330]">
                    Tertarik dengan Program Ini?
                  </h3>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    Daftarkan putra/putri Anda sekarang atau hubungi panitia PPDB untuk konsultasi kurikulum.
                  </p>

                  <div className="space-y-2 pt-2">
                    <Link href="/pendaftaran" className="block">
                      <Button className="w-full justify-center font-bold text-xs h-10">
                        <span>Daftar Sekarang</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                    <Link href="/kontak" className="block">
                      <Button variant="outline" className="w-full justify-center text-xs h-9">
                        Konsultasi Program
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
