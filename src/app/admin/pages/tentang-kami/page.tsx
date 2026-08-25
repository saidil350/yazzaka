"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Sparkles } from "lucide-react";

export default function AdminAboutPageContent() {
  const { profile, updateProfile } = useSchoolData();
  const { toast } = useToast();

  const [vision, setVision] = useState(profile.vision);
  const [description, setDescription] = useState(profile.description);
  const [welcomeMessage, setWelcomeMessage] = useState(profile.principal.welcomeMessage);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      vision,
      description,
      principal: {
        ...profile.principal,
        welcomeMessage,
      },
    });
    toast("Konten halaman Tentang Kami berhasil disimpan!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Pages / Tentang Kami
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Pengaturan Halaman Tentang Kami
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Kelola narasi pengenalan sejarah, visi pendidikan, dan pesan sambutan pimpinan sekolah.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
        <Textarea
          label="Deskripsi Ringkas Institusi (Meta & Intro)"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Textarea
          label="Pernyataan Visi Sekolah"
          rows={3}
          value={vision}
          onChange={(e) => setVision(e.target.value)}
        />

        <Textarea
          label="Pesan Sambutan Pimpinan / Kepala Sekolah"
          rows={6}
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
        />

        <div className="pt-4 border-t border-[#E8E2D8] flex justify-end">
          <Button type="submit" variant="default" size="default" className="font-bold h-11 px-6 shadow-sm">
            <Save className="h-4 w-4" />
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
