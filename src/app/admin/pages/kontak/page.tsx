"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Save } from "lucide-react";

export default function AdminContactPageSettings() {
  const { profile, updateProfile } = useSchoolData();
  const { toast } = useToast();

  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [province, setProvince] = useState(profile.province);
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(profile.mapsEmbedUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      address,
      city,
      province,
      mapsEmbedUrl,
    });
    toast("Pengaturan halaman Kontak dan Lokasi berhasil disimpan!", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Pages / Kontak
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Pengaturan Halaman Kontak &amp; Lokasi
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Kelola alamat fisik kampus dan sematan peta Google Maps pada halaman kontak publik.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
        <Input
          label="Alamat Jalan Lengkap"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Kota / Kabupaten"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            label="Provinsi & Kode Pos"
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>

        <Textarea
          label="Google Maps Embed URL (Iframe Source)"
          rows={3}
          value={mapsEmbedUrl}
          onChange={(e) => setMapsEmbedUrl(e.target.value)}
          helperText="Dapatkan URL ini dari menu Share > Embed a map di Google Maps."
        />

        <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D8]">
          <Link href="/admin/settings/pesan">
            <Button type="button" variant="outline" size="sm" className="rounded-full font-bold">
              <MessageSquare className="h-4 w-4" />
              <span>Lihat Pesan Masuk</span>
            </Button>
          </Link>

          <Button type="submit" variant="default" size="default" className="font-bold h-11 px-6 shadow-sm">
            <Save className="h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </div>
      </form>
    </div>
  );
}
