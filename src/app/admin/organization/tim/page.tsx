"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { OrganizationMember } from "@/lib/types";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";

export default function AdminTeamMembersPage() {
  const { organization, addMember, updateMember, deleteMember } = useSchoolData();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState<OrganizationMember["department"]>(
    "Tenaga Pendidik (Guru)"
  );
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");

  const departments: OrganizationMember["department"][] = [
    "Pimpinan Yayasan & Sekolah",
    "Tenaga Pendidik (Guru)",
    "Kepengasuhan Asrama",
    "Staf Administrasi",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setRoleTitle("");
    setDepartment("Tenaga Pendidik (Guru)");
    setPhotoUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80");
    setBio("");
    setQualifications("");
    setModalOpen(true);
  };

  const handleOpenEdit = (m: OrganizationMember) => {
    setEditingId(m.id);
    setName(m.name);
    setRoleTitle(m.roleTitle);
    setDepartment(m.department);
    setPhotoUrl(m.photoUrl);
    setBio(m.bio);
    setQualifications(m.qualifications);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !roleTitle) {
      toast("Nama dan jabatan guru wajib diisi.", "error");
      return;
    }

    if (editingId) {
      updateMember(editingId, {
        name,
        roleTitle,
        department,
        photoUrl,
        bio,
        qualifications,
      });
      toast("Data pendidik berhasil diperbarui!", "success");
    } else {
      addMember({
        name,
        roleTitle,
        department,
        photoUrl,
        bio,
        qualifications,
        orderIndex: organization.length + 1,
      });
      toast("Pendidik baru berhasil ditambahkan!", "success");
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, mName: string) => {
    if (confirm(`Hapus anggota/guru "${mName}"?`)) {
      deleteMember(id);
      toast("Data telah dihapus.", "info");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Organization / Tim & Pendidik
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
            Manajemen Dewan Guru & Asatidz
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar tenaga pengajar, kualifikasi ijazah, bidang pengasuhan, dan profil singkat asatidz.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="accent" size="default" className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Tambah Guru / Pendidik</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {organization.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="h-48 relative overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.photoUrl}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  {m.department}
                </span>
                <h4 className="font-bold text-sm text-[var(--color-primary)] leading-snug">
                  {m.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {m.roleTitle}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 pt-1 border-t border-slate-100">
                  {m.bio}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(m)}
                className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(m.id, m.name)}
                className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Guru / Pendidik" : "Tambah Guru Baru"}
        maxWidth="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              {editingId ? "Simpan Perubahan" : "Tambahkan Guru"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap & Gelar Akademik"
            required
            placeholder="Contoh: Drs. H. M. Furqon, M.Pd."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Jabatan / Bidang Studi"
              required
              placeholder="Contoh: Koordinator Olimpiade Sains"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Departemen / Unit
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as OrganizationMember["department"])}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="URL Foto Profil"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />

          <Input
            label="Riwayat Pendidikan & Kualifikasi Ijazah"
            placeholder="Contoh: S1 Fisika (UNNES), S2 Manajemen Pendidikan (UNY)"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
          />

          <Textarea
            label="Biografi / Profil Singkat"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
