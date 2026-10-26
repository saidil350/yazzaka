"use client";

import React, { useEffect, useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Save } from "lucide-react";

export default function AdminSocialMediaSettingsPage() {
  const { settings, updateSettings, isLoading } = useSchoolData();
  const { toast } = useToast();

  const [instagram, setInstagram] = useState(settings.socialMedia.instagram);
  const [youtube, setYoutube] = useState(settings.socialMedia.youtube);
  const [facebook, setFacebook] = useState(settings.socialMedia.facebook);
  const [tiktok, setTiktok] = useState(settings.socialMedia.tiktok);
  const [linkedin, setLinkedin] = useState(settings.socialMedia.linkedin);

  // useState hanya membaca nilai awal — sinkronkan form saat settings
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setInstagram(settings.socialMedia.instagram);
    setYoutube(settings.socialMedia.youtube);
    setFacebook(settings.socialMedia.facebook);
    setTiktok(settings.socialMedia.tiktok);
    setLinkedin(settings.socialMedia.linkedin);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        socialMedia: {
          instagram,
          youtube,
          facebook,
          tiktok,
          linkedin,
        },
      });
      toast("Tautan media sosial berhasil disimpan!", "success");
    } catch {
      toast("Gagal menyimpan tautan media sosial. Coba lagi.", "error");
    }
  };

  // Form hanya dipasang setelah data awal tiba — mencegah edit nilai fallback
  // seed selama sinkronisasi DB berjalan (belt-and-braces dengan re-sync di atas).
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8" aria-busy="true">
        <div className="space-y-2">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-3 w-full max-w-lg" />
        </div>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-44" />
          <div className="space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <Skeleton className="h-9 w-40" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Website Settings / Social Media
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Tautan Akun Media Sosial Resmi
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Hubungkan akun Instagram, YouTube, TikTok, Facebook, dan LinkedIn sekolah ke tombol navigasi publik dan footer.
        </p>
      </div>

      {/* ── Social Form Card ─────────────────────────── */}
      <form onSubmit={handleSave}>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-base text-foreground">Akun Media Sosial</h3>
            <p className="text-xs text-muted-foreground mt-1">
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

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" variant="default">
              <Save className="h-4 w-4" aria-hidden="true" />
              Simpan Media Sosial
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

