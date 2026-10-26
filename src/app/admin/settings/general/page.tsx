"use client";

import React, { useEffect, useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Save, Check } from "lucide-react";

export default function AdminGeneralSettingsPage() {
  const { profile, updateProfile, updateBrandingColors, isLoading } =
    useSchoolData();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [primaryColor, setPrimaryColor] = useState(
    profile.branding?.primaryColor || "#0F2B48"
  );
  const [accentColor, setAccentColor] = useState(
    profile.branding?.accentColor || "#D97706"
  );

  // useState hanya membaca nilai awal — sinkronkan form saat profile
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setName(profile.name);
    setTagline(profile.tagline);
    setPrimaryColor(profile.branding?.primaryColor || "#0F2B48");
    setAccentColor(profile.branding?.accentColor || "#D97706");
  }, [profile]);

  const presetThemes = [
    {
      name: "Oxford Navy & Warm Orange (Default Yazzakka)",
      primary: "#0F2B48",
      accent: "#FA6400",
    },
    {
      name: "Emerald Islamic & Warm Amber",
      primary: "#064E3B",
      accent: "#D97706",
    },
    {
      name: "Deep Royal Sapphire & Crimson",
      primary: "#1E3A8A",
      accent: "#E11D48",
    },
    {
      name: "Forest Pine & Bronze",
      primary: "#14532D",
      accent: "#B45309",
    },
    {
      name: "Classic Charcoal & Teal",
      primary: "#1E293B",
      accent: "#0D9488",
    },
  ];

  // Pratinjau warna hanya menyentuh CSS var lokal; persist ke DB di-debounce
  // agar mengetik/menggeser color picker tidak membanjiri PUT /api/profile.
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const previewColors = (p: string, a: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--color-primary", p);
      document.documentElement.style.setProperty("--color-accent", a);
    }
  };

  const commitColors = (p: string, a: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateBrandingColors(p, a).catch(() =>
        toast("Gagal menyimpan warna tema. Coba lagi.", "error")
      );
    }, 500);
  };

  const handleColorChange = (which: "primary" | "accent", value: string) => {
    const p = which === "primary" ? value : primaryColor;
    const a = which === "accent" ? value : accentColor;
    if (which === "primary") setPrimaryColor(value);
    else setAccentColor(value);
    previewColors(p, a);
    commitColors(p, a);
  };

  const handleApplyColors = async (p: string, a: string) => {
    setPrimaryColor(p);
    setAccentColor(a);
    previewColors(p, a);
    try {
      await updateBrandingColors(p, a);
      toast("Warna tema live berhasil diterapkan ke seluruh website!", "success");
    } catch {
      toast("Gagal menyimpan warna tema. Coba lagi.", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        tagline,
        branding: {
          ...profile.branding,
          primaryColor,
          accentColor,
        },
      });
      toast("Pengaturan branding dan identitas umum berhasil disimpan!", "success");
    } catch {
      toast("Gagal menyimpan pengaturan branding. Coba lagi.", "error");
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
        <Card className="p-6 space-y-4">
          <Skeleton className="h-4 w-72" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </Card>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[0, 1].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-52" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-14 rounded-md" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border space-y-4">
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
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Website Settings / General &amp; Branding
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Pengaturan Umum &amp; Kustomisasi Warna Tema
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Ubah nama sekolah, tagline, dan warna tema branding institusi. Perubahan warna langsung diterapkan secara real-time pada portal publik tanpa mengubah kode program.
        </p>
      </div>

      {/* Preset Color Themes */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
          <Palette className="h-4 w-4 text-primary" />
          <span>Pilihan Palet Tema Warna Sekolah (Live Presets)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presetThemes.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyColors(preset.primary, preset.accent)}
              className="p-4 rounded-lg border border-border bg-muted flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-medium text-xs text-foreground block">
                  {preset.name}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="h-5 w-8 rounded-md border border-border"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="h-5 w-8 rounded-md border border-border"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
              </div>

              {primaryColor === preset.primary && accentColor === preset.accent && (
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Custom Color Form */}
      <form onSubmit={handleSave} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        <h3 className="text-base font-semibold text-foreground">
          Kustomisasi Nilai Hex Warna Manual
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-foreground block">
              Warna Primer (Header, Banner, Background Kunci)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="h-11 w-14 rounded-md border border-border p-1 cursor-pointer bg-card focus:outline-none focus:border-muted-foreground/40"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>

          {/* Accent Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-foreground block">
              Warna Aksen (Tombol CTA, Badge, Sorotan Utama)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => handleColorChange("accent", e.target.value)}
                className="h-11 w-14 rounded-md border border-border p-1 cursor-pointer bg-card focus:outline-none focus:border-muted-foreground/40"
              />
              <Input
                type="text"
                value={accentColor}
                onChange={(e) => handleColorChange("accent", e.target.value)}
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-4">
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
            Simpan Pengaturan Branding
          </Button>
        </div>
      </form>
    </div>
  );
}
