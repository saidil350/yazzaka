"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Achievement } from "@/lib/types";
import { formatDateIndonesian } from "@/lib/utils";
import { Plus, Edit2, Trash2, Award, Trophy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";

export default function AdminAchievementsPage() {
  const { achievements, addAchievement, updateAchievement, deleteAchievement } = useSchoolData();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Achievement["category"]>("Akademik & Sains");
  const [studentName, setStudentName] = useState("");
  const [competitionName, setCompetitionName] = useState("");
  const [level, setLevel] = useState<Achievement["level"]>("Nasional");
  const [year, setYear] = useState<number>(2026);
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const categories: Achievement["category"][] = [
    "Akademik & Sains",
    "Tahfiz & Agama",
    "Bahasa & Debat",
    "Olahraga & Seni",
    "Inovasi",
  ];

  const levels: Achievement["level"][] = [
    "Internasional",
    "Nasional",
    "Provinsi",
    "Kabupaten / Kota",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Akademik & Sains");
    setStudentName("");
    setCompetitionName("");
    setLevel("Nasional");
    setYear(2026);
    setDate(new Date().toISOString().split("T")[0]);
    setImageUrl("https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1000&q=80");
    setDescription("");
    setModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingId(ach.id);
    setTitle(ach.title);
    setCategory(ach.category);
    setStudentName(ach.studentName);
    setCompetitionName(ach.competitionName);
    setLevel(ach.level);
    setYear(ach.year);
    setDate(ach.date);
    setImageUrl(ach.imageUrl);
    setDescription(ach.description);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !studentName) {
      toast("Judul prestasi dan nama siswa wajib diisi.", "error");
      return;
    }

    if (editingId) {
      updateAchievement(editingId, {
        title,
        category,
        studentName,
        competitionName,
        level,
        year: Number(year),
        date,
        imageUrl,
        description,
      });
      toast("Prestasi berhasil diperbarui!", "success");
    } else {
      addAchievement({
        title,
        category,
        studentName,
        competitionName,
        level,
        year: Number(year),
        date,
        imageUrl,
        description,
      });
      toast("Prestasi baru berhasil ditambahkan!", "success");
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, achTitle: string) => {
    if (confirm(`Hapus prestasi "${achTitle}"?`)) {
      deleteAchievement(id);
      toast("Prestasi telah dihapus.", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Content / Prestasi &amp; Piagam
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Prestasi Siswa &amp; Santri
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Dokumentasikan medali, kejuaraan, piagam, dan piala yang diraih santri dan civitas akademika Yazzakka.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
          <Plus className="h-4 w-4" />
          <span>Tambah Prestasi Baru</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-xs">
        {achievements.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Trophy}
              title="Belum Ada Prestasi Santri"
              description="Catat prestasi, piagam kejuaraan, atau penghargaan olimpiade pertama yang diraih santri."
              action={{
                label: "Tambah Prestasi Baru",
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
                  <th className="p-4 sm:px-6">Kejuaraan &amp; Prestasi</th>
                  <th className="p-4 sm:px-6">Siswa / Tim</th>
                  <th className="p-4 sm:px-6">Tingkat &amp; Kategori</th>
                  <th className="p-4 sm:px-6">Tanggal</th>
                  <th className="p-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
                {achievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ach.imageUrl}
                          alt={ach.title}
                          className="h-12 w-16 object-cover rounded-xl shrink-0 border border-[#E8E2D8] bg-[#FAF6EE]"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-[#1E2330] leading-snug">
                            {ach.title}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-medium">
                            {ach.competitionName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6 text-xs font-bold text-[#1E2330]">
                      {ach.studentName}
                    </td>
                    <td className="p-4 sm:px-6">
                      <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#15803D] border border-[#BDE7CC] text-xs font-bold mr-1 shadow-2xs">
                        {ach.level}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">{ach.category}</span>
                    </td>
                    <td className="p-4 sm:px-6 text-xs text-stone-500 font-medium">
                      {formatDateIndonesian(ach.date)}
                    </td>
                    <td className="p-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ach)}
                        className="p-2 rounded-full text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] transition-colors cursor-pointer"
                        title="Edit Prestasi"
                        aria-label="Edit Prestasi"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDelete(ach.id, ach.title)}
                        className="p-2 rounded-full text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Prestasi"
                        aria-label="Hapus Prestasi"
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
        title={editingId ? "Edit Prestasi" : "Tambah Prestasi Baru"}
        maxWidth="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              {editingId ? "Simpan Perubahan" : "Tambahkan Prestasi"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Kejuaraan / Gelar Prestasi"
            required
            placeholder="Contoh: Medali Emas Olimpiade Sains Nasional (OSN) Biologi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Siswa / Tim Peraih"
              required
              placeholder="Contoh: Muhammad Farhan Al-Ghifari"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
            <Input
              label="Nama Penyelenggara / Kompetisi"
              required
              placeholder="Contoh: Puspresnas Kemendikbud"
              value={competitionName}
              onChange={(e) => setCompetitionName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Achievement["category"])}
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
                Tingkat
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Achievement["level"])}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Tahun"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>

          <Input
            label="Tanggal Perolehan"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <ImageUpload
            label="Foto Dokumentasi / Piagam Prestasi"
            value={imageUrl}
            onChange={(val) => setImageUrl(val)}
            placeholder="https://images.unsplash.com/... atau unggah gambar"
            helperText="Unggah foto santri/piala (drag & drop) atau gunakan tautan URL gambar."
          />

          <Textarea
            label="Deskripsi Capaian / Ulasan Singkat"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
