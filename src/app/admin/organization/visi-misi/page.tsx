"use client";

import React, { useEffect, useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { Save, Plus, Trash2, Compass, Target, Sparkles, Edit2 } from "lucide-react";

export default function AdminVisionMissionPage() {
  const { profile, updateProfile, isLoading } = useSchoolData();
  const { toast } = useToast();

  const [vision, setVision] = useState(profile.vision);
  const [missionList, setMissionList] = useState<string[]>(profile.mission);
  const [newMissionItem, setNewMissionItem] = useState("");

  // Editor nilai pokok (seksi Why Us) — daftar dibaca langsung dari profile
  // sehingga selalu sinkron dengan DB; hanya field modal yang berupa state.
  const [values, setValues] = useState(profile.values);
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(null);
  const [valueTitle, setValueTitle] = useState("");
  const [valueDescription, setValueDescription] = useState("");

  // useState hanya membaca nilai awal — sinkronkan form saat profile
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setVision(profile.vision);
    setMissionList(profile.mission);
    setValues(profile.values);
  }, [profile]);

  const handleSaveVision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ vision });
      toast("Pernyataan visi berhasil diperbarui!", "success");
    } catch {
      toast("Gagal menyimpan visi. Perubahan tidak tersimpan — coba lagi.", "error");
    }
  };

  const handleAddMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionItem.trim()) return;
    const updated = [...missionList, newMissionItem.trim()];
    setMissionList(updated);
    try {
      await updateProfile({ mission: updated });
      setNewMissionItem("");
      toast("Butir misi berhasil ditambahkan!", "success");
    } catch {
      toast("Gagal menambahkan butir misi. Coba lagi.", "error");
    }
  };

  const handleDeleteMission = async (index: number) => {
    const updated = missionList.filter((_, i) => i !== index);
    setMissionList(updated);
    try {
      await updateProfile({ mission: updated });
      toast("Butir misi dihapus.", "info");
    } catch {
      toast("Gagal menghapus butir misi. Coba lagi.", "error");
    }
  };

  // ── Nilai Pokok (seksi Why Us di halaman depan) ──
  const handleOpenAddValue = () => {
    setEditingValueIndex(null);
    setValueTitle("");
    setValueDescription("");
    setValueModalOpen(true);
  };

  const handleOpenEditValue = (index: number) => {
    setEditingValueIndex(index);
    setValueTitle(values[index].title);
    setValueDescription(values[index].description);
    setValueModalOpen(true);
  };

  const handleDeleteValue = async (index: number) => {
    const updated = values.filter((_, i) => i !== index);
    setValues(updated);
    try {
      await updateProfile({ values: updated });
      toast("Nilai pokok dihapus.", "info");
    } catch {
      toast("Gagal menghapus nilai pokok.", "error");
    }
  };

  const handleSaveValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valueTitle.trim()) {
      toast("Judul nilai wajib diisi.", "error");
      return;
    }
    const item = { title: valueTitle.trim(), description: valueDescription.trim() };
    const updated =
      editingValueIndex === null
        ? [...values, item]
        : values.map((v, i) => (i === editingValueIndex ? item : v));
    setValues(updated);
    try {
      await updateProfile({ values: updated });
      toast(
        editingValueIndex === null
          ? "Nilai pokok baru berhasil ditambahkan!"
          : "Nilai pokok berhasil diperbarui!",
        "success"
      );
      setValueModalOpen(false);
    } catch {
      toast("Gagal menyimpan nilai pokok.", "error");
    }
  };

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
        <Card className="p-6 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20" />
          <div className="flex justify-end">
            <Skeleton className="h-8 w-28" />
          </div>
        </Card>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-4 w-48" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted border border-border"
              >
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-border flex gap-3">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-24" />
          </div>
        </Card>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-4 w-64" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted border border-border"
              >
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Organization / Visi, Misi &amp; Nilai
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Visi, Misi &amp; Nilai Lembaga
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Kelola visi jangka panjang, butir-butir misi strategis, dan nilai pokok lembaga yang tampil di seksi keunggulan halaman depan.
        </p>
      </div>

      {/* Vision */}
      <Card className="p-6">
        <form onSubmit={handleSaveVision} className="space-y-4">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-foreground">
            <Compass className="h-4 w-4 text-primary" />
            <span>Visi Lembaga</span>
          </div>
          <Textarea
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm">
              <Save className="h-4 w-4" />
              Simpan Visi
            </Button>
          </div>
        </form>
      </Card>

      {/* Mission List */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-foreground">
          <Target className="h-4 w-4 text-primary" />
          <span>Butir-Butir Misi Strategis</span>
        </div>

        <div className="space-y-3">
          {missionList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-4 rounded-lg bg-muted border border-border text-xs sm:text-sm text-foreground font-medium"
            >
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDeleteMission(idx)}
                className="text-destructive hover:text-destructive"
                title="Hapus Butir Misi"
                aria-label="Hapus Butir Misi"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddMission} className="pt-4 border-t border-border flex gap-3">
          <Input
            type="text"
            placeholder="Tambahkan butir misi baru..."
            value={newMissionItem}
            onChange={(e) => setNewMissionItem(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" className="shrink-0">
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </form>
      </Card>

      {/* Values / Nilai Pokok (seksi Why Us) */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wide text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Nilai Pokok / Keunggulan (Seksi Why Us)</span>
          </div>
          <Button size="sm" onClick={handleOpenAddValue} className="shrink-0">
            <Plus className="h-4 w-4" />
            Tambah Nilai
          </Button>
        </div>

        <p className="text-xs text-muted-foreground -mt-2">
          Daftar ini mengisi kartu &quot;Keunggulan &amp; Nilai Pokok Lembaga&quot; di halaman depan. Perubahan langsung tersimpan ke database.
        </p>

        {values.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 rounded-lg bg-muted border border-border">
            Belum ada nilai pokok. Halaman depan akan menampilkan daftar bawaan sampai Anda menambahkan nilai di sini.
          </p>
        ) : (
          <div className="space-y-3">
            {values.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-4 rounded-lg bg-muted border border-border text-xs sm:text-sm text-foreground"
              >
                <div className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <span className="font-semibold leading-relaxed block">{item.title}</span>
                    {item.description && (
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleOpenEditValue(idx)}
                    title="Edit Nilai"
                    aria-label={`Edit nilai ${item.title}`}
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDeleteValue(idx)}
                    className="text-destructive hover:text-destructive"
                    title="Hapus Nilai"
                    aria-label={`Hapus nilai ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Tambah / Edit Nilai Pokok */}
      <Modal
        isOpen={valueModalOpen}
        onClose={() => setValueModalOpen(false)}
        title={editingValueIndex === null ? "Tambah Nilai Pokok" : "Edit Nilai Pokok"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setValueModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveValue}>
              {editingValueIndex === null ? "Tambahkan Nilai" : "Simpan Perubahan"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveValue} className="space-y-4">
          <Input
            label="Judul Nilai"
            required
            placeholder="Contoh: Bimbingan Ulama Al-Azhar Kairo"
            value={valueTitle}
            onChange={(e) => setValueTitle(e.target.value)}
          />
          <Textarea
            label="Deskripsi Singkat"
            rows={4}
            placeholder="Jelaskan nilai keunggulan ini secara ringkas..."
            value={valueDescription}
            onChange={(e) => setValueDescription(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
