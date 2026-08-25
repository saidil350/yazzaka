"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Program } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { Plus, Edit2, Trash2, Layers, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

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
  const [features, setFeatures] = useState("");
  const [targetCompetencies, setTargetCompetencies] = useState("");
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
    setFeatures("Target capaian terukur\nPendampingan intensif musyrif\nSertifikasi kelulusan");
    setTargetCompetencies("Menguasai materi dasar dan lanjutan\nMampu berkomunikasi percaya diri");
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
    setFeatures(prog.features.join("\n"));
    setTargetCompetencies(prog.targetCompetencies ? prog.targetCompetencies.join("\n") : "");
    setStatus(prog.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc) {
      toast("Judul dan deskripsi program wajib diisi.", "error");
      return;
    }

    const featureArray = features.split("\n").map((f) => f.trim()).filter(Boolean);
    const compArray = targetCompetencies.split("\n").map((c) => c.trim()).filter(Boolean);

    if (editingId) {
      updateProgram(editingId, {
        title,
        slug: slugify(title),
        category,
        shortDesc,
        fullDesc,
        imageUrl,
        iconName,
        features: featureArray,
        targetCompetencies: compArray,
        status,
      });
      toast("Program kurikulum berhasil diperbarui!", "success");
    } else {
      addProgram({
        title,
        slug: slugify(title),
        category,
        shortDesc,
        fullDesc,
        imageUrl,
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
      <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-xs">
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Program Pendidikan" : "Tambah Program Baru"}
        maxWidth="xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              {editingId ? "Simpan Perubahan" : "Tambahkan Program"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Program"
            required
            placeholder="Contoh: Program Tahfiz Al-Qur'an 30 Juz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Kategori Program
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Program["category"])}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                <option value="published">Dipublikasikan</option>
                <option value="draft">Draf</option>
              </select>
            </div>
          </div>

          <Input
            label="URL Foto Banner Program"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <Textarea
            label="Deskripsi Ringkas (Tampil di kartu beranda)"
            rows={2}
            required
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
          />

          <Textarea
            label="Deskripsi Lengkap & Metodologi (Tampil di halaman detail)"
            rows={4}
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
          />

          <Textarea
            label="Fitur / Keunggulan (Satu per baris)"
            rows={3}
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />

          <Textarea
            label="Target Capaian & Kompetensi Lulusan (Satu per baris)"
            rows={3}
            value={targetCompetencies}
            onChange={(e) => setTargetCompetencies(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
