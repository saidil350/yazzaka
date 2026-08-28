"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Testimonial } from "@/lib/types";
import { Plus, Edit2, Trash2, Quote, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";

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
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Content / Testimoni &amp; Ulasan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Testimoni &amp; Pengalaman
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Ulasan dan pengalaman nyata dari wali murid, alumni, dan tokoh masyarakat.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
          <Plus className="h-4 w-4" />
          <span>Tambah Testimoni</span>
        </Button>
      </div>

      {/* Grid or EmptyState */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-[#E8E2D8] shadow-xs">
          <EmptyState
            icon={MessageSquare}
            title="Belum Ada Testimoni"
            description="Tambahkan ulasan atau kesan pertama dari wali santri, alumni, atau tokoh."
            action={{
              label: "Tambah Testimoni",
              onClick: handleOpenAdd,
              icon: Plus,
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-xs hover:border-[#FA6400]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE] text-[11px] font-bold shadow-2xs">
                    {test.role}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(test)}
                      className="p-1.5 rounded-full text-stone-500 hover:text-[#FA6400] hover:bg-[#FFF0E5] transition-colors cursor-pointer"
                      title="Edit Testimoni"
                      aria-label="Edit Testimoni"
                    >
                      <Edit2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id, test.name)}
                      className="p-1.5 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Testimoni"
                      aria-label="Hapus Testimoni"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-medium">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#E8E2D8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={test.photoUrl}
                  alt={test.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-[#E8E2D8] shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1E2330]">
                    {test.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {test.childName || (test.graduationYear ? `Alumni ${test.graduationYear}` : "")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Testimoni" : "Tambah Testimoni Baru"}
        maxWidth="2xl"
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
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
              Peran / Hubungan
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Testimonial["role"])}
              className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
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

          <ImageUpload
            label="Foto Profil Pemberi Testimoni"
            value={photoUrl}
            onChange={(val) => setPhotoUrl(val)}
            placeholder="https://images.unsplash.com/... atau unggah gambar"
            helperText="Unggah foto wajah/profil (drag & drop) atau gunakan URL gambar."
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
