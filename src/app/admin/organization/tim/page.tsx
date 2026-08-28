"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { OrganizationMember } from "@/lib/types";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  ArrowUp,
  ArrowDown,
  GraduationCap,
  Building2,
  Shield,
  Save,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";

const PRESET_DEPARTMENTS = [
  "Taman Pendidikan Al-Qur'an (TPA)",
  "TKIT Yazzakka",
  "PKBM Yazzakka",
  "Sekolah Anak Shalih Yazzakka",
  "Darul Quran Yazzakka",
  "Pimpinan Yayasan",
  "Staf Administrasi & Tata Usaha",
];

// Helper untuk memetakan nama departemen lama ke format unit pendidikan Yazzakka
function normalizeDepartment(deptName: string): string {
  if (!deptName) return "Taman Pendidikan Al-Qur'an (TPA)";
  if (PRESET_DEPARTMENTS.includes(deptName)) return deptName;

  if (deptName.includes("TPA") || deptName.includes("Al-Qur'an")) {
    return "Taman Pendidikan Al-Qur'an (TPA)";
  }
  if (deptName.includes("TKIT") || deptName.includes("TK")) {
    return "TKIT Yazzakka";
  }
  if (deptName.includes("PKBM")) {
    return "PKBM Yazzakka";
  }
  if (deptName.includes("Sekolah Anak Shalih") || deptName.includes("SMA") || deptName.includes("Pendidik") || deptName.includes("Guru")) {
    return "Sekolah Anak Shalih Yazzakka";
  }
  if (deptName.includes("Darul Quran") || deptName.includes("Asrama") || deptName.includes("Pesantren") || deptName.includes("Pengasuhan")) {
    return "Darul Quran Yazzakka";
  }
  if (deptName.includes("Pimpinan") || deptName.includes("Yayasan")) {
    return "Pimpinan Yayasan";
  }
  return "Taman Pendidikan Al-Qur'an (TPA)";
}

export default function AdminTeamMembersPage() {
  const { organization, sections, addMember, updateMember, deleteMember, updateSection } =
    useSchoolData();
  const { toast } = useToast();

  // Ambil konfigurasi seksi organisasi
  const teamSection = sections.find(
    (s) => s.key === "organization" || s.id === "sec-team"
  ) || {
    id: "sec-team",
    key: "organization",
    title: "Pimpinan & Dewan Asatidz",
    subtitle:
      "Pendidik berdedikasi tinggi yang memadukan kedalaman tradisi keilmuan Islam dan kompetensi sains modern.",
    isEnabled: true,
    orderIndex: 10,
  };

  // State untuk form header seksi
  const [sectionTitle, setSectionTitle] = useState(teamSection.title);
  const [sectionSubtitle, setSectionSubtitle] = useState(teamSection.subtitle);
  const [isSavingHeader, setIsSavingHeader] = useState(false);

  // State pencarian & filter departemen
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("Semua");

  // Modal & Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [department, setDepartment] = useState("Taman Pendidikan Al-Qur'an (TPA)");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);

  // Simpan pengaturan judul & deskripsi seksi
  const handleSaveSectionHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHeader(true);
    try {
      await updateSection(teamSection.id, {
        title: sectionTitle,
        subtitle: sectionSubtitle,
      });
      toast("Judul dan deskripsi seksi publik berhasil disimpan!", "success");
    } catch {
      toast("Gagal menyimpan konfigurasi seksi", "error");
    } finally {
      setIsSavingHeader(false);
    }
  };

  const handleDepartmentChange = (newDept: string) => {
    setDepartment(newDept);
    // Otomatis sesuaikan urutan tampilan ke urutan berikutnya di unit yang dipilih
    const membersInDept = organization.filter(
      (m) => normalizeDepartment(m.department) === newDept && m.id !== editingId
    );
    setOrderIndex(membersInDept.length + 1);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setRoleTitle("");
    const initialDept =
      selectedDept === "Semua" ? "Taman Pendidikan Al-Qur'an (TPA)" : selectedDept;
    setDepartment(initialDept);
    const membersInDept = organization.filter(
      (m) => normalizeDepartment(m.department) === initialDept
    );
    setOrderIndex(membersInDept.length + 1);
    setPhotoUrl(
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    );
    setBio("");
    setQualifications("");
    setModalOpen(true);
  };

  const handleOpenEdit = (m: OrganizationMember) => {
    setEditingId(m.id);
    setName(m.name);
    setRoleTitle(m.roleTitle);
    setDepartment(normalizeDepartment(m.department));
    setPhotoUrl(m.photoUrl);
    setBio(m.bio);
    setQualifications(m.qualifications);
    setOrderIndex(m.orderIndex ?? 1);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roleTitle.trim()) {
      toast("Nama dan jabatan pengajar wajib diisi.", "error");
      return;
    }

    const payload = {
      name: name.trim(),
      roleTitle: roleTitle.trim(),
      department: department.trim(),
      photoUrl: photoUrl.trim(),
      bio: bio.trim(),
      qualifications: qualifications.trim(),
      orderIndex: Number(orderIndex) || 1,
    };

    try {
      if (editingId) {
        await updateMember(editingId, payload);
        toast("Profil pengajar/asatidz berhasil diperbarui!", "success");
      } else {
        await addMember(payload);
        toast("Pengajar baru berhasil ditambahkan!", "success");
      }
      setModalOpen(false);
    } catch {
      toast("Gagal menyimpan data pengajar.", "error");
    }
  };

  const handleDelete = (id: string, mName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data "${mName}"?`)) {
      deleteMember(id);
      toast("Data pengajar telah dihapus dari sistem.", "info");
    }
  };

  // Reordering handler: menggeser urutan dalam daftar unit yang sedang aktif
  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filteredMembers.length) return;

    const currentMember = filteredMembers[currentIndex];
    const targetMember = filteredMembers[targetIndex];

    const currentOrder = currentMember.orderIndex ?? currentIndex + 1;
    const targetOrder = targetMember.orderIndex ?? targetIndex + 1;

    // Swap orderIndex
    await updateMember(currentMember.id, { orderIndex: targetOrder });
    await updateMember(targetMember.id, { orderIndex: currentOrder });
    toast("Urutan pengajar berhasil diperbarui!", "success");
  };

  // Sort & Filter: kelompokkan per unit jika melihat 'Semua', dan urutkan berdasarkan orderIndex
  const sortedMembers = [...organization].sort((a, b) => {
    const deptA = normalizeDepartment(a.department);
    const deptB = normalizeDepartment(b.department);

    if (selectedDept === "Semua") {
      const idxA = PRESET_DEPARTMENTS.indexOf(deptA);
      const idxB = PRESET_DEPARTMENTS.indexOf(deptB);
      if (idxA !== idxB) {
        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
      }
    }

    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
  });

  const filteredMembers = sortedMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.qualifications?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDept === "Semua"
        ? true
        : normalizeDepartment(m.department) === selectedDept;

    return matchesSearch && matchesDept;
  });

  // Statistik Unit
  const countTpaTkit = organization.filter(
    (m) =>
      m.department.includes("TPA") ||
      m.department.includes("TKIT") ||
      m.department.includes("Al-Qur'an")
  ).length;
  const countPkbmSekolah = organization.filter(
    (m) =>
      m.department.includes("PKBM") ||
      m.department.includes("Sekolah Anak Shalih") ||
      m.department.includes("Guru")
  ).length;
  const countDarulQuran = organization.filter(
    (m) =>
      m.department.includes("Darul Quran") ||
      m.department.includes("Pimpinan") ||
      m.department.includes("Asrama")
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Konten Landing Page / Struktur Pendidik
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Pimpinan &amp; Dewan Asatidz
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Kelola profil lengkap pimpinan yayasan, kepala sekolah, asatidz pengasuh, dan dewan guru berdasarkan unit pendidikan Yazzakka.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="default"
          size="default"
          className="shrink-0 font-bold h-11 px-6 shadow-sm bg-[#FA6400] hover:bg-[#E05A00] text-white cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Tambah Pengajar Baru</span>
        </Button>
      </div>

      {/* ── Statistik Ringkas ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold mb-1">
            <Users className="h-4 w-4 text-[#FA6400]" />
            <span>Total Pengajar</span>
          </div>
          <p className="text-2xl font-black text-[#1E2330]">{organization.length}</p>
          <span className="text-[11px] text-stone-400">Seluruh unit yayasan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold mb-1">
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span>TPA &amp; TKIT</span>
          </div>
          <p className="text-2xl font-black text-[#1E2330]">{countTpaTkit}</p>
          <span className="text-[11px] text-stone-400">Pendidikan Usia Dini &amp; Quran</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold mb-1">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            <span>PKBM &amp; Anak Shalih</span>
          </div>
          <p className="text-2xl font-black text-[#1E2330]">{countPkbmSekolah}</p>
          <span className="text-[11px] text-stone-400">Sekolah &amp; Kesetaraan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E2D8] shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-bold mb-1">
            <Shield className="h-4 w-4 text-purple-600" />
            <span>Darul Quran &amp; Pimpinan</span>
          </div>
          <p className="text-2xl font-black text-[#1E2330]">{countDarulQuran}</p>
          <span className="text-[11px] text-stone-400">Pesantren &amp; Yayasan</span>
        </div>
      </div>

      {/* ── Pengaturan Header Seksi Publik ──────────── */}
      <form
        onSubmit={handleSaveSectionHeader}
        className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#FA6400]" />
            <h3 className="font-bold text-sm text-[#1E2330]">
              Teks Judul &amp; Deskripsi Seksi Publik (Halaman Tentang Kami)
            </h3>
          </div>
          <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
            Tersinkronisasi ke Landing Page
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <Input
              label="Judul Utama Seksi"
              placeholder="Contoh: Pimpinan & Dewan Asatidz"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Sub-judul / Penjelasan Seksi"
              placeholder="Contoh: Pendidik berdedikasi tinggi yang memadukan..."
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={isSavingHeader}
            variant="default"
            size="sm"
            className="font-bold bg-[#1E2330] hover:bg-black text-white cursor-pointer shadow-2xs"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            <span>{isSavingHeader ? "Menyimpan..." : "Simpan Teks Seksi"}</span>
          </Button>
        </div>
      </form>

      {/* ── Toolbar: Filter & Pencarian ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {["Semua", ...PRESET_DEPARTMENTS].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedDept === dept
                  ? "bg-[#1E2330] text-white shadow-2xs"
                  : "bg-white text-stone-600 border border-[#E8E2D8] hover:bg-[#FAF6EE]"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Cari nama, gelar, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8E2D8] bg-white text-xs text-[#1E2330] placeholder:text-stone-400 focus:outline-none focus:border-[#FA6400] transition-colors"
          />
        </div>
      </div>

      {/* ── Grid Daftar Pengajar ─────────────────────── */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border border-[#E8E2D8] shadow-xs">
          <EmptyState
            icon={Users}
            title={
              searchQuery
                ? `Tidak ada pengajar yang cocok dengan "${searchQuery}"`
                : "Belum Ada Data Guru / Asatidz"
            }
            description="Tambahkan profil pengajar, pembina asrama, atau pimpinan yayasan pertama Anda."
            action={{
              label: "Tambah Pengajar Baru",
              onClick: handleOpenAdd,
              icon: Plus,
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredMembers.map((m, idx) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="h-52 relative overflow-hidden bg-[#FAF6EE]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#FA6400] uppercase tracking-wider block truncate">
                    {normalizeDepartment(m.department)}
                  </span>
                  <h4 className="font-bold text-sm text-[#1E2330] leading-snug line-clamp-2 min-h-[2.5rem]">
                    {m.name}
                  </h4>
                  <p className="text-xs text-stone-600 font-bold">
                    {m.roleTitle}
                  </p>
                  {m.qualifications && (
                    <p className="text-[10px] text-stone-500 italic bg-[#FAF6EE] p-1.5 rounded-lg border border-[#E8E2D8]/60 line-clamp-2 font-medium">
                      🎓 {m.qualifications}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-500 line-clamp-2 pt-2 border-t border-[#E8E2D8] font-medium leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-[#FAF6EE]/50 border-t border-[#E8E2D8] flex items-center justify-between gap-1">
                {/* Reorder buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-white hover:text-[#FA6400] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-500 transition-colors cursor-pointer"
                    title="Pindahkan ke Atas"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === filteredMembers.length - 1}
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-white hover:text-[#FA6400] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-stone-500 transition-colors cursor-pointer"
                    title="Pindahkan ke Bawah"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] transition-colors cursor-pointer"
                    title="Edit Profil Pengajar"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.name)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus Pengajar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Tambah / Edit Pengajar ─────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Profil Pengajar / Asatidz" : "Tambah Pengajar Baru"}
        maxWidth="2xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent"
              onClick={handleSubmit}
              className="font-bold bg-[#FA6400] hover:bg-[#E05A00] text-white cursor-pointer"
            >
              {editingId ? "Simpan Perubahan" : "Tambahkan Pengajar"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap & Gelar Akademik"
            required
            placeholder="Contoh: Dr. KH. Ahmad Zaki Mubarak, Lc., M.Phil."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Jabatan / Bidang Pengampu"
              required
              placeholder="Contoh: Pimpinan & Pengasuh Pesantren"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Departemen / Unit
              </label>
              <select
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:border-[#FA6400]"
              >
                {PRESET_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="sm:col-span-2">
              <ImageUpload
                label="Foto Profil Resmi Pengajar"
                value={photoUrl}
                onChange={(val) => setPhotoUrl(val)}
                placeholder="https://images.unsplash.com/... atau unggah file foto"
                helperText="Unggah foto formal guru/asatidz (format JPG/PNG/WebP) atau gunakan URL gambar."
              />
            </div>
            <div>
              <Input
                label="Nomor Urutan Tampilan"
                type="number"
                min={1}
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                helperText={`Urutan prioritas di unit ${department}.`}
              />
            </div>
          </div>

          <Input
            label="Riwayat Pendidikan & Kualifikasi Ijazah"
            placeholder="Contoh: S1 Syari'ah (Al-Azhar), S2 Islamic Studies (Leiden), S3 Pendidikan Islam"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
          />

          <Textarea
            label="Biografi / Profil Pengabdian Singkat"
            rows={3}
            placeholder="Tuliskan pengalaman, rekam jejak, dan dedikasi pengajar..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
