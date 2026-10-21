"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Website Settings / SEO Global
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Pengaturan Mesin Pencari (SEO) &amp; Metadata
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Optimalkan metadata judul, deskripsi pencarian Google, kata kunci (keywords), dan gambar OpenGraph untuk preview media sosial.
        </p>
      </div>

      {/* ── SEO Form Card ────────────────────────────── */}
      <form onSubmit={handleSave}>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-base text-foreground">Metadata Mesin Pencari</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Konfigurasi tag metadata yang terbaca oleh robot perayap Google, Bing, dan platform media sosial.
            </p>
          </div>

          <div className="space-y-4">
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
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit" variant="default">
              <Save className="h-4 w-4" aria-hidden="true" />
              Simpan Pengaturan SEO
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

