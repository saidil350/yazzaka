"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { SchoolEvent } from "@/lib/types";
import { formatDateIndonesian } from "@/lib/utils";
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";

export default function AdminEventsPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useSchoolData();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<SchoolEvent["category"]>("Akademik");
  const [coverImage, setCoverImage] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");
  const [status, setStatus] = useState<"upcoming" | "completed">("upcoming");

  const categories: SchoolEvent["category"][] = [
    "Akademik",
    "Penerimaan Siswa",
    "Seminar & Parenting",
    "Kegiatan Santri",
    "Wisuda & Pameran",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setTime("08:00 - 12:00 WIB");
    setLocation("Kompleks Utama Yayasan Yazzakka");
    setCategory("Akademik");
    setCoverImage("https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80");
    setRegistrationUrl("/pendaftaran");
    setStatus("upcoming");
    setModalOpen(true);
  };

  const handleOpenEdit = (evt: SchoolEvent) => {
    setEditingId(evt.id);
    setTitle(evt.title);
    setDescription(evt.description);
    setDate(evt.date);
    setTime(evt.time);
    setLocation(evt.location);
    setCategory(evt.category);
    setCoverImage(evt.coverImage);
    setRegistrationUrl(evt.registrationUrl || "");
    setStatus(evt.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      toast("Judul dan tanggal agenda wajib diisi.", "error");
      return;
    }

    if (editingId) {
      updateEvent(editingId, {
        title,
        description,
        date,
        time,
        location,
        category,
        coverImage,
        registrationUrl,
        status,
      });
      toast("Agenda kegiatan berhasil diperbarui!", "success");
    } else {
      addEvent({
        title,
        description,
        date,
        time,
        location,
        category,
        coverImage,
        registrationUrl,
        status,
      });
      toast("Agenda kegiatan baru berhasil ditambahkan!", "success");
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, evtTitle: string) => {
    if (confirm(`Hapus agenda "${evtTitle}"?`)) {
      deleteEvent(id);
      toast("Agenda telah dihapus.", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Content / Kegiatan &amp; Agenda
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Agenda &amp; Acara
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Jadwal kegiatan akademik, seminar parenting, ujian seleksi, dan kalender acara sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
          <Plus className="h-4 w-4" />
          <span>Tambah Agenda Baru</span>
        </Button>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border border-[#E8E2D8] overflow-hidden shadow-xs">
        {events.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Calendar}
              title="Belum Ada Agenda / Acara"
              description="Buat jadwal agenda akademik, seminar, atau kegiatan santri pertama Anda."
              action={{
                label: "Tambah Agenda Baru",
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
                  <th className="p-4 sm:px-6">Nama Agenda &amp; Kategori</th>
                  <th className="p-4 sm:px-6">Tanggal &amp; Waktu</th>
                  <th className="p-4 sm:px-6">Lokasi</th>
                  <th className="p-4 sm:px-6">Status</th>
                  <th className="p-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="p-4 sm:px-6">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#FA6400] block mb-0.5">
                          {evt.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E2330] leading-snug">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-medium">
                          {evt.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6 text-xs space-y-0.5">
                      <span className="font-bold text-[#1E2330] block">
                        {formatDateIndonesian(evt.date)}
                      </span>
                      <span className="text-stone-500 font-medium">{evt.time}</span>
                    </td>
                    <td className="p-4 sm:px-6 text-xs text-stone-600 font-semibold">
                      {evt.location}
                    </td>
                    <td className="p-4 sm:px-6">
                      <Badge variant={evt.status === "upcoming" ? "success" : "secondary"}>
                        {evt.status === "upcoming" ? "Akan Datang" : "Selesai"}
                      </Badge>
                    </td>
                    <td className="p-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-2 rounded-full text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] transition-colors cursor-pointer"
                        title="Edit Agenda"
                        aria-label="Edit Agenda"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id, evt.title)}
                        className="p-2 rounded-full text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Agenda"
                        aria-label="Hapus Agenda"
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
        title={editingId ? "Edit Agenda Kegiatan" : "Tambah Agenda Baru"}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              {editingId ? "Simpan Perubahan" : "Tambahkan Agenda"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama / Judul Agenda"
            required
            placeholder="Contoh: Seminar Parenting Nasional"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SchoolEvent["category"])}
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
                onChange={(e) => setStatus(e.target.value as "upcoming" | "completed")}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                <option value="upcoming">Akan Datang (Upcoming)</option>
                <option value="completed">Selesai (Completed)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tanggal Pelaksanaan"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="Waktu Pelaksanaan"
              placeholder="08:00 - 12:30 WIB"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <Input
            label="Lokasi Acara"
            placeholder="Aula Utama Yayasan Yazzakka / Online Zoom"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <ImageUpload
            label="Foto Banner Acara / Kegiatan"
            value={coverImage}
            onChange={(val) => setCoverImage(val)}
            placeholder="https://images.unsplash.com/... atau unggah gambar"
            helperText="Unggah foto flyer/kegiatan (drag & drop) atau tautkan URL gambar."
          />

          <Input
            label="Tautan Pendaftaran (Opsional)"
            placeholder="/pendaftaran atau https://..."
            value={registrationUrl}
            onChange={(e) => setRegistrationUrl(e.target.value)}
          />

          <Textarea
            label="Deskripsi Lengkap Acara"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
