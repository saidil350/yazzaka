"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save } from "lucide-react";

export default function AdminSEOSettingsPage() {
  const { settings, updateSettings } = useSchoolData();
  const { toast } = useToast();

  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription);
  const [keywords, setKeywords] = useState(settings.keywords);
  const [ogImage, setOgImage] = useState(settings.ogImage);
  const [googleVerification, setGoogleVerification] = useState(
    settings.googleVerification || ""
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteTitle,
      metaDescription,
      keywords,
      ogImage,
      googleVerification,
    });
    toast("Pengaturan SEO global berhasil diperbarui!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Website Settings / SEO Global
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Pengaturan Mesin Pencari (SEO) & Metadata
        </h1>
        <p className="text-sm text-muted-foreground">
          Optimalkan metadata judul, deskripsi pencarian Google, kata kunci (keywords), dan gambar OpenGraph untuk preview media sosial.
        </p>
      </div>

      {/* ── SEO Form Card (Shadcn UI Standard) ────────────────────── */}
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Metadata Mesin Pencari</CardTitle>
            <CardDescription>
              Konfigurasi tag metadata yang terbaca oleh robot perayap Google, Bing, dan platform media sosial.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              label="Judul Situs (Default Meta Title)"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
            />

            <Textarea
              label="Deskripsi Situs (Meta Description Google)"
              rows={3}
              required
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              helperText="Disarankan antara 120-160 karakter agar tampil sempurna pada hasil pencarian Google."
            />

            <Input
              label="Kata Kunci Utama (Keywords - Pisahkan dengan koma)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />

            <Input
              label="URL Gambar OpenGraph (Social Share Image)"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
            />

            <Input
              label="Kode Verifikasi Google Search Console (Opsional)"
              placeholder="google-site-verification=..."
              value={googleVerification}
              onChange={(e) => setGoogleVerification(e.target.value)}
            />
          </CardContent>

          <CardFooter className="flex justify-end border-t px-6 py-4 bg-muted/20">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Simpan Pengaturan SEO
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

