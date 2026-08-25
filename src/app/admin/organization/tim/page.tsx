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
import { EmptyState } from "@/components/ui/empty-state";

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
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Organization / Tim &amp; Pendidik
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Dewan Guru &amp; Asatidz
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Daftar tenaga pengajar, kualifikasi ijazah, bidang pengasuhan, dan profil singkat asatidz.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-bold h-11 px-6 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Tambah Guru / Pendidik</span>
        </Button>
      </div>

      {/* Grid or EmptyState */}
      {organization.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-xs">
          <EmptyState
            icon={Users}
            title="Belum Ada Data Guru / Asatidz"
            description="Tambahkan profil pengajar, pembina asrama, atau pimpinan sekolah pertama Anda."
            action={{
              label: "Tambah Guru / Pendidik",
              onClick: handleOpenAdd,
              icon: Plus,
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {organization.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-[#FAF6EE]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#FA6400] uppercase tracking-wider block">
                    {m.department}
                  </span>
                  <h4 className="font-bold text-sm text-[#1E2330] leading-snug">
                    {m.name}
                  </h4>
                  <p className="text-xs text-stone-500 font-bold">
                    {m.roleTitle}
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-2 pt-2 border-t border-[#E8E2D8] font-medium">
                    {m.bio}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#E8E2D8] flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="p-2 rounded-xl text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] transition-colors cursor-pointer"
                  title="Edit Pendidik"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id, m.name)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus Pendidik"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
