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
      desc: `Berdiri ${profile.establishedYear}, berkiprah mencetak kader pemimpin`,
    },
    {
      icon: Users,
      label: "Santri Aktif",
      value: `${profile.studentCount}`,
      suffix: "+",
      desc: "Santri berprestasi dari seluruh Indonesia",
    },
    {
      icon: BookOpenCheck,
      label: "Hafiz 30 Juz",
      value: `${profile.hafizCount}`,
      suffix: "+",
      desc: "Lulus dengan ujian tasmi' bil ghaib bersanad",
    },
    {
      icon: GraduationCap,
      label: "Tenaga Pendidik",
      value: `${profile.teacherCount}`,
      suffix: " Asatidz",
      desc: "Alumnus universitas ternama dalam & luar negeri",
    },
  ];

  return (
    <section id="statistik" className="border-b border-border py-8 lg:py-10 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col"
              >
                <span className="text-xs font-semibold text-muted-foreground">
                  {stat.label}
                </span>
                <div className="flex items-center gap-2.5 mt-3">
                  <Icon className="h-4 w-4 text-yazzaka-teal-dark shrink-0" strokeWidth={1.8} aria-hidden="true" />
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-sm font-bold text-yazzaka-teal-dark">
                      {stat.suffix}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-normal">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
