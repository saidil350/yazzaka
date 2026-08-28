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
  Sparkles,
  Target,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";

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
    setImageUrl("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      toast("Judul dan deskripsi program wajib diisi.", "error");
      return;
    }

    const featureArray = featuresList.map((f) => f.trim()).filter(Boolean);
    const compArray = competenciesList.map((c) => c.trim()).filter(Boolean);

    if (editingId) {
      updateProgram(editingId, {
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
      addProgram({
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
  };

  const handleDelete = (id: string, progTitle: string) => {
    if (confirm(`Hapus program "${progTitle}"?`)) {
      deleteProgram(id);
      toast("Program telah dihapus.", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Content / Program Pendidikan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Program &amp; Kurikulum
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Kelola program unggulan, tahfiz, sains, riset teknologi, dan pengayaan bahasa santri.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
          <Plus className="h-4 w-4" />
          <span>Tambah Program Baru</span>
        </Button>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-xl border border-[#E8E2D8] overflow-hidden shadow-xs">
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
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6EE] border-b border-[#E8E2D8] text-xs font-bold uppercase text-stone-500">
                <tr>
                  <th className="p-4 sm:px-6">Nama Program &amp; Kategori</th>
                  <th className="p-4 sm:px-6">Keunggulan Utama</th>
                  <th className="p-4 sm:px-6">Status</th>
                  <th className="p-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
                {programs.map((prog) => (
                  <tr key={prog.id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prog.imageUrl}
                          alt={prog.title}
                          className="h-12 w-16 object-cover rounded-xl shrink-0 border border-[#E8E2D8] bg-[#FAF6EE]"
                        />
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-[#FA6400] block">
                            {prog.category}
                          </span>
                          <h4 className="font-bold text-sm text-[#1E2330] leading-snug">
                            {prog.title}
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6 text-xs text-stone-600">
                      <ul className="space-y-1">
                        {prog.features.slice(0, 2).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 font-medium">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 sm:px-6">
                      <Badge variant={prog.status === "published" ? "success" : "secondary"}>
                        {prog.status === "published" ? "Aktif" : "Draf"}
                      </Badge>
                    </td>
                    <td className="p-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prog)}
                        className="p-2 rounded-full text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] transition-colors cursor-pointer"
                        title="Edit Program"
                        aria-label="Edit Program"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDelete(prog.id, prog.title)}
                        className="p-2 rounded-full text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Program"
                        aria-label="Hapus Program"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Program Pendidikan" : "Tambah Program Baru"}
        description="Kelola informasi kurikulum, media foto, dan target capaian santri secara lengkap."
        maxWidth="4xl"
        footer={
          <div className="flex items-center justify-between w-full gap-3">
            <span className="text-xs text-stone-400 font-medium hidden sm:inline-flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Pastikan data kurikulum terisi akurat
            </span>
            <div className="flex items-center gap-2.5 ml-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                className="font-bold text-stone-600 hover:bg-stone-100"
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={handleSubmit}
                className="font-bold shadow-md shadow-orange-500/20"
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
          <div className="bg-[#FCFBF7] rounded-lg p-4 sm:p-5 border border-[#E8E2D8] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
              <BookOpen className="w-4 h-4 text-[#FA6400]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
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
          <div className="bg-[#FCFBF7] rounded-lg p-4 sm:p-5 border border-[#E8E2D8] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
              <ImageIcon className="w-4 h-4 text-[#FA6400]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Media &amp; Banner Visual
              </h3>
            </div>

            <ImageUpload
              label="Foto Banner Program"
              value={imageUrl}
              onChange={(val) => setImageUrl(val)}
              placeholder="https://images.unsplash.com/... atau unggah gambar"
              helperText="Unggah berkas gambar (drag & drop) atau gunakan tautan URL gambar resolusi tinggi."
            />
          </div>

          {/* Section 3: Deskripsi Program */}
          <div className="bg-[#FCFBF7] rounded-lg p-4 sm:p-5 border border-[#E8E2D8] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
              <FileText className="w-4 h-4 text-[#FA6400]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
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
          <div className="bg-[#FCFBF7] rounded-lg p-4 sm:p-5 border border-[#E8E2D8] space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
              <Sparkles className="w-4 h-4 text-[#FA6400]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Keunggulan &amp; Target Capaian Santri
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Fitur & Keunggulan List */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E8E2D8]/80">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fitur &amp; Keunggulan Utama</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                      {featuresList.filter((f) => f.trim()).length} Poin
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-stone-500">
                  Tambahkan keunggulan kurikulum atau fasilitas pendukung per poin.
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {featuresList.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <span className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Input
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        placeholder={`Keunggulan #${idx + 1} (cth: Musyrif Bersertifikasi)`}
                        className="flex-1 h-9 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors shrink-0 cursor-pointer"
                        title="Hapus baris ini"
                        aria-label={`Hapus keunggulan ${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeature}
                  className="w-full h-9 text-xs font-bold text-emerald-700 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-500 transition-all rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin Keunggulan</span>
                </Button>
              </div>

              {/* Target Capaian List */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E8E2D8]/80">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <Target className="w-3.5 h-3.5 text-[#FA6400]" />
                    <span>Target Capaian &amp; Kompetensi</span>
                    <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded-md border border-orange-200">
                      {competenciesList.filter((c) => c.trim()).length} Poin
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-stone-500">
                  Target kompetensi kelulusan yang dicapai santri setelah program selesai.
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {competenciesList.map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <span className="h-7 w-7 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Input
                        value={comp}
                        onChange={(e) => handleCompetencyChange(idx, e.target.value)}
                        placeholder={`Capaian #${idx + 1} (cth: Hafal Juz 30 Mutqin)`}
                        className="flex-1 h-9 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCompetency(idx)}
                        className="h-9 w-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors shrink-0 cursor-pointer"
                        title="Hapus baris ini"
                        aria-label={`Hapus capaian ${idx + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCompetency}
                  className="w-full h-9 text-xs font-bold text-[#FA6400] border-dashed border-orange-300 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-500 transition-all rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Poin Capaian</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
