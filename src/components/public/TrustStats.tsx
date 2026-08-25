"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Calendar, Users, BookOpenCheck, GraduationCap } from "lucide-react";

export function TrustStats() {
  const { profile } = useSchoolData();

  const stats = [
    {
      icon: Calendar,
      label: "Tahun Berdiri",
      value: `${profile.establishedYear}`,
      suffix: " M",
      desc: "14+ tahun berkiprah mencetak kader pemimpin",
      cardBg: "bg-[#FFF0E5]",
      borderBg: "border-[#FED7AA]",
      iconBg: "bg-[#FA6400] text-white",
      textColor: "text-[#C2410C]",
    },
    {
      icon: Users,
      label: "Santri Aktif",
      value: `${profile.studentCount}`,
      suffix: "+",
      desc: "Santri berprestasi dari seluruh Indonesia",
      cardBg: "bg-[#E0F2FE]",
      borderBg: "border-[#BAE6FD]",
      iconBg: "bg-[#0284C7] text-white",
      textColor: "text-[#0369A1]",
    },
    {
      icon: BookOpenCheck,
      label: "Hafiz 30 Juz",
      value: `${profile.hafizCount}`,
      suffix: "+",
      desc: "Lulus dengan ujian tasmi' bil ghaib bersanad",
      cardBg: "bg-[#EDE9FE]",
      borderBg: "border-[#DDD6FE]",
      iconBg: "bg-[#7C3AED] text-white",
      textColor: "text-[#6D28D9]",
    },
    {
      icon: GraduationCap,
      label: "Tenaga Pendidik",
      value: `${profile.teacherCount}`,
      suffix: " Asatidz",
      desc: "Alumnus universitas ternama dalam & luar negeri",
      cardBg: "bg-[#DCFCE7]",
      borderBg: "border-[#BBF7D0]",
      iconBg: "bg-[#16A34A] text-white",
      textColor: "text-[#15803D]",
    },
  ];

  return (
    <section id="statistik" className="bg-[#FAF6EE] border-b border-[#E8E2D8] py-8 lg:py-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`${stat.cardBg} ${stat.borderBg} border-2 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    {stat.label}
                  </span>
                  <div className={`h-8 w-8 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-xs`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#1E2330] tracking-tight">
                      {stat.value}
                    </span>
                    <span className={`text-sm font-bold ${stat.textColor}`}>
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 font-medium leading-normal">
                    {stat.desc}
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
