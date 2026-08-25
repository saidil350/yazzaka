"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  Layout,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function AdminHomepageSectionsPage() {
  const { sections, toggleSection, reorderSections } = useSchoolData();
  const { toast } = useToast();

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    reorderSections(updated);
    toast("Urutan seksi berhasil diperbarui!", "success");
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    reorderSections(updated);
    toast("Urutan seksi berhasil diperbarui!", "success");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Pages / Beranda
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Manajemen Tata Letak Beranda (Homepage)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Atur urutan (reorder) dan aktifkan/nonaktifkan seksi konten yang tampil pada halaman Beranda utama situs publik.
        </p>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden divide-y divide-[#E8E2D8]">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
              sec.isEnabled ? "bg-white hover:bg-[#FFF9F2]" : "bg-[#FAF6EE]/50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="h-8 w-8 rounded-xl bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                0{idx + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#1E2330]">
                    {sec.title}
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400">
                    ({sec.key})
                  </span>
                </div>
                <p className="text-xs text-stone-500">{sec.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle Enable */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={sec.isEnabled}
                  onCheckedChange={() => {
                    toggleSection(sec.id);
                    toast(
                      `Seksi "${sec.title}" ${
                        sec.isEnabled ? "dinonaktifkan" : "diaktifkan"
                      }!`,
                      "info"
                    );
                  }}
                  label={sec.isEnabled ? "Aktif" : "Nonaktif"}
                />
              </div>

              {/* Order Controls */}
              <div className="flex items-center gap-1 pl-3 border-l border-[#E8E2D8]">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveUp(idx)}
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-[#FAF6EE] hover:text-[#FA6400] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Pindah ke Atas"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === sections.length - 1}
                  onClick={() => handleMoveDown(idx)}
                  className="p-1.5 rounded-lg text-stone-500 hover:bg-[#FAF6EE] hover:text-[#FA6400] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Pindah ke Bawah"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
