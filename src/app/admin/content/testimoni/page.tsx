"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Testimonial } from "@/lib/types";
import { Plus, Edit2, Trash2, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";

export default function AdminTestimonialsPage() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useSchoolData();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState<Testimonial["role"]>("Wali Murid");
  const [quote, setQuote] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [childName, setChildName] = useState("");
  const [graduationYear, setGraduationYear] = useState<number | undefined>(undefined);

  const roles: Testimonial["role"][] = [
    "Wali Murid",
    "Alumni",
    "Siswa Aktif",
    "Tokoh Pendidikan",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setRole("Wali Murid");
    setQuote("");
    setPhotoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
    setChildName("");
    setGraduationYear(undefined);
    setModalOpen(true);
  };

  const handleOpenEdit = (test: Testimonial) => {
    setEditingId(test.id);
    setName(test.name);
    setRole(test.role);
    setQuote(test.quote);
    setPhotoUrl(test.photoUrl);
    setChildName(test.childName || "");
    setGraduationYear(test.graduationYear);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) {
      toast("Nama dan kutipan testimoni wajib diisi.", "error");
      return;
    }

    if (editingId) {
      updateTestimonial(editingId, {
        name,
        role,
        quote,
        photoUrl,
        childName,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
      });
      toast("Testimoni berhasil diperbarui!", "success");
    } else {
      addTestimonial({
        name,
        role,
        quote,
        photoUrl,
        childName,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        isFeatured: true,
      });
      toast("Testimoni baru berhasil ditambahkan!", "success");
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, tName: string) => {
    if (confirm(`Hapus testimoni dari "${tName}"?`)) {
      deleteTestimonial(id);
      toast("Testimoni telah dihapus.", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Content / Testimoni
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
            Manajemen Testimoni & Pengalaman
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ulasan dan pengalaman nyata dari wali murid, alumni, dan tokoh masyarakat.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="accent" size="default" className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Tambah Testimoni</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
                  {test.role}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(test)}
                    className="p-1 text-slate-500 hover:text-slate-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id, test.name)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;{test.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={test.photoUrl}
                alt={test.name}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[var(--color-primary)]">
                  {test.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {test.childName || (test.graduationYear ? `Alumni ${test.graduationYear}` : "")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Testimoni" : "Tambah Testimoni Baru"}
        maxWidth="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              {editingId ? "Simpan Perubahan" : "Tambahkan Testimoni"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Pemberi Testimoni"
            required
            placeholder="Contoh: dr. H. Hendra Setiawan, Sp.A."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
              Peran / Hubungan
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Testimonial["role"])}
              className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Anak & Kelas (Wali Murid)"
              placeholder="Contoh: Farhan (Kelas 11)"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
            <Input
              label="Tahun Lulus (Khusus Alumni)"
              type="number"
              placeholder="2024"
              value={graduationYear || ""}
              onChange={(e) => setGraduationYear(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <Input
            label="URL Foto Profil"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />

          <Textarea
            label="Isi Kutipan Testimoni"
            rows={4}
            required
            placeholder="Tuliskan pengalaman positif..."
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
