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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Content / Fasilitas Kampus
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
            Manajemen Fasilitas & Sarpras
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data dan foto sarana prasarana kelas, laboratorium, asrama, masjid, dan sarana olahraga.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="accent" size="default" className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Tambah Fasilitas Baru</span>
        </Button>
      </div>

      {/* Facilities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="p-4 sm:px-6">Nama Fasilitas & Foto</th>
                <th className="p-4 sm:px-6">Kategori</th>
                <th className="p-4 sm:px-6">Kapasitas</th>
                <th className="p-4 sm:px-6">Status</th>
                <th className="p-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3 max-w-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fac.imageUrl}
                        alt={fac.name}
                        className="h-12 w-16 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-snug">
                          {fac.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {fac.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {fac.category}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-xs font-medium text-slate-600">
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
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(fac.id, fac.name)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Facility["category"])}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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

          <Input
            label="URL Foto Fasilitas"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <Textarea
            label="Deskripsi Fasilitas"
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
              Status Tampilan
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "published" | "draft")}
              className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
