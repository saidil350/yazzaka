"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Building2, GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminOrgStructurePage() {
  const { profile, organization } = useSchoolData();

  // Dapatkan daftar seluruh unit/departemen unik yang ada
  const departments = Array.from(
    new Set(organization.map((o) => o.department).filter(Boolean))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Organization / Struktur Organisasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Struktur Kepengurusan &amp; Hierarki Organisasi
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Bagan struktur pimpinan dan dewan pengajar per unit pendidikan di lingkungan {profile.name}.
          </p>
        </div>

        <Link href="/admin/organization/tim">
          <Button
            variant="default"
            size="sm"
            className="font-bold bg-[#FA6400] hover:bg-[#E05A00] text-white cursor-pointer"
          >
            <GraduationCap className="h-4 w-4 mr-1.5" />
            <span>Kelola Daftar Pengajar</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {departments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] text-center space-y-2">
            <p className="font-bold text-sm text-[#1E2330]">Belum ada data pengajar per unit.</p>
            <p className="text-xs text-stone-500">Silakan tambahkan data pimpinan dan pengajar melalui menu Tim &amp; Asatidz.</p>
          </div>
        ) : (
          departments.map((dept, idx) => {
            const members = organization.filter((o) => o.department === dept);
            return (
              <div
                key={dept}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-5"
              >
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E8E2D8]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E2330] text-white text-xs font-bold uppercase tracking-wider shadow-2xs">
                    <Building2 className="h-3.5 w-3.5 text-[#FA6400]" />
                    <span>{dept}</span>
                  </div>
                  <span className="text-xs text-stone-500 font-bold bg-[#FAF6EE] px-3 py-1 rounded-full border border-[#E8E2D8]">
                    {members.length} Anggota / Pendidik
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] flex items-center gap-3.5 hover:border-[#FA6400]/40 transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.photoUrl}
                        alt={m.name}
                        className="h-12 w-12 rounded-xl object-cover border-2 border-[#E8E2D8] shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#1E2330] truncate">{m.name}</h4>
                        <p className="text-xs text-[#FA6400] font-bold truncate">{m.roleTitle}</p>
                        {m.qualifications && (
                          <p className="text-[10px] text-stone-400 italic truncate">{m.qualifications}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
