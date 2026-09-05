"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateIndonesian } from "@/lib/utils";
import { ArrowRight, Phone, Sparkles, CheckCircle2, Lock, Unlock, Calendar } from "lucide-react";

export function AdmissionCTA() {
  const { profile, admission } = useSchoolData();

  return (
    <section id="ppdb" className="py-14 lg:py-18 bg-[#FFFDF9] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Headspace Warm Sunset Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FA6400] via-[#FF7824] to-[#FF934A] text-white p-6 sm:p-10 lg:p-12 shadow-xl">

          {/* Decorative Playful Blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-amber-300/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs border-white/30 text-white font-extrabold text-xs shadow-xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                  <span>{admission.periodName}</span>
                </Badge>

                <Badge variant="outline" className="gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs border-white/20 text-white text-[11px] font-bold">
                  {admission.isOpen ? (
                    <>
                      <Unlock className="h-3 w-3 text-emerald-300" />
                      <span>Pendaftaran Dibuka</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 text-amber-200" />
                      <span>Pendaftaran Ditutup</span>
                    </>
                  )}
                </Badge>

                {admission.startDate && admission.endDate && (
                  <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs border-white/20 text-white text-[11px] font-medium">
                    <Calendar className="h-3 w-3 text-amber-200" />
                    <span>{formatDateIndonesian(admission.startDate)} – {formatDateIndonesian(admission.endDate)}</span>
                  </Badge>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {admission.isOpen 
                  ? "Mulai Perjalanan Belajar Santri yang Menyenangkan & Berkah" 
                  : "Informasi Penerimaan Siswa & Santri Baru Yayasan Yazzaka"}
              </h2>

              <p className="text-sm sm:text-base text-amber-100 leading-relaxed max-w-2xl font-medium">
                {admission.isOpen
                  ? "Pendaftaran santri baru jalur beasiswa tahfiz, prestasi olimpiade sains, dan reguler telah dibuka. Kuota setiap gelombang terbatas demi menjaga rasio pengasuhan dan pembelajaran yang ideal."
                  : (admission.closedMessage || "Pendaftaran gelombang ini sedang ditutup. Anda dapat melihat informasi persyaratan berkas, transparansi biaya, dan konsultasi dengan panitia admisi.")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-white/95 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-200 shrink-0" />
                  <span>Beasiswa Tahfiz 10-30 Juz &amp; Sains</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-200 shrink-0" />
                  <span>Ujian Seleksi Online / Offline Fleksibel</span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <Link href="/pendaftaran" className="block w-full">
                <Button
                  size="default"
                  className="w-full justify-center text-sm font-extrabold bg-white text-[#FA6400] hover:bg-[#FAF6EE] shadow-md border-2 border-white h-11 cursor-pointer"
                >
                  <span>{admission.isOpen ? "Daftar Siswa Baru" : "Lihat Informasi PPDB"}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>

              <a
                href={`https://wa.me/${profile.whatsapp}?text=Halo%20Sekretariat%20Yazzaka,%20saya%20ingin%20berkonsultasi%20mengenai%20pendaftaran%20santri%20baru.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="outline"
                  size="default"
                  className="w-full justify-center text-xs font-bold text-white border border-white/40 bg-white/10 hover:bg-white/20 hover:border-white hover:text-white h-10"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-300 mr-1" />
                  <span>Konsultasi WhatsApp</span>
                </Button>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
