"use client";

import React, { useEffect, useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from "lucide-react";

export default function AdminGeneralSettingsPage() {
  const { profile, updateProfile, isLoading } = useSchoolData();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);

  // useState hanya membaca nilai awal — sinkronkan form saat profile
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setName(profile.name);
    setTagline(profile.tagline);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, tagline });
      toast("Pengaturan umum berhasil disimpan!", "success");
    } catch {
      toast("Gagal menyimpan pengaturan umum. Coba lagi.", "error");
    }
  };

  // Form hanya dipasang setelah data awal tiba — mencegah edit nilai fallback
  // seed selama sinkronisasi DB berjalan (belt-and-braces dengan re-sync di atas).
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8" aria-busy="true">
        <div className="space-y-2">
          <Skeleton className="h-3 w-52" />
          <Skeleton className="h-8 w-88" />
          <Skeleton className="h-3 w-full max-w-lg" />
        </div>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-medium text-muted-foreground block mb-1">
          Website Settings / General
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Pengaturan Umum
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Ubah nama sekolah dan tagline yang tampil di seluruh website.
        </p>
      </div>

      <form onSubmit={handleSave} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        <h3 className="text-base font-semibold text-foreground">
          Identitas Institusi
        </h3>

        <div className="space-y-4">
          <Input
            label="Nama Sekolah / Institusi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Tagline / Motto Institusi"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" variant="default" size="default">
            <Save className="h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
