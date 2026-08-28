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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast("Nama fasilitas dan deskripsi wajib diisi.", "error");
      return;
    }

    if (editingId) {
      updateFacility(editingId, {
        name,
        category,
        description,
        capacity,
        imageUrl,
        status,
      });
      toast("Fasilitas berhasil diperbarui!", "success");
    } else {
      addFacility({
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
  };

  const handleDelete = (id: string, facName: string) => {
    if (confirm(`Hapus fasilitas "${facName}"?`)) {
      deleteFacility(id);
      toast("Fasilitas telah dihapus.", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Content / Fasilitas Sekolah
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Fasilitas &amp; Sarpras
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Kelola data dan foto sarana prasarana kelas, laboratorium, asrama, masjid, dan sarana olahraga.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
          <Plus className="h-4 w-4" />
          <span>Tambah Fasilitas Baru</span>
        </Button>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-xs">
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
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6EE] border-b border-[#E8E2D8] text-xs font-bold uppercase text-stone-500">
                <tr>
                  <th className="p-4 sm:px-6">Nama Fasilitas &amp; Foto</th>
                  <th className="p-4 sm:px-6">Kategori</th>
                  <th className="p-4 sm:px-6">Kapasitas</th>
                  <th className="p-4 sm:px-6">Status</th>
                  <th className="p-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
                {facilities.map((fac) => (
                  <tr key={fac.id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fac.imageUrl}
                          alt={fac.name}
                          className="h-12 w-16 object-cover rounded-xl shrink-0 border border-[#E8E2D8] bg-[#FAF6EE]"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-[#1E2330] leading-snug">
                            {fac.name}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-medium">
                            {fac.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6">
                      <span className="px-3 py-1 rounded-full bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA] text-xs font-bold shadow-2xs">
                        {fac.category}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 text-xs font-bold text-stone-600">
                      {fac.capacity || "-"}
                    </td>
                    <td className="p-4 sm:px-6">
                      <Badge variant={fac.status === "published" ? "success" : "secondary"}>
                        {fac.status === "published" ? "Aktif" : "Draf"}
                      </Badge>
                    </td>
                    <td className="p-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(fac)}
                        className="p-2 rounded-xl text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] transition-colors cursor-pointer"
                        title="Edit Fasilitas"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fac.id, fac.name)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Fasilitas"
                      >
                        <Trash2 className="h-4 w-4" />
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
        title={editingId ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}
        maxWidth="lg"
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
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Facility["category"])}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

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

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
              Status Tampilan
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "published" | "draft")}
              className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
            >
              <option value="published">Tampilkan di Website (Published)</option>
              <option value="draft">Sembunyikan (Draft)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
