"use client";

import React, { useEffect, useState } from "react";
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
  const [ogImage, setOgImage] = useState(settings.ogImage);
  const [googleVerification, setGoogleVerification] = useState(
    settings.googleVerification || ""
  );

  // useState hanya membaca nilai awal — sinkronkan form saat settings
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setSiteTitle(settings.siteTitle);
    setMetaDescription(settings.metaDescription);
    setOgImage(settings.ogImage);
    setGoogleVerification(settings.googleVerification || "");
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        siteTitle,
        metaDescription,
        ogImage,
        googleVerification,
      });
      toast("Pengaturan SEO global berhasil diperbarui!", "success");
    } catch {
      toast("Gagal menyimpan pengaturan SEO. Coba lagi.", "error");
    }
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
          Atur judul, deskripsi, dan gambar preview situs yang terbaca Google serta
          media sosial. Perubahan berlaku untuk seluruh halaman situs publik.
        </p>
      </div>

      {/* ── SEO Form Card ────────────────────────────── */}
      <form onSubmit={handleSave}>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-base text-foreground">Metadata Situs</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Nilai di bawah dipasang otomatis sebagai tag &lt;meta&gt; di semua
              halaman situs publik.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Judul Situs (Meta Title)"
              required
              placeholder="Contoh: Yayasan Yazzakka Aceh — Lembaga Pendidikan Islam Unggul"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              helperText="Tampil di tab browser dan sebagai judul hasil pencarian Google. Idealnya 50–60 karakter agar tidak terpotong."
            />

            <Textarea
              label="Deskripsi Situs (Meta Description)"
              rows={3}
              required
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              helperText={`${metaDescription.length}/160 karakter — ideal 120–160 agar tampil penuh di hasil pencarian Google.`}
            />

            <Input
              label="Gambar Preview Berbagi (OpenGraph)"
              placeholder="https://contoh.com/gambar-preview.jpg"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              helperText="Tampil saat tautan situs dibagikan ke WhatsApp, Facebook, atau X. Ukuran ideal 1200×630 piksel."
            />

            <Input
              label="Kode Verifikasi Google Search Console (Opsional)"
              placeholder="Contoh: google6c8d1f2a3b4e5f6..."
              value={googleVerification}
              onChange={(e) => setGoogleVerification(e.target.value)}
              helperText="Tempel kode verifikasi dari Google Search Console — boleh token saja atau tag <meta> utuh, dipisah otomatis. Kosongkan bila belum ada."
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

