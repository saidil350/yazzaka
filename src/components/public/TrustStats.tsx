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
      iconBg: "text-yazzaka-teal-dark",
      textColor: "text-yazzaka-teal-dark",
    },
    {
      icon: Users,
      label: "Santri Aktif",
      value: `${profile.studentCount}`,
      suffix: "+",
      desc: "Santri berprestasi dari seluruh Indonesia",
      iconBg: "text-yazzaka-teal-dark",
      textColor: "text-yazzaka-teal-dark",
    },
    {
      icon: BookOpenCheck,
      label: "Hafiz 30 Juz",
      value: `${profile.hafizCount}`,
      suffix: "+",
      desc: "Lulus dengan ujian tasmi' bil ghaib bersanad",
      iconBg: "text-yazzaka-teal-dark",
      textColor: "text-yazzaka-teal-dark",
    },
    {
      icon: GraduationCap,
      label: "Tenaga Pendidik",
      value: `${profile.teacherCount}`,
      suffix: " Asatidz",
      desc: "Alumnus universitas ternama dalam & luar negeri",
      iconBg: "text-yazzaka-teal-dark",
      textColor: "text-yazzaka-teal-dark",
    },
  ];

  return (
    <section id="statistik" className="bg-yazzaka-teal-soft border-b border-yazzaka-teal-border py-8 lg:py-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-yazzaka-teal-border rounded-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:border-yazzaka-teal hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    {stat.label}
                  </span>
                  <div className={`h-8 w-8 border-l-2 border-yazzaka-teal ${stat.iconBg} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
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
