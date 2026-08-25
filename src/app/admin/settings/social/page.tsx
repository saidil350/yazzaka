"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Website Settings / Social Media
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Tautan Akun Media Sosial Resmi
        </h1>
        <p className="text-sm text-muted-foreground">
          Hubungkan akun Instagram, YouTube, TikTok, Facebook, dan LinkedIn sekolah ke tombol navigasi publik dan footer.
        </p>
      </div>

      {/* ── Social Form Card (Shadcn UI Standard) ─────────────────── */}
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Akun Media Sosial</CardTitle>
            <CardDescription>
              Tautan ini akan diarahkan secara otomatis ketika pengunjung mengklik ikon media sosial di landing page.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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
          </CardContent>

          <CardFooter className="flex justify-end border-t px-6 py-4 bg-muted/20">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Simpan Media Sosial
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

