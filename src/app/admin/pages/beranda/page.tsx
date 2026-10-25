"use client";

import React from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function AdminHomepageSectionsPage() {
  const { sections, toggleSection, reorderSections } = useSchoolData();
  const { toast } = useToast();

  // Key yang komponen publiknya tidak pernah dirender di beranda —
  // disembunyikan dari UI agar admin tidak mengelola toggle tanpa efek.
  // 'organization' hanya dipakai /tentang-kami (title/subtitle, tanpa
  // isEnabled), jadi togglenya di beranda tidak berefek di mana pun.
  const UNRENDERED_SECTION_KEYS = ["news", "admission_cta", "organization"];
  // Seksi dengan posisi tetap (bukan bagian urutan konten beranda) —
  // toggle-nya efektif, tapi tombol urut disembunyikan.
  const FIXED_POSITION_KEYS = ["topbar"];
  const isFixedPosition = (key: string) => FIXED_POSITION_KEYS.includes(key);
  const visibleSections = sections.filter(
    (s) => !UNRENDERED_SECTION_KEYS.includes(s.key)
  );

  const handleMoveUp = async (index: number) => {
    if (index === 0 || isFixedPosition(visibleSections[index - 1].key)) return;
    const updated = [...visibleSections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    try {
      await reorderSections(updated);
      toast("Urutan seksi berhasil diperbarui!", "success");
    } catch {
      toast("Gagal memperbarui urutan seksi.", "error");
    }
  };

  const handleMoveDown = async (index: number) => {
    if (
      index === visibleSections.length - 1 ||
      isFixedPosition(visibleSections[index + 1].key)
    )
      return;
    const updated = [...visibleSections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    try {
      await reorderSections(updated);
      toast("Urutan seksi berhasil diperbarui!", "success");
    } catch {
      toast("Gagal memperbarhi urutan seksi.", "error");
    }
  };

  const handleToggle = async (sec: (typeof visibleSections)[number]) => {
    try {
      await toggleSection(sec.id);
      toast(
        `Seksi "${sec.title}" ${sec.isEnabled ? "dinonaktifkan" : "diaktifkan"}!`,
        "info"
      );
    } catch {
      toast(`Gagal mengubah status seksi "${sec.title}".`, "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Pages / Beranda
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Manajemen Tata Letak Beranda (Homepage)
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Atur urutan (reorder) dan aktifkan/nonaktifkan seksi konten yang tampil pada halaman Beranda utama situs publik.
        </p>
      </div>

      {/* Sections List */}
      <Card className="overflow-hidden divide-y divide-border">
        {visibleSections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors ${
              sec.isEnabled ? "hover:bg-muted" : "bg-muted/50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="h-8 w-8 rounded-md bg-primary/10 text-primary border border-primary/20 font-medium text-xs flex items-center justify-center shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-foreground">
                    {sec.title}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ({sec.key})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{sec.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle Enable */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {sec.isEnabled ? "Aktif" : "Nonaktif"}
                </span>
                <Switch
                  checked={sec.isEnabled}
                  onCheckedChange={() => handleToggle(sec)}
                  aria-label={`Aktifkan atau nonaktifkan seksi ${sec.title}`}
                />
              </div>

              {/* Order Controls — disembunyikan untuk seksi berposisi tetap */}
              {isFixedPosition(sec.key) ? (
                <span className="text-xs text-muted-foreground pl-3 border-l border-border">
                  Posisi tetap
                </span>
              ) : (
              <div className="flex items-center gap-1 pl-3 border-l border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={idx === 0 || isFixedPosition(visibleSections[idx - 1].key)}
                  onClick={() => handleMoveUp(idx)}
                  className="text-muted-foreground hover:text-primary"
                  title="Pindah ke Atas"
                  aria-label="Pindah ke Atas"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={idx === visibleSections.length - 1}
                  onClick={() => handleMoveDown(idx)}
                  className="text-muted-foreground hover:text-primary"
                  title="Pindah ke Bawah"
                  aria-label="Pindah ke Bawah"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
