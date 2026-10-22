"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Facility } from "@/lib/types";
import { Plus, Edit2, Trash2, Building } from "lucide-react";
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

export default function AdminFacilitiesPage() {
  const { facilities, addFacility, updateFacility, deleteFacility } = useSchoolData();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Facility["category"]>("Ruang Belajar");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  const categories: Facility["category"][] = [
    "Ruang Belajar",
    "Laboratorium & Riset",
    "Asrama & Hunian",
    "Sarana Ibadah & Olahraga",
    "Penunjang",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setCategory("Ruang Belajar");
    setDescription("");
    setCapacity("30 Siswa / Ruangan");
    setImageUrl("https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80");
    setStatus("published");
    setModalOpen(true);
  };

  const handleOpenEdit = (fac: Facility) => {
    setEditingId(fac.id);
    setName(fac.name);
    setCategory(fac.category);
    setDescription(fac.description);
    setCapacity(fac.capacity || "");
    setImageUrl(fac.imageUrl);
    setStatus(fac.status);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast("Nama fasilitas dan deskripsi wajib diisi.", "error");
      return;
    }

    try {
      if (editingId) {
        await updateFacility(editingId, {
          name,
          category,
          description,
          capacity,
          imageUrl,
          status,
        });
        toast("Fasilitas berhasil diperbarui!", "success");
      } else {
        await addFacility({
          name,
          category,
          description,
          capacity,
          imageUrl,
          status,
          orderIndex: facilities.length + 1,
        });
        toast("Fasilitas baru berhasil ditambahkan!", "success");
      }
      setModalOpen(false);
    } catch {
      toast("Gagal menyimpan fasilitas. Data tidak tersimpan — coba lagi.", "error");
    }
  };

  const handleDelete = async (id: string, facName: string) => {
    if (!confirm(`Hapus fasilitas "${facName}"?`)) return;
    try {
      await deleteFacility(id);
      toast("Fasilitas telah dihapus.", "info");
    } catch {
      toast("Gagal menghapus fasilitas. Coba lagi.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Content / Fasilitas Sekolah
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Fasilitas &amp; Sarpras
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola data dan foto sarana prasarana kelas, laboratorium, asrama, masjid, dan sarana olahraga.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
          <span>Tambah Fasilitas Baru</span>
        </Button>
      </div>

      {/* Facilities Table */}
      <Card className="overflow-hidden">
        {facilities.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Building}
              title="Belum Ada Data Fasilitas"
              description="Tambahkan sarana gedung, ruang kelas, asrama, atau perpustakaan sekolah."
              action={{
                label: "Tambah Fasilitas Baru",
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
                  <TableHead className="p-4 sm:px-6">Nama Fasilitas &amp; Foto</TableHead>
                  <TableHead className="p-4 sm:px-6">Kategori</TableHead>
                  <TableHead className="p-4 sm:px-6">Kapasitas</TableHead>
                  <TableHead className="p-4 sm:px-6">Status</TableHead>
                  <TableHead className="p-4 sm:px-6 text-right">Aksi</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {facilities.map((fac) => (
                  <TableRow key={fac.id}>
                    <TableCell className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fac.imageUrl}
                          alt={fac.name}
                          className="h-12 w-16 object-cover rounded-md shrink-0 border border-border bg-muted"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-foreground leading-snug">
                            {fac.name}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {fac.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6">
                      <Badge variant="secondary">{fac.category}</Badge>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-xs font-medium text-muted-foreground">
                      {fac.capacity || "-"}
                    </TableCell>
                    <TableCell className="p-4 sm:px-6">
                      <Badge variant={fac.status === "published" ? "default" : "secondary"}>
                        {fac.status === "published" ? "Aktif" : "Draf"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(fac)}
                        title="Edit Fasilitas"
                        aria-label="Edit Fasilitas"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(fac.id, fac.name)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus Fasilitas"
                        aria-label="Hapus Fasilitas"
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
        title={editingId ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              {editingId ? "Simpan Perubahan" : "Tambahkan Fasilitas"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Fasilitas"
            required
            placeholder="Contoh: Laboratorium Komputer & Multimedia"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value as Facility["category"])}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Input
              label="Kapasitas (Opsional)"
              placeholder="Contoh: 40 Siswa"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <ImageUpload
            label="Foto Fasilitas"
            value={imageUrl}
            onChange={(val) => setImageUrl(val)}
            placeholder="https://images.unsplash.com/... atau unggah gambar"
            helperText="Unggah foto fasilitas (drag & drop) atau tempelkan tautan URL gambar."
          />

          <Textarea
            label="Deskripsi Fasilitas"
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            label="Status Tampilan"
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft")}
          >
            <option value="published">Tampilkan di Website (Published)</option>
            <option value="draft">Sembunyikan (Draft)</option>
          </Select>
        </form>
      </Modal>
    </div>
  );
}
