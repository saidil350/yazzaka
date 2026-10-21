"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layers, Save } from "lucide-react";

export default function AdminProgramsPageSettings() {
  const { profile, settings, updateSettings } = useSchoolData();
  const { toast } = useToast();
  const [headerTitle, setHeaderTitle] = useState(
    `Program Pendidikan ${profile.name}`
  );
  const [headerSubtitle, setHeaderSubtitle] = useState(
    `Menaungi unit pendidikan formal, non-formal, tahfiz intensif Al-Qur'an, serta program strategis di ${profile.city}, ${profile.province}.`
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteTitle: settings.siteTitle,
      metaDescription: headerSubtitle,
    });
    toast("Pengaturan header halaman Program berhasil disimpan!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Pages / Program
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Pengaturan Halaman Program
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Kelola judul dan deskripsi header direktori program. Untuk menambah/mengedit data program spesifik, kunjungi menu <strong className="text-foreground">Content &gt; Program Pendidikan</strong>.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
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

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Link href="/admin/content/program">
              <Button type="button" variant="outline" size="sm">
                <Layers className="h-4 w-4" />
                <span>Kelola Daftar Program (CRUD)</span>
              </Button>
            </Link>

            <Button type="submit">
              <Save className="h-4 w-4" />
              Simpan Pengaturan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
