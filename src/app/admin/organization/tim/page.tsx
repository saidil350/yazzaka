"use client";

import React, { useEffect, useState } from "react";
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
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";
import { Skeleton } from "@/components/ui/skeleton";

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
  const {
    organization,
    sections,
    addMember,
    updateMember,
    deleteMember,
    updateSection,
    isLoading,
  } = useSchoolData();
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

  // useState hanya membaca nilai awal — sinkronkan form header saat sections
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setSectionTitle(teamSection.title);
    setSectionSubtitle(teamSection.subtitle);
  }, [teamSection.title, teamSection.subtitle]);

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
    setPhotoUrl("");
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

  const [memberToDelete, setMemberToDelete] = useState<OrganizationMember | null>(null);

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteMember(memberToDelete.id);
      toast("Data pengajar telah dihapus dari sistem.", "info");
    } catch {
      toast("Gagal menghapus data pengajar. Coba lagi.", "error");
    } finally {
      setMemberToDelete(null);
    }
  };

  // Reordering handler: menggeser urutan dalam daftar unit yang sedang aktif.
  // Saat pencarian aktif, pasangan yang bersebelahan di layar tidak
  // bersebelahan dalam urutan unit — reorder dinonaktifkan agar tidak kacau.
  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    if (searchQuery.trim()) {
      toast("Kosongkan kolom pencarian sebelum mengubah urutan.", "error");
      return;
    }
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filteredMembers.length) return;

    const currentMember = filteredMembers[currentIndex];
    const targetMember = filteredMembers[targetIndex];

    const currentOrder = currentMember.orderIndex ?? currentIndex + 1;
    const targetOrder = targetMember.orderIndex ?? targetIndex + 1;

    try {
      // Swap orderIndex
      await updateMember(currentMember.id, { orderIndex: targetOrder });
      await updateMember(targetMember.id, { orderIndex: currentOrder });
      toast("Urutan pengajar berhasil diperbarui!", "success");
    } catch {
      // Rollback best-effort ke nilai semula bila salah satu PUT gagal.
      try {
        await updateMember(currentMember.id, { orderIndex: currentOrder });
        await updateMember(targetMember.id, { orderIndex: targetOrder });
      } catch {
        // Muat ulang halaman untuk memulihkan tampilan dari database.
      }
      toast("Gagal memperbarui urutan pengajar.", "error");
    }
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
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Konten Landing Page / Struktur Pendidik
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Pimpinan &amp; Dewan Asatidz
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola profil lengkap pimpinan yayasan, kepala sekolah, asatidz pengasuh, dan dewan guru berdasarkan unit pendidikan Yazzakka.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="shrink-0">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Tambah Pengajar Baru</span>
        </Button>
      </div>

      {/* ── Statistik Ringkas ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Users className="h-4 w-4 text-primary" />
            <span>Total Pengajar</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <p className="text-2xl font-medium text-foreground">{organization.length}</p>
          )}
          <span className="text-[11px] text-muted-foreground">Seluruh unit yayasan</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Building2 className="h-4 w-4 text-primary" />
            <span>TPA &amp; TKIT</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <p className="text-2xl font-medium text-foreground">{countTpaTkit}</p>
          )}
          <span className="text-[11px] text-muted-foreground">Pendidikan Usia Dini &amp; Quran</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>PKBM &amp; Anak Shalih</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <p className="text-2xl font-medium text-foreground">{countPkbmSekolah}</p>
          )}
          <span className="text-[11px] text-muted-foreground">Sekolah &amp; Kesetaraan</span>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Shield className="h-4 w-4 text-primary" />
            <span>Darul Quran &amp; Pimpinan</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <p className="text-2xl font-medium text-foreground">{countDarulQuran}</p>
          )}
          <span className="text-[11px] text-muted-foreground">Pesantren &amp; Yayasan</span>
        </Card>
      </div>

      {/* ── Pengaturan Header Seksi Publik ──────────── */}
      <Card className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Skeleton className="h-8 w-36" />
            </div>
          </div>
        ) : (
        <form onSubmit={handleSaveSectionHeader} className="space-y-4">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                Teks Judul &amp; Deskripsi Seksi Publik (Halaman Tentang Kami)
              </h3>
            </div>
            <span className="text-[11px] text-success bg-success-bg px-2 py-0.5 rounded-md border border-success/20">
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
            <Button type="submit" disabled={isSavingHeader} size="sm">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              <span>{isSavingHeader ? "Menyimpan..." : "Simpan Teks Seksi"}</span>
            </Button>
          </div>
        </form>
        )}
      </Card>

      {/* ── Toolbar: Filter & Pencarian ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {["Semua", ...PRESET_DEPARTMENTS].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedDept === dept
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border hover:bg-muted"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <Input
            type="text"
            leftIcon={<Search className="h-4 w-4" />}
            placeholder="Cari nama, gelar, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari nama, gelar, atau jabatan"
          />
        </div>
      </div>

      {/* ── Grid Daftar Pengajar ─────────────────────── */}
      {filteredMembers.length === 0 ? (
        <Card className="p-8">
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
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredMembers.map((m, idx) => (
            <Card
              key={m.id}
              className="overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="h-52 relative overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photoUrl}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-medium text-primary uppercase tracking-wider block truncate">
                    {normalizeDepartment(m.department)}
                  </span>
                  <h4 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
                    {m.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {m.roleTitle}
                  </p>
                  {m.qualifications && (
                    <p className="text-[10px] text-muted-foreground italic bg-muted p-1.5 rounded-md border border-border line-clamp-2 font-medium">
                      🎓 {m.qualifications}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground line-clamp-2 pt-2 border-t border-border font-medium leading-relaxed">
                    {m.bio}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-muted/50 border-t border-border flex items-center justify-between gap-1">
                {/* Reorder buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    title="Pindahkan ke Atas"
                    aria-label="Pindahkan ke Atas"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === filteredMembers.length - 1}
                    title="Pindahkan ke Bawah"
                    aria-label="Pindahkan ke Bawah"
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleOpenEdit(m)}
                    title="Edit Profil Pengajar"
                    aria-label="Edit Profil Pengajar"
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setMemberToDelete(m)}
                    className="text-destructive hover:text-destructive"
                    title="Hapus Pengajar"
                    aria-label="Hapus Pengajar"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Card>
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
            <Button variant="accent" onClick={handleSubmit}>
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
            <Select
              label="Departemen / Unit"
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            >
              {PRESET_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="sm:col-span-2">
              <ImageUpload
                label="Foto Profil Resmi Pengajar"
                value={photoUrl}
                onChange={(val) => setPhotoUrl(val)}
                placeholder="https://contoh.com/foto.jpg"
                helperText="Unggah foto formal guru/asatidz (format JPG/PNG/WebP) atau gunakan URL gambar."
                folder="tim"
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

      {/* ── Konfirmasi Hapus Pengajar ─────────────────── */}
      <ConfirmDialog
        isOpen={memberToDelete !== null}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Pengajar?"
        description={
          <>
            Apakah Anda yakin ingin menghapus data{" "}
            <span className="font-medium text-foreground">
              &ldquo;{memberToDelete?.name}&rdquo;
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </>
        }
      />
    </div>
  );
}
