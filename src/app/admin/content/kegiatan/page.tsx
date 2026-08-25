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
    setLocation("Kampus Utama Yazzakka");
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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Content / Kegiatan & Agenda
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
            Manajemen Agenda & Acara
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Jadwal kegiatan akademik, seminar parenting, ujian seleksi, dan kalender acara sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="accent" size="default" className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Tambah Agenda Baru</span>
        </Button>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="p-4 sm:px-6">Nama Agenda & Kategori</th>
                <th className="p-4 sm:px-6">Tanggal & Waktu</th>
                <th className="p-4 sm:px-6">Lokasi</th>
                <th className="p-4 sm:px-6">Status</th>
                <th className="p-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-amber-700 block mb-0.5">
                        {evt.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {evt.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6 text-xs space-y-0.5">
                    <span className="font-semibold text-slate-900 block">
                      {formatDateIndonesian(evt.date)}
                    </span>
                    <span className="text-slate-500">{evt.time}</span>
                  </td>
                  <td className="p-4 sm:px-6 text-xs text-slate-600 font-medium">
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
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id, evt.title)}
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
        title={editingId ? "Edit Agenda Kegiatan" : "Tambah Agenda Baru"}
        maxWidth="lg"
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
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SchoolEvent["category"])}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "upcoming" | "completed")}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
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
            placeholder="Auditorium Kampus Yazzakka / Online Zoom"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Input
            label="URL Foto Banner"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
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
