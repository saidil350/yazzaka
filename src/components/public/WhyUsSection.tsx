"use client";

import React from "react";
import {
  Sparkles,
  BookOpen,
  Heart,
  GraduationCap,
  Users,
  ShieldCheck,
  Globe,
  Award,
} from "lucide-react";

export function WhyUsSection() {
  const advantages = [
    {
      icon: Award,
      num: "01",
      title: "Bimbingan Ulama Al-Azhar Kairo",
      description:
        "Kurikulum dan nilai pembinaan dibimbing langsung oleh Dr. Amri Fatmi, Lc., M.A. (Doktor Akidah Filsafat Al-Azhar Kairo Summa Cum Laude).",
      cardBg: "bg-[#FFF7F0]",
      border: "border-[#FED7AA]",
      iconBg: "bg-[#FA6400] text-white",
      badge: "bg-[#FA6400]/10 text-[#C2410C] border-[#FED7AA]",
    },
    {
      icon: Heart,
      num: "02",
      title: "Pendidikan Fitrah & Akhlakul Karimah",
      description:
        "Fokus utama pada penanaman akidah yang kokoh, adab islami dalam kehidupan sehari-hari, serta pembentukan karakter santri yang santun dan berbudi luhur.",
      cardBg: "bg-[#F0F9FF]",
      border: "border-[#BAE6FD]",
      iconBg: "bg-[#0284C7] text-white",
      badge: "bg-[#0284C7]/10 text-[#0369A1] border-[#BAE6FD]",
    },
    {
      icon: GraduationCap,
      num: "03",
      title: "Ekosistem Pendidikan Berjenjang",
      description:
        "Menaungi jenjang usia dini (TPA & TKIT), pembinaan karakter (Sekolah Anak Shalih), kesetaraan masyarakat (PKBM), hingga tahfiz Al-Qur'an 30 juz (Darul Quran).",
      cardBg: "bg-[#F5F3FF]",
      border: "border-[#DDD6FE]",
      iconBg: "bg-[#7C3AED] text-white",
      badge: "bg-[#7C3AED]/10 text-[#6D28D9] border-[#DDD6FE]",
    },
    {
      icon: Users,
      num: "04",
      title: "Ketahanan & Edukasi Keluarga",
      description:
        "Menjadikan keluarga sebagai pilar utama pembinaan melalui program parenting berkala, kajian tematik, dan sinergi aktif antara asatizah dan orang tua.",
      cardBg: "bg-[#F0FDF4]",
      border: "border-[#BBF7D0]",
      iconBg: "bg-[#16A34A] text-white",
      badge: "bg-[#16A34A]/10 text-[#15803D] border-[#BBF7D0]",
    },
    {
      icon: ShieldCheck,
      num: "05",
      title: "Legalitas Resmi SK Kemenkumham RI",
      description:
        "Lembaga berbadan hukum resmi dengan SK Kemenkumham RI No. AHU-0005614.AH.01.04. Tahun 2022, menjamin tata kelola yayasan yang amanah dan akuntabel.",
      cardBg: "bg-[#FEFCE8]",
      border: "border-[#FEF08A]",
      iconBg: "bg-[#CA8A04] text-white",
      badge: "bg-[#CA8A04]/10 text-[#A16207] border-[#FEF08A]",
    },
    {
      icon: Globe,
      num: "06",
      title: "Kawasan Pesantren Peradaban 6.0",
      description:
        "Inisiasi strategis pembangunan pesantren peradaban modern di Cot Rheng, Pidie, guna mencetak generasi ulama dan cendekiawan berwawasan global.",
      cardBg: "bg-[#FFF1F2]",
      border: "border-[#FECDD3]",
      iconBg: "bg-[#E11D48] text-white",
      badge: "bg-[#E11D48]/10 text-[#BE123C] border-[#FECDD3]",
    },
  ];

  return (
    <section className="py-14 lg:py-16 bg-[#FFFDF9] text-stone-800 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] font-bold text-xs shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#FA6400]" />
            <span>Mengapa Memilih Yazzakka?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
            Enam Alasan Kuat Santri Tumbuh Optimal Bersama Kami
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-medium">
            Memadukan bimbingan ulama berstandar Al-Azhar, penguatan karakter tauhid &amp; adab, serta ekosistem belajar yang ramah anak, berjenjang, dan menyenangkan.
          </p>
        </div>

        {/* 6 Playful Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className={`${adv.cardBg} ${adv.border} border-2 rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-md flex flex-col justify-between group shadow-xs`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-11 w-11 rounded-2xl ${adv.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${adv.badge}`}>
                      Poin {adv.num}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#1E2330] leading-snug group-hover:text-[#FA6400] transition-colors">
                      {adv.title}
                    </h3>

                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-medium">
                      {adv.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
