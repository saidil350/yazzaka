"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function AdminSocialMediaSettingsPage() {
  const { settings, updateSettings } = useSchoolData();
  const { toast } = useToast();

  const [instagram, setInstagram] = useState(settings.socialMedia.instagram);
  const [youtube, setYoutube] = useState(settings.socialMedia.youtube);
  const [facebook, setFacebook] = useState(settings.socialMedia.facebook);
  const [tiktok, setTiktok] = useState(settings.socialMedia.tiktok);
  const [linkedin, setLinkedin] = useState(settings.socialMedia.linkedin);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      socialMedia: {
        instagram,
        youtube,
        facebook,
        tiktok,
        linkedin,
      },
    });
    toast("Tautan media sosial berhasil disimpan!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Website Settings / Social Media
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Tautan Akun Media Sosial Resmi
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Hubungkan akun Instagram, YouTube, TikTok, Facebook, dan LinkedIn sekolah ke tombol navigasi publik dan footer.
        </p>
      </div>

      {/* ── Social Form Card ─────────────────────────── */}
      <form onSubmit={handleSave}>
        <div className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-[#1E2330]">Akun Media Sosial</h3>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Tautan ini akan diarahkan secara otomatis ketika pengunjung mengklik ikon media sosial di landing page.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Akun Instagram"
              placeholder="https://instagram.com/yazzakka.official"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />

            <Input
              label="Kanal YouTube"
              placeholder="https://youtube.com/@yazzakkaofficial"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
            />

            <Input
              label="Halaman Facebook"
              placeholder="https://facebook.com/yazzakka.official"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />

            <Input
              label="Akun TikTok"
              placeholder="https://tiktok.com/@yazzakka.official"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
            />

            <Input
              label="Halaman LinkedIn"
              placeholder="https://linkedin.com/company/..."
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E8E2D8]">
            <Button type="submit" variant="default" className="font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
              <Save className="h-4 w-4" aria-hidden="true" />
              Simpan Media Sosial
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

