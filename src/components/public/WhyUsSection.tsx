"use client";

import React from "react";
import { Sparkles, Languages, Cpu, HeartHandshake, Building2, PlaneTakeoff } from "lucide-react";

export function WhyUsSection() {
  const advantages = [
    {
      icon: Sparkles,
      num: "01",
      title: "Kurikulum Terpadu Berakreditasi A (Unggul)",
      description:
        "Sinergi seimbang antara Kurikulum Merdeka Kemendikbudristek, muatan pesantren bertaraf internasional, dan pembinaan tahfiz Al-Qur'an 30 juz bersanad.",
      badgeColor: "bg-[#FFF0E5] text-[#FA6400] border-[#FED7AA]",
    },
    {
      icon: Languages,
      num: "02",
      title: "Ekosistem Bilingual Aktif 24 Jam",
      description:
        "Pembiasaan bahasa Arab dan Inggris secara intensif dalam interaksi harian, pidato (muhadharah), serta persiapan sertifikasi TOEFL & TOAFL resmi.",
      badgeColor: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
    },
    {
      icon: Cpu,
      num: "03",
      title: "Pembinaan Riset Sains & Robotika Terstruktur",
      description:
        "Klub olimpiade sains terpadu yang didampingi oleh para pakar dan telah mengantarkan santri meraih medali emas tingkat nasional dan internasional.",
      badgeColor: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]",
    },
    {
      icon: HeartHandshake,
      num: "04",
      title: "Pola Pengasuhan Asrama yang Humanis",
      description:
        "Rasio pendampingan musyrif dan wali asrama yang ideal, menjamin kesehatan fisik, kenyamanan psikologis, dan pengawasan ibadah yang berdisiplin penuh cinta.",
      badgeColor: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
    },
    {
      icon: Building2,
      num: "05",
      title: "Sarana Prasarana Modern & Representatif",
      description:
        "Smart classroom ber-AC, laboratorium canggih, masjid agung representatif, gelanggang olahraga, dan perpustakaan digital terintegrasi.",
      badgeColor: "bg-[#FEF9C3] text-[#CA8A04] border-[#FEF08A]",
    },
    {
      icon: PlaneTakeoff,
      num: "06",
      title: "Jalur Terbuka Menuju PTN & Luar Negeri",
      description:
        "Bimbingan SNBP/SNBT intensif serta pembinaan beasiswa luar negeri (Al-Azhar Kairo, Universitas Madinah, Turki, dan universitas terkemuka dunia lainnya).",
      badgeColor: "bg-[#FFE4E6] text-[#E11D48] border-[#FECDD3]",
    },
  ];

  return (
    <section className="py-14 lg:py-16 bg-[#1E2330] text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FA6400]/20 border border-[#FA6400]/40 text-[#FF9E59] font-bold text-xs">
            <Sparkles className="h-3 w-3" />
            <span>Mengapa Memilih Yazzaka?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Enam Alasan Kuat Santri Tumbuh Optimal Bersama Kami
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Menyatukan nilai luhur pesantren salaf dan dinamika sains abad ke-21 untuk melahirkan lulusan yang bertakwa, cerdas, beradab, dan mandiri.
          </p>
        </div>

        {/* 6 Headspace Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="bg-[#282E3E] border-2 border-white/10 rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:border-[#FA6400] hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`h-10 w-10 rounded-xl ${adv.badgeColor} border flex items-center justify-center shadow-xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-stone-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      Poin {adv.num}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {adv.title}
                  </h3>

                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-normal">
                    {adv.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
