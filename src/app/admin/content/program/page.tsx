"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Program } from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Check,
  BookOpen,
  Tag,
  Globe,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminProgramsCrudPage() {
  const { programs, addProgram, updateProgram, deleteProgram } = useSchoolData();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Program["category"]>("Akademik");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [iconName, setIconName] = useState("BookOpen");
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [competenciesList, setCompetenciesList] = useState<string[]>([]);
  const [status, setStatus] = useState<"published" | "draft">("published");

  const categories: Program["category"][] = [
    "Akademik",
    "Keagamaan / Tahfiz",
    "Bahasa Asing",
    "Sains & Riset",
    "Kepemimpinan & Karakter",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Akademik");
    setShortDesc("");
    setFullDesc("");
    setImageUrl("");
    setIconName("BookOpen");
    setFeaturesList([
      "Target capaian terukur",
      "Pendampingan intensif musyrif",
      "Sertifikasi kelulusan",
    ]);
    setCompetenciesList([
      "Menguasai materi dasar dan lanjutan",
      "Mampu berkomunikasi percaya diri",
    ]);
    setStatus("published");
    setModalOpen(true);
  };

  const handleOpenEdit = (prog: Program) => {
    setEditingId(prog.id);
    setTitle(prog.title);
    setCategory(prog.category);
    setShortDesc(prog.shortDesc);
    setFullDesc(prog.fullDesc);
    setImageUrl(prog.imageUrl);
    setIconName(prog.iconName);
    setFeaturesList(prog.features && prog.features.length > 0 ? [...prog.features] : [""]);
    setCompetenciesList(
      prog.targetCompetencies && prog.targetCompetencies.length > 0
        ? [...prog.targetCompetencies]
        : [""]
    );
    setStatus(prog.status);
    setModalOpen(true);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...featuresList];
    updated[index] = value;
    setFeaturesList(updated);
  };

  const handleAddFeature = () => {
    setFeaturesList([...featuresList, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    if (featuresList.length <= 1) {
      setFeaturesList([""]);
      return;
    }
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleCompetencyChange = (index: number, value: string) => {
    const updated = [...competenciesList];
    updated[index] = value;
    setCompetenciesList(updated);
  };

  const handleAddCompetency = () => {
    setCompetenciesList([...competenciesList, ""]);
  };

  const handleRemoveCompetency = (index: number) => {
    if (competenciesList.length <= 1) {
      setCompetenciesList([""]);
      return;
    }
    setCompetenciesList(competenciesList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      toast("Judul dan deskripsi program wajib diisi.", "error");
      return;
    }

    const featureArray = featuresList.map((f) => f.trim()).filter(Boolean);
    const compArray = competenciesList.map((c) => c.trim()).filter(Boolean);

    try {
      if (editingId) {
        await updateProgram(editingId, {
          title: title.trim(),
          slug: slugify(title),
          category,
          shortDesc: shortDesc.trim(),
          fullDesc: fullDesc.trim(),
          imageUrl: imageUrl.trim(),
          iconName,
          features: featureArray,
          targetCompetencies: compArray,
          status,
        });
        toast("Program kurikulum berhasil diperbarui!", "success");
      } else {
        await addProgram({
          title: title.trim(),
          slug: slugify(title),
          category,
          shortDesc: shortDesc.trim(),
          fullDesc: fullDesc.trim(),
          imageUrl: imageUrl.trim(),
          iconName,
          features: featureArray,
          targetCompetencies: compArray,
          status,
          orderIndex: programs.length + 1,
        });
        toast("Program baru berhasil ditambahkan!", "success");
      }
      setModalOpen(false);
    } catch {
      toast("Gagal menyimpan program. Data tidak tersimpan — coba lagi.", "error");
    }
  };

  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const handleConfirmDelete = async () => {
    if (!programToDelete) return;
    try {
      await deleteProgram(programToDelete.id);
      toast("Program telah dihapus.", "info");
    } catch {
      toast("Gagal menghapus program. Coba lagi.", "error");
    } finally {
      setProgramToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Content / Program Pendidikan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Program &amp; Kurikulum
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola program unggulan, tahfiz, sains, riset teknologi, dan pengayaan bahasa santri.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
          <span>Tambah Program Baru</span>
        </Button>
      </div>

      {/* Programs List */}
      <Card className="overflow-hidden">
        {programs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Layers}
              title="Belum Ada Program Pendidikan"
              description="Tambahkan unit jenjang pendidikan atau program kurikulum unggulan pertama Anda."
              action={{
                label: "Tambah Program Baru",
                onClick: handleOpenAdd,
                icon: Plus,
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="text-left">
              <TableHeader>
                <tr>
                  <TableHead className="p-4 sm:px-6">Nama Program &amp; Kategori</TableHead>
                  <TableHead className="p-4 sm:px-6">Keunggulan Utama</TableHead>
                  <TableHead className="p-4 sm:px-6">Status</TableHead>
                  <TableHead className="p-4 sm:px-6 text-right">Aksi</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {programs.map((prog) => (
                  <TableRow key={prog.id}>
                    <TableCell className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prog.imageUrl}
                          alt={prog.title}
                          className="h-12 w-16 object-cover rounded-md shrink-0 border border-border bg-muted"
                        />
                        <div>
                          <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                            {prog.category}
                          </span>
                          <h4 className="font-semibold text-sm text-foreground leading-snug">
                            {prog.title}
                          </h4>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-xs text-muted-foreground">
                      <ul className="space-y-1">
                        {prog.features.slice(0, 2).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 font-medium">
                            <Check className="h-3.5 w-3.5 text-success shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6">
                      <Badge variant={prog.status === "published" ? "default" : "secondary"}>
                        {prog.status === "published" ? "Aktif" : "Draf"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(prog)}
                        title="Edit Program"
                        aria-label="Edit Program"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setProgramToDelete(prog)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus Program"
                        aria-label="Hapus Program"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Program Pendidikan" : "Tambah Program Baru"}
        description="Kelola informasi kurikulum, media foto, dan target capaian santri secara lengkap."
        maxWidth="4xl"
        footer={
          <div className="flex items-center justify-between w-full gap-3">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline-flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Pastikan data kurikulum terisi akurat
            </span>
            <div className="flex items-center gap-2.5 ml-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={handleSubmit}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{editingId ? "Simpan Perubahan" : "Tambahkan Program"}</span>
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Informasi Utama */}
          <div className="bg-muted rounded-lg p-4 sm:p-5 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Informasi Utama
              </h3>
            </div>

            <Input
              label="Nama Program"
              required
              leftIcon={<BookOpen className="w-4 h-4" />}
              placeholder="Contoh: TPA Yazzakka (Taman Pendidikan Al-Qur'an)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText="Gunakan nama resmi program pendidikan atau kurikulum unggulan"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Kategori Program"
                icon={<Tag className="w-3.5 h-3.5" />}
                value={category}
                onChange={(e) => setCategory(e.target.value as Program["category"])}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>

              <Select
                label="Status Publikasi"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
              >
                <option value="published">Dipublikasikan (Tampil ke publik)</option>
                <option value="draft">Draf (Disembunyikan)</option>
              </Select>
            </div>
          </div>

          {/* Section 2: Media Banner */}
          <div className="bg-muted rounded-lg p-4 sm:p-5 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <ImageIcon className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Media &amp; Banner Visual
              </h3>
            </div>

            <ImageUpload
              label="Foto Banner Program"
              value={imageUrl}
              onChange={(val) => setImageUrl(val)}
              placeholder="https://contoh.com/gambar.jpg"
              helperText="Unggah berkas gambar (drag & drop) atau gunakan tautan URL gambar resolusi tinggi."
              folder="program"
            />
          </div>

          {/* Section 3: Deskripsi Program */}
          <div className="bg-muted rounded-lg p-4 sm:p-5 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Deskripsi Program
              </h3>
            </div>

            <Textarea
              label="Deskripsi Ringkas (Tampil di kartu beranda)"
              required
              rows={2}
              placeholder="Contoh: Pembinaan dasar baca-tulis Al-Qur'an dengan metode tartil tajwid, hafalan surat pendek, doa harian..."
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              helperText="Penjelasan ringkas 1-2 kalimat untuk kartu depan"
            />

            <Textarea
              label="Deskripsi Lengkap & Metodologi (Tampil di halaman detail)"
              rows={3}
              placeholder="Jelaskan silabus pembelajaran, tahapan belajar, durasi santri, dan metode pengajaran..."
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              helperText="Penjelasan komprehensif bagi calon santri dan orang tua"
            />
          </div>

          {/* Section 4: Keunggulan & Target Capaian (Point-by-Point Dynamic List) */}
          <div className="bg-muted rounded-lg p-4 sm:p-5 border border-border space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Keunggulan &amp; Target Capaian Santri
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Fitur & Keunggulan List */}
              <div className="space-y-3 bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <span>Fitur &amp; Keunggulan Utama</span>
                    <Badge variant="secondary">
                      {featuresList.filter((f) => f.trim()).length} Poin
                    </Badge>
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Tambahkan keunggulan kurikulum atau fasilitas pendukung per poin.
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <span className="h-7 w-7 rounded-full bg-muted border border-border text-muted-foreground font-medium text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Input
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Keunggulan #${idx + 1} (cth: Musyrif Bersertifikasi)`}
                        className="flex-1 h-9 text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus baris ini"
                        aria-label={`Hapus keunggulan ${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeature}
                  className="w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin Keunggulan</span>
                </Button>
              </div>

              {/* Target Capaian List */}
              <div className="space-y-3 bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <span>Target Capaian &amp; Kompetensi</span>
                    <Badge variant="secondary">
                      {competenciesList.filter((c) => c.trim()).length} Poin
                    </Badge>
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Target kompetensi kelulusan yang dicapai santri setelah program selesai.
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {competenciesList.map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <span className="h-7 w-7 rounded-full bg-muted border border-border text-muted-foreground font-medium text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Input
                        value={comp}
                        onChange={(e) => handleCompetencyChange(idx, e.target.value)}
                        placeholder={`Capaian #${idx + 1} (cth: Hafal Juz 30 Mutqin)`}
                        className="flex-1 h-9 text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCompetency(idx)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus baris ini"
                        aria-label={`Hapus capaian ${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCompetency}
                  className="w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin Capaian</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── Konfirmasi Hapus Program ──────────────────── */}
      <ConfirmDialog
        isOpen={programToDelete !== null}
        onClose={() => setProgramToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Program?"
        description={
          <>
            Apakah Anda yakin ingin menghapus program{" "}
            <span className="font-medium text-foreground">
              &ldquo;{programToDelete?.title}&rdquo;
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </>
        }
      />
    </div>
  );
}
