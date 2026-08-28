"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Save, Check, Sparkles, RefreshCw } from "lucide-react";

export default function AdminGeneralSettingsPage() {
  const { profile, updateProfile, updateBrandingColors } = useSchoolData();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [primaryColor, setPrimaryColor] = useState(
    profile.branding?.primaryColor || "#0F2B48"
  );
  const [accentColor, setAccentColor] = useState(
    profile.branding?.accentColor || "#D97706"
  );

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

  const handleApplyColors = (p: string, a: string) => {
    setPrimaryColor(p);
    setAccentColor(a);
    updateBrandingColors(p, a);
    toast("Warna tema live berhasil diterapkan ke seluruh website!", "success");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      tagline,
      branding: {
        ...profile.branding,
        primaryColor,
        accentColor,
      },
    });
    updateBrandingColors(primaryColor, accentColor);
    toast("Pengaturan branding dan identitas umum berhasil disimpan!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Website Settings / General &amp; Branding
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Pengaturan Umum &amp; Kustomisasi Warna Tema
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Ubah nama sekolah, tagline, dan warna tema branding institusi. Perubahan warna langsung diterapkan secara real-time pada portal publik tanpa mengubah kode program.
        </p>
      </div>

      {/* Preset Color Themes */}
      <div className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-[#FA6400] font-extrabold text-sm uppercase tracking-wide">
          <Palette className="h-4 w-4" />
          <span>Pilihan Palet Tema Warna Sekolah (Live Presets)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presetThemes.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyColors(preset.primary, preset.accent)}
              className="p-4 rounded-lg border border-[#E8E2D8] hover:border-[#FA6400] bg-[#FAF6EE] flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div>
                <span className="font-bold text-xs text-[#1E2330] block">
                  {preset.name}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="h-5 w-8 rounded-lg border border-white/60 shadow-2xs"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="h-5 w-8 rounded-lg border border-white/60 shadow-2xs"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
              </div>

              {primaryColor === preset.primary && accentColor === preset.accent && (
                <span className="h-6 w-6 rounded-full bg-[#FA6400] text-white flex items-center justify-center shadow-xs">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#1E2330]">
          Kustomisasi Nilai Hex Warna Manual
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1E2330] block">
              Warna Primer (Header, Banner, Background Kunci)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  updateBrandingColors(e.target.value, accentColor);
                }}
                className="h-11 w-14 rounded-xl border border-[#E8E2D8] p-1 cursor-pointer bg-white"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  updateBrandingColors(e.target.value, accentColor);
                }}
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>

          {/* Accent Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1E2330] block">
              Warna Aksen (Tombol CTA, Badge, Sorotan Utama)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => {
                  setAccentColor(e.target.value);
                  updateBrandingColors(primaryColor, e.target.value);
                }}
                className="h-11 w-14 rounded-xl border border-[#E8E2D8] p-1 cursor-pointer bg-white"
              />
              <Input
                type="text"
                value={accentColor}
                onChange={(e) => {
                  setAccentColor(e.target.value);
                  updateBrandingColors(primaryColor, e.target.value);
                }}
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8E2D8] space-y-4">
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

        <div className="flex justify-end pt-4 border-t border-[#E8E2D8]">
          <Button type="submit" variant="default" size="default" className="font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
            <Save className="h-4 w-4" />
            Simpan Pengaturan Branding
          </Button>
        </div>
      </form>
    </div>
  );
}
