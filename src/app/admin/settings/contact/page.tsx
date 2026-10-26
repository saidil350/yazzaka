"use client";

import React, { useEffect, useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Phone,
  Save,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";

export default function AdminContactSettingsPage() {
  const { profile, updateProfile, isLoading } = useSchoolData();
  const { toast } = useToast();

  const [phone, setPhone] = useState(profile.phone);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [province, setProvince] = useState(profile.province);
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(profile.mapsEmbedUrl);
  const [isSaving, setIsSaving] = useState(false);

  // useState hanya membaca nilai awal — sinkronkan form saat profile
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setPhone(profile.phone);
    setWhatsapp(profile.whatsapp);
    setEmail(profile.email);
    setAddress(profile.address);
    setCity(profile.city);
    setProvince(profile.province);
    setMapsEmbedUrl(profile.mapsEmbedUrl);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ phone, whatsapp, email, address, city, province, mapsEmbedUrl });
      toast("Informasi kontak berhasil disimpan.", "success");
    } catch {
      toast("Gagal menyimpan informasi kontak. Coba lagi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const cleanWaNumber = whatsapp.replace(/\D/g, "");

  // Form hanya dipasang setelah data awal tiba — mencegah edit nilai fallback
  // seed selama sinkronisasi DB berjalan (belt-and-braces dengan re-sync di atas).
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8" aria-busy="true">
        <div className="space-y-2">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-3 w-full max-w-lg" />
        </div>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-56" />
          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-9" />
              </div>
            ))}
          </div>
          <div className="space-y-5 border-t border-border pt-6">
            <Skeleton className="h-5 w-40" />
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-44" />
              <Skeleton className="h-9" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
            <Skeleton className="h-24" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Page Header ─────────────────────────────── */}
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Website Settings / Kontak Resmi
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Informasi Kontak Lembaga
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Kelola nomor hotline, WhatsApp admisi, email resmi, alamat fisik, dan
          sematan peta Google Maps sekolah.
        </p>
      </div>

      {/* ── Form ────────────────────────────────────── */}
      <form onSubmit={handleSave}>
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-base text-foreground">Saluran Komunikasi Publik</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Pastikan nomor dan email yang dimasukkan aktif dan dapat dihubungi oleh calon santri atau wali santri.
            </p>
          </div>

          <div className="space-y-5">
            {/* Hotline */}
            <div className="space-y-1.5">
              <label htmlFor="input-phone" className="text-xs font-medium uppercase tracking-wider text-foreground flex items-center gap-2 block">
                <Phone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Nomor Telepon Kantor
              </label>
              <Input
                id="input-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(0285) 123456"
              />
              <p className="text-xs text-muted-foreground">
                Ditampilkan di header dan footer situs publik.
              </p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="input-whatsapp" className="text-xs font-medium uppercase tracking-wider text-foreground flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  WhatsApp Admisi SPMB
                </label>
                {cleanWaNumber && (
                  <a
                    href={`https://wa.me/${cleanWaNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Uji link
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
              <Input
                id="input-whatsapp"
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="6281234567890"
              />
              <p className="text-xs text-muted-foreground">
                Format internasional tanpa + atau spasi, contoh: 628123456789
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="input-email" className="text-xs font-medium uppercase tracking-wider text-foreground flex items-center gap-2 block">
                <Mail className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Alamat Email Resmi
              </label>
              <Input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sekretariat@yazzakka.sch.id"
              />
              <p className="text-xs text-muted-foreground">
                Email utama yang menerima salinan notifikasi pesan masuk.
              </p>
            </div>
          </div>

          <div className="space-y-5 border-t border-border pt-6">
            <div>
              <h3 className="font-semibold text-base text-foreground">Alamat &amp; Lokasi</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Ditampilkan pada halaman kontak publik beserta sematan peta.
              </p>
            </div>

            <Input
              id="input-address"
              label="Alamat Jalan Lengkap"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="input-city"
                label="Kota / Kabupaten"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                id="input-province"
                label="Provinsi & Kode Pos"
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </div>

            <Textarea
              id="input-maps"
              label="Google Maps Embed URL (Iframe Source)"
              rows={3}
              value={mapsEmbedUrl}
              onChange={(e) => setMapsEmbedUrl(e.target.value)}
              helperText="Dapatkan URL ini dari menu Share > Embed a map di Google Maps."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={isSaving}
              variant="default"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Simpan Kontak
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
