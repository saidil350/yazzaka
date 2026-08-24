"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Heart,
} from "lucide-react";

export function Footer() {
  const { profile } = useSchoolData();

  return (
    <footer className="bg-[#1E2330] text-stone-300 pt-16 pb-12 rounded-t-[3rem] border-t-2 border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">

          {/* Institution Brand & Legal Data (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FA6400] text-white flex items-center justify-center font-bold text-lg shadow-[0_2px_0_#cc5000]">
                Y
              </div>
              <span className="text-xl text-white font-extrabold tracking-tight">
                {profile.name}
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed pr-6 font-normal">
              {profile.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                Terakreditasi {profile.accreditation}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-bold border border-white/10">
                <Award className="h-3.5 w-3.5 text-sky-400" />
                NPSN: {profile.npsn}
              </span>
            </div>
          </div>

          {/* Academic & Curriculum Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Program &amp; Akademik
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/program" className="hover:text-[#FA6400] transition-colors">
                  Kurikulum &amp; Program Unggulan
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-[#FA6400] transition-colors">
                  Profil Visi &amp; Misi Lembaga
                </Link>
              </li>
              <li>
                <Link href="/fasilitas" className="hover:text-[#FA6400] transition-colors">
                  Fasilitas &amp; Sarana Kampus
                </Link>
              </li>
              <li>
                <Link href="/prestasi" className="hover:text-[#FA6400] transition-colors">
                  Galeri Prestasi Santri
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#FA6400] transition-colors">
                  Dokumentasi Multimedia
                </Link>
              </li>
            </ul>
          </div>

          {/* Admission & Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Penerimaan Santri
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-medium">
              <li>
                <Link href="/pendaftaran" className="hover:text-[#FA6400] transition-colors">
                  Informasi Gelombang PPDB
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran#biaya" className="hover:text-[#FA6400] transition-colors">
                  Rincian Biaya Pendidikan
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran#faq" className="hover:text-[#FA6400] transition-colors">
                  Tanya Jawab (FAQ PPDB)
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-[#FA6400] transition-colors">
                  Warta Berita &amp; Artikel
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-[#FA6400] transition-colors">
                  Kalender Kegiatan Sekolah
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Secretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Sekretariat &amp; Lokasi
            </h4>
            <div className="space-y-2 text-xs text-stone-400 leading-relaxed font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#FA6400] shrink-0 mt-0.5" />
                <span>
                  {profile.address}, {profile.city}, {profile.province}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#FA6400] shrink-0" />
                <span>{profile.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#FA6400] shrink-0" />
                <span>{profile.email}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} {profile.name}. Dibuat dengan penuh</span>
            <Heart className="h-3.5 w-3.5 text-[#FA6400] fill-[#FA6400]" />
          </p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-stone-400 hover:text-amber-300 transition-colors font-bold">
              Portal Admin CMS
            </Link>
            <Link href="/kontak" className="hover:text-white transition-colors">
              Pusat Bantuan &amp; Kontak
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
