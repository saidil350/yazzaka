"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Save, Plus, Trash2, Image as ImageIcon, Type } from "lucide-react";
import { DEFAULT_HERO } from "@/lib/data/initialData";

export default function AdminHeroPage() {
  const { profile, updateProfile } = useSchoolData();
  const { toast } = useToast();

  // hero di DB bersifat parsial (JSONB default '{}') — gabungkan dengan default
  // agar form selalu punya nilai penuh sebelum disimpan pertama kali.
  const hero = { ...DEFAULT_HERO, ...profile.hero };

  const [eyebrow, setEyebrow] = useState(hero.eyebrow);
  const [headline, setHeadline] = useState(hero.headline);
  const [body, setBody] = useState(hero.body);
  const [imageUrl, setImageUrl] = useState(hero.imageUrl);
  const [badges, setBadges] = useState<string[]>(hero.badges);
  const [newBadge, setNewBadge] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // useState hanya membaca nilai awal — sinkronkan form saat profile
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  // Snapshot terakhir dipakai untuk mendeteksi draft yang belum disimpan:
  // perubahan profile (mis. setelah simpan badge) tidak boleh menimpa
  // teks lain yang sedang diedit.
  const lastSyncedRef = useRef<string>("");
  useEffect(() => {
    const current = { ...DEFAULT_HERO, ...profile.hero };
    const snapshot = JSON.stringify(current);
    if (snapshot === lastSyncedRef.current) return;
    const formNow = JSON.stringify({ eyebrow, headline, body, imageUrl, badges });
    const isPristine = !lastSyncedRef.current || formNow === lastSyncedRef.current;
    lastSyncedRef.current = snapshot;
    if (!isPristine) return;
    setEyebrow(current.eyebrow);
    setHeadline(current.headline);
    setBody(current.body);
    setImageUrl(current.imageUrl);
    setBadges(current.badges);
  }, [profile, eyebrow, headline, body, imageUrl, badges]);

  const buildHero = (badgeList: string[]) => ({
    eyebrow,
    headline,
    body,
    imageUrl,
    badges: badgeList,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ hero: buildHero(badges) });
      toast("Konten hero beranda berhasil disimpan!", "success");
    } catch {
      toast("Gagal menyimpan konten hero.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = newBadge.trim();
    if (!value) return;
    const updated = [...badges, value];
    setBadges(updated);
    setNewBadge("");
    try {
      await updateProfile({ hero: buildHero(updated) });
      toast("Badge keunggulan ditambahkan.", "success");
    } catch {
      toast("Gagal menambahkan badge.", "error");
    }
  };

  const handleDeleteBadge = async (index: number) => {
    const updated = badges.filter((_, i) => i !== index);
    setBadges(updated);
    try {
      await updateProfile({ hero: buildHero(updated) });
      toast("Badge dihapus.", "info");
    } catch {
      toast("Gagal menghapus badge.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Konten Landing Page / Hero Beranda
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Hero Beranda
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Kelola teks pembuka, gambar utama, dan badge keunggulan pada seksi paling atas halaman depan website.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Teks Hero */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-foreground">
            <Type className="h-4 w-4 text-primary" />
            <span>Teks Hero</span>
          </div>

          <Input
            label="Teks Eyebrow (Badge kecil di atas judul)"
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            placeholder="Contoh: Pendidikan Islam Holistik & Berwawasan Global"
          />

          <Input
            label="Judul Utama (Headline)"
            required
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Contoh: Belajar Lebih Tenang, Tumbuh Berkarakter Qur'ani."
          />

          <Textarea
            label="Paragraf Pengantar"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            helperText="Teks pengantar di bawah judul. Sebutkan keunggulan utama lembaga secara ringkas."
          />
        </Card>

        {/* Gambar Hero */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-foreground">
            <ImageIcon className="h-4 w-4 text-primary" />
            <span>Gambar Utama Hero</span>
          </div>

          <ImageUpload
            label="Foto / Ilustrasi Hero"
            value={imageUrl}
            onChange={(val) => setImageUrl(val)}
            placeholder="https://contoh.com/gambar.jpg"
            helperText="Unggah gambar (drag & drop) atau tautkan URL. Rasio disarankan 4:3 hingga 16:11."
          />
        </Card>

        {/* Badge Keunggulan */}
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-base text-foreground">Badge Keunggulan Cepat</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Daftar pill dengan ikon centang di bagian bawah hero. Perubahan daftar ini langsung tersimpan ke database.
            </p>
          </div>

          <div className="space-y-3">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted border border-border text-xs sm:text-sm text-foreground font-medium"
              >
                <span className="leading-relaxed">{badge}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteBadge(idx)}
                  className="text-destructive hover:text-destructive"
                  title="Hapus Badge"
                  aria-label={`Hapus badge ${badge}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex gap-3">
            <Input
              type="text"
              placeholder="Tambahkan badge keunggulan baru..."
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={handleAddBadge} className="shrink-0">
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4" />
            {isSaving ? "Menyimpan..." : "Simpan Hero Beranda"}
          </Button>
        </div>
      </form>
    </div>
  );
}
