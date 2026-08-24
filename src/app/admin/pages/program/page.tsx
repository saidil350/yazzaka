"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layers, ArrowRight, Save } from "lucide-react";

export default function AdminProgramsPageSettings() {
  const { toast } = useToast();
  const [headerTitle, setHeaderTitle] = useState("Program Pendidikan Yazzaka");
  const [headerSubtitle, setHeaderSubtitle] = useState(
    "Memadukan kurikulum sains mutakhir, tahfiz Al-Qur'an 30 juz bersanad, lingkungan bilingual aktif, dan pembinaan karakter kepemimpinan."
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Pengaturan header halaman Program berhasil disimpan!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
          Pages / Program
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
          Pengaturan Halaman Program
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola judul dan deskripsi header direktori program. Untuk menambah/mengedit data program spesifik, kunjungi menu <strong>Content &gt; Program Pendidikan</strong>.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <Input
          label="Judul Header Halaman Program"
          type="text"
          value={headerTitle}
          onChange={(e) => setHeaderTitle(e.target.value)}
        />

        <Textarea
          label="Deskripsi Subtitle Header"
          rows={3}
          value={headerSubtitle}
          onChange={(e) => setHeaderSubtitle(e.target.value)}
        />

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Link href="/admin/content/program">
            <Button type="button" variant="outline" size="sm">
              <Layers className="h-4 w-4" />
              <span>Kelola Daftar Program (CRUD)</span>
            </Button>
          </Link>

          <Button type="submit" variant="accent" size="default">
            <Save className="h-4 w-4" />
            Simpan Header
          </Button>
        </div>
      </form>
    </div>
  );
}
