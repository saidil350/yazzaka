"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSchoolData } from "@/context/SchoolDataContext";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  MessageCircle,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "@/components/public/SocialIcons";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const { profile, settings } = useSchoolData();

  return (
    <footer className="relative bg-yazzaka-teal-soft text-stone-700 pt-12 pb-10 rounded-t-[2.5rem] lg:rounded-t-[3.5rem] border-t-2 border-yazzaka-teal-border overflow-hidden shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">

        {/* ── Main 4-Column Structured Grid ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-yazzaka-teal-border">

          {/* Col 1: Brand, Description, Legal Badges & Social (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src={
                  profile.branding?.logoUrl && profile.branding.logoUrl !== "/logo-yazzaka.svg"
                    ? profile.branding.logoUrl
                    : "/yazzakka.png"
                }
                alt={profile.name}
                width={180}
                height={48}
                style={{ width: "auto", height: "auto" }}
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-stone-600 leading-relaxed font-medium pr-4">
              {profile.description}
            </p>

            {/* Legal and Leader Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="outline" className="gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border-stone-200">
                <ShieldCheck className="h-3.5 w-3.5 text-yazzaka-teal-dark shrink-0" />
                <span>SK Kemenkumham: {profile.npsn}</span>
              </Badge>
              <Badge variant="outline" className="gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border-stone-200">
                <Award className="h-3.5 w-3.5 text-yazzaka-teal-dark shrink-0" />
                <span>Binaan Dr. Amri Fatmi</span>
              </Badge>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block mb-2">
                Media Sosial &amp; Kanal Dakwah:
              </span>
              <div className="flex items-center gap-2">
                {settings?.socialMedia?.instagram && (
                  <a
                    href={settings.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Yazzakka"
                    className="h-9 w-9 rounded-xl bg-white border border-[#E8E2D8] text-stone-700 hover:text-[#FA6400] hover:border-[#FA6400] hover:-translate-y-0.5 transition-all flex items-center justify-center shadow-xs"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}
                {settings?.socialMedia?.youtube && (
                  <a
                    href={settings.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube Yazzakka"
                    className="h-9 w-9 rounded-xl bg-white border border-[#E8E2D8] text-stone-700 hover:text-red-600 hover:border-red-400 hover:-translate-y-0.5 transition-all flex items-center justify-center shadow-xs"
                  >
                    <YoutubeIcon className="h-4 w-4" />
                  </a>
                )}
                {settings?.socialMedia?.facebook && (
                  <a
                    href={settings.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Yazzakka"
                    className="h-9 w-9 rounded-xl bg-white border border-[#E8E2D8] text-stone-700 hover:text-blue-600 hover:border-blue-400 hover:-translate-y-0.5 transition-all flex items-center justify-center shadow-xs"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                )}
                <a
                  href={`https://wa.me/${profile.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp CS Yazzakka"
                  className="h-9 w-9 rounded-xl bg-white border border-[#E8E2D8] text-stone-700 hover:text-emerald-600 hover:border-emerald-400 hover:-translate-y-0.5 transition-all flex items-center justify-center shadow-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: 6 Educational Units (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yazzaka-teal-dark"></span>
              <span>Unit Pendidikan &amp; Program</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <Link href="/program/tpa-yazzakka" className="hover:text-[#FA6400] transition-colors flex items-center justify-between group">
                  <span className="font-semibold text-stone-700 group-hover:text-[#FA6400]">1. TPA Yazzakka</span>
                  <span className="text-[10px] text-stone-400 group-hover:text-[#FA6400]">Usia Dini</span>
                </Link>
              </li>
              <li>
                <Link href="/program/tkit-yazzakka" className="hover:text-[#FA6400] transition-colors flex items-center justify-between group">
                  <span className="font-semibold text-stone-700 group-hover:text-[#FA6400]">2. TKIT Yazzakka</span>
                  <span className="text-[10px] text-stone-400 group-hover:text-[#FA6400]">TK Islam</span>
                </Link>
              </li>
              <li>
                <Link href="/program/sekolah-anak-shalih" className="hover:text-[#FA6400] transition-colors flex items-center justify-between group">
                  <span className="font-semibold text-stone-700 group-hover:text-[#FA6400]">3. Sekolah Anak Shalih</span>
                  <span className="text-[10px] text-stone-400 group-hover:text-[#FA6400]">Karakter</span>
                </Link>
              </li>
              <li>
                <Link href="/program/pkbm-yazzakka" className="hover:text-[#FA6400] transition-colors flex items-center justify-between group">
                  <span className="font-semibold text-stone-700 group-hover:text-[#FA6400]">4. PKBM Yazzakka</span>
                  <span className="text-[10px] text-stone-400 group-hover:text-[#FA6400]">Paket A/B/C</span>
                </Link>
              </li>
              <li>
                <Link href="/program/darul-quran-yazzakka" className="hover:text-[#FA6400] transition-colors flex items-center justify-between group">
                  <span className="font-semibold text-stone-700 group-hover:text-[#FA6400]">5. Darul Quran Yazzakka</span>
                  <span className="text-[10px] text-stone-400 group-hover:text-[#FA6400]">Tahfiz Mutqin</span>
                </Link>
              </li>
              <li className="pt-1.5 border-t border-[#E8E2D8]">
                <Link href="/program/pesantren-peradaban-60" className="text-yazzaka-orange-dark hover:text-yazzaka-orange font-bold transition-colors flex items-center justify-between">
                  <span>6. Wakaf Pesantren 6.0</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Profile & Information (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span>
              <span>Informasi &amp; Warta</span>
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li>
                <Link href="/tentang-kami" className="hover:text-[#FA6400] transition-colors">
                  Profil &amp; Visi Yayasan
                </Link>
              </li>
              <li>
                <Link href="/fasilitas" className="hover:text-[#FA6400] transition-colors">
                  Fasilitas &amp; Sarana
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-[#FA6400] transition-colors">
                  Pendaftaran &amp; Admisi
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-[#FA6400] transition-colors">
                  Warta &amp; Kajian Dakwah
                </Link>
              </li>
              <li>
                <Link href="/agenda" className="hover:text-[#FA6400] transition-colors">
                  Agenda Tabligh Akbar
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#FA6400] transition-colors">
                  Dokumentasi Foto
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Secretariat & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Sekretariat Yayasan</span>
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600 leading-relaxed font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-yazzaka-teal-dark shrink-0 mt-0.5" />
                <span>
                  {profile.address}, {profile.city}, {profile.province}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-yazzaka-teal-dark shrink-0" />
                <a href={`tel:${profile.phone}`} className="hover:text-[#FA6400] transition-colors font-semibold text-stone-700">
                  {profile.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-yazzaka-teal-dark shrink-0" />
                <a href={`mailto:${profile.email}`} className="hover:text-[#FA6400] transition-colors font-semibold text-stone-700">
                  {profile.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1.5 border-t border-yazzaka-teal-border text-[11px] text-stone-500">
                <Clock className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>Senin – Sabtu: 08:00 – 16:30 WIB</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()} {profile.name}. Berkhidmat untuk Umat.</span>
          </p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-stone-500 hover:text-[#FA6400] transition-colors font-bold">
              Login Staf
            </Link>
            <span className="text-stone-300">|</span>
            <Link href="/kontak" className="text-stone-500 hover:text-[#FA6400] transition-colors">
              Pusat Kontak &amp; Lokasi
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
