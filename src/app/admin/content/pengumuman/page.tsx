"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Achievement } from "@/lib/types";
import { formatDateIndonesian } from "@/lib/utils";
import { Plus, Edit2, Trash2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !studentName) {
      toast("Judul prestasi dan nama siswa wajib diisi.", "error");
      return;
    }

    try {
      if (editingId) {
        await updateAchievement(editingId, {
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
        await addAchievement({
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
    } catch {
      toast("Gagal menyimpan prestasi. Data tidak tersimpan — coba lagi.", "error");
    }
  };

  const handleDelete = async (id: string, achTitle: string) => {
    if (!confirm(`Hapus prestasi "${achTitle}"?`)) return;
    try {
      await deleteAchievement(id);
      toast("Prestasi telah dihapus.", "info");
    } catch {
      toast("Gagal menghapus prestasi. Coba lagi.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Content / Prestasi &amp; Piagam
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Prestasi Siswa &amp; Santri
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Dokumentasikan medali, kejuaraan, piagam, dan piala yang diraih santri dan civitas akademika Yazzakka.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
          <span>Tambah Prestasi Baru</span>
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
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
            <Table className="text-left">
              <TableHeader>
                <tr>
                  <TableHead className="p-4 sm:px-6">Kejuaraan &amp; Prestasi</TableHead>
                  <TableHead className="p-4 sm:px-6">Siswa / Tim</TableHead>
                  <TableHead className="p-4 sm:px-6">Tingkat &amp; Kategori</TableHead>
                  <TableHead className="p-4 sm:px-6">Tanggal</TableHead>
                  <TableHead className="p-4 sm:px-6 text-right">Aksi</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {achievements.map((ach) => (
                  <TableRow key={ach.id}>
                    <TableCell className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ach.imageUrl}
                          alt={ach.title}
                          className="h-12 w-16 object-cover rounded-md shrink-0 border border-border bg-muted"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-foreground leading-snug">
                            {ach.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {ach.competitionName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-xs font-medium text-foreground">
                      {ach.studentName}
                    </TableCell>
                    <TableCell className="p-4 sm:px-6">
                      <Badge variant="secondary" className="mr-1">
                        {ach.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{ach.category}</span>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-xs text-muted-foreground">
                      {formatDateIndonesian(ach.date)}
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(ach)}
                        title="Edit Prestasi"
                        aria-label="Edit Prestasi"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(ach.id, ach.title)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus Prestasi"
                        aria-label="Hapus Prestasi"
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Prestasi" : "Tambah Prestasi Baru"}
        maxWidth="2xl"
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
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value as Achievement["category"])}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              label="Tingkat"
              value={level}
              onChange={(e) => setLevel(e.target.value as Achievement["level"])}
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>

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
