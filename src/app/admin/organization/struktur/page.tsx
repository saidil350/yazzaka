"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Building2, Users, ChevronRight } from "lucide-react";

export default function AdminOrgStructurePage() {
  const { profile, organization } = useSchoolData();

  const yayasan = organization.filter((o) => o.department === "Pimpinan Yayasan & Sekolah");
  const pendidik = organization.filter((o) => o.department === "Tenaga Pendidik (Guru)");
  const asrama = organization.filter((o) => o.department === "Kepengasuhan Asrama");

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Organization / Struktur Organisasi
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Struktur Kepengurusan &amp; Hierarki Organisasi
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Bagan struktur pimpinan yayasan, dewan asatidz pengasuh, dan tenaga pendidik {profile.name}.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xs space-y-8">
        
        {/* Tier 1: Pimpinan Yayasan */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E2330] text-white text-xs font-bold uppercase tracking-wider shadow-xs">
            <Building2 className="h-3.5 w-3.5 text-[#FA6400]" />
            <span>Pimpinan Yayasan &amp; Lembaga</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {yayasan.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photoUrl}
                  alt={m.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-[#E8E2D8] shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#1E2330]">{m.name}</h4>
                  <p className="text-xs text-[#FA6400] font-bold">{m.roleTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Pengasuhan & Akademik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E8E2D8]">
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-stone-500 uppercase tracking-wider">
              Direktorat Pengasuhan &amp; Bahasa
            </h4>
            <div className="space-y-2">
              {asrama.map((m) => (
                <div key={m.id} className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photoUrl} alt={m.name} className="h-10 w-10 rounded-full object-cover border border-[#E8E2D8]" />
                  <div>
                    <h5 className="font-bold text-xs text-[#1E2330]">{m.name}</h5>
                    <p className="text-[11px] text-stone-500 font-medium">{m.roleTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs text-stone-500 uppercase tracking-wider">
              Koordinator Akademik &amp; Riset
            </h4>
            <div className="space-y-2">
              {pendidik.map((m) => (
                <div key={m.id} className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photoUrl} alt={m.name} className="h-10 w-10 rounded-full object-cover border border-[#E8E2D8]" />
                  <div>
                    <h5 className="font-bold text-xs text-[#1E2330]">{m.name}</h5>
                    <p className="text-[11px] text-stone-500 font-medium">{m.roleTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
