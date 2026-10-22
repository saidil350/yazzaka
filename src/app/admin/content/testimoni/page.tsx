"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Testimonial } from "@/lib/types";
import { Plus, Edit2, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quote) {
      toast("Nama dan kutipan testimoni wajib diisi.", "error");
      return;
    }

    try {
      if (editingId) {
        await updateTestimonial(editingId, {
          name,
          role,
          quote,
          photoUrl,
          childName,
          graduationYear: graduationYear ? Number(graduationYear) : undefined,
        });
        toast("Testimoni berhasil diperbarui!", "success");
      } else {
        await addTestimonial({
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
    } catch {
      toast("Gagal menyimpan testimoni. Data tidak tersimpan — coba lagi.", "error");
    }
  };

  const handleDelete = async (id: string, tName: string) => {
    if (!confirm(`Hapus testimoni dari "${tName}"?`)) return;
    try {
      await deleteTestimonial(id);
      toast("Testimoni telah dihapus.", "info");
    } catch {
      toast("Gagal menghapus testimoni. Coba lagi.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Content / Testimoni &amp; Ulasan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Testimoni &amp; Pengalaman
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Ulasan dan pengalaman nyata dari wali murid, alumni, dan tokoh masyarakat.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
          <span>Tambah Testimoni</span>
        </Button>
      </div>

      {/* Grid or EmptyState */}
      {testimonials.length === 0 ? (
        <Card className="p-8">
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
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <Card
              key={test.id}
              className="p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{test.role}</Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleOpenEdit(test)}
                      title="Edit Testimoni"
                      aria-label="Edit Testimoni"
                    >
                      <Edit2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(test.id, test.name)}
                      className="text-destructive hover:text-destructive"
                      title="Hapus Testimoni"
                      aria-label="Hapus Testimoni"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic font-medium">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={test.photoUrl}
                  alt={test.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-border"
                />
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-foreground">
                    {test.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {test.childName || (test.graduationYear ? `Alumni ${test.graduationYear}` : "")}
                  </p>
                </div>
              </div>
            </Card>
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

          <Select
            label="Peran / Hubungan"
            value={role}
            onChange={(e) => setRole(e.target.value as Testimonial["role"])}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>

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
