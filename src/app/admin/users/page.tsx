"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useAuth } from "@/context/AuthContext";
import { User, UserRole } from "@/lib/types";
import {
  Users,
  Shield,
  UserPlus,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Pencil,
  AlertTriangle,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

// ─── Tipe ──────────────────────────────────────────────────────────────────

type ModalMode = "tambah" | "ubah-peran" | "hapus" | null;

// ─── Komponen Badge Peran ──────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "super_admin") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA]">
        <Shield className="h-3 w-3" />
        Super Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#EBF5FB] text-[#2E86C1] border border-[#AED6F1]">
      <Pencil className="h-3 w-3" />
      Editor
    </span>
  );
}

// ─── Avatar Fallback ───────────────────────────────────────────────────────

function UserAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className="h-9 w-9 rounded-full object-cover border-2 border-[#E8E2D8] shadow-2xs shrink-0"
      />
    );
  }

  return (
    <div className="h-9 w-9 rounded-full bg-[#FA6400]/10 border-2 border-[#FED7AA] flex items-center justify-center shrink-0">
      <span className="text-[10px] font-extrabold text-[#FA6400]">{initials}</span>
    </div>
  );
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────

export default function AdminUsersManagementPage() {
  const { users, addUser, updateUserRole, deleteUser, refreshUsers, isLoading } =
    useSchoolData();
  const { role: currentRole, currentUser } = useAuth();

  const isSuperAdmin = currentRole === "super_admin";

  // State modal
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State form tambah
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("editor");
  const [showPassword, setShowPassword] = useState(false);

  // State form ubah peran
  const [newRole, setNewRole] = useState<UserRole>("editor");

  // State UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, []);

  // Refresh data saat mount (ambil dari DB langsung, bukan fallback)
  useEffect(() => {
    refreshUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openTambah = () => {
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("editor");
    setShowPassword(false);
    setFormError("");
    setModalMode("tambah");
  };

  const openUbahPeran = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setFormError("");
    setModalMode("ubah-peran");
  };

  const openHapus = (user: User) => {
    setSelectedUser(user);
    setModalMode("hapus");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setFormError("");
  };

  const handleTambah = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formEmail.trim() || !formPassword) {
      setFormError("Semua kolom wajib diisi.");
      return;
    }
    if (formPassword.length < 8) {
      setFormError("Kata sandi minimal 8 karakter.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addUser({
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword,
        role: formRole,
      });
      showToast("success", `Pengguna "${formName.trim()}" berhasil ditambahkan.`);
      closeModal();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menambahkan pengguna.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUbahPeran = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await updateUserRole(selectedUser.id, newRole);
      showToast(
        "success",
        `Peran "${selectedUser.name}" diperbarui menjadi ${newRole.replace("_", " ")}.`
      );
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengubah peran.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHapus = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await deleteUser(selectedUser.id);
      showToast("success", `Pengguna "${selectedUser.name}" berhasil dihapus.`);
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus pengguna.";
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    await refreshUsers();
    showToast("success", "Data pengguna berhasil diperbarui.");
  };

  // ── Matriks Peran ─────────────────────────────────────────────────────────

  const rolesMatrix = [
    {
      role: "super_admin",
      title: "Super Admin",
      icon: <Shield className="h-4 w-4" />,
      color: "text-[#FA6400]",
      bg: "bg-[#FFF0E5] border-[#FED7AA]",
      activeBg: "bg-[#FFF0E5] border-[#FED7AA] ring-2 ring-[#FA6400]/20",
      desc: "Akses mutlak ke seluruh modul CMS, pengaturan identitas lembaga, SEO, database & manajemen pengguna.",
    },
    {
      role: "editor",
      title: "Editor Konten",
      icon: <Pencil className="h-4 w-4" />,
      color: "text-[#2E86C1]",
      bg: "bg-[#EBF5FB] border-[#AED6F1]",
      activeBg: "bg-[#EBF5FB] border-[#AED6F1] ring-2 ring-[#2E86C1]/20",
      desc: "Mengelola konten publikasi seperti program pendidikan, fasilitas, prestasi, testimoni, berita & agenda kegiatan.",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Toast Notifikasi */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg border text-sm font-semibold transition-all animate-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-[#E6F4EA] border-[#BDE7CC] text-[#15803D]"
              : "bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Users &amp; Access Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Pengguna &amp; Hak Akses (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Daftar staf pengelola CMS dengan peran dan izin yang disesuaikan menurut
            tupoksi masing-masing.
          </p>
        </div>

        {/* Tombol Aksi Header */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            id="btn-refresh-users"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Perbarui
          </Button>
          {isSuperAdmin && (
            <Button
              size="sm"
              onClick={openTambah}
              id="btn-tambah-pengguna"
            >
              <UserPlus className="h-4 w-4" />
              Tambah Pengguna
            </Button>
          )}
        </div>
      </div>

      {/* Role Matrix Card */}
      <div className="bg-white rounded-xl p-6 border border-[#E8E2D8] shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-base text-[#1E2330]">
            Hak Akses per Peran (RBAC)
          </h3>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Peran ditetapkan oleh administrator dan divalidasi di sisi server. Perubahan
            peran hanya dapat dilakukan oleh Super Admin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {rolesMatrix.map((item) => {
            const isCurrent = currentRole === item.role;
            return (
              <div
                key={item.role}
                className={`p-5 rounded-lg border transition-all flex flex-col justify-between space-y-3 ${
                  isCurrent ? item.activeBg : item.bg
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 font-bold text-sm text-[#1E2330]`}>
                      <span className={item.color}>{item.icon}</span>
                      {item.title}
                    </div>
                    {isCurrent && (
                      <Badge variant="accent" className="text-[10px] font-bold">
                        Peran Anda
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabel Pengguna */}
      <div className="bg-white rounded-xl border border-[#E8E2D8] overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-[#E8E2D8] bg-[#FAF6EE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#FFF0E5] border border-[#FED7AA] flex items-center justify-center">
              <Users className="h-4.5 w-4.5 text-[#FA6400]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1E2330]">
                Daftar Akun Pengguna Terdaftar
              </h3>
              <p className="text-xs text-stone-400 font-medium">
                {users.length} pengguna terdaftar
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-7 w-7 rounded-full border-2 border-[#FA6400] border-t-transparent animate-spin" />
            <p className="text-xs font-semibold text-stone-400">
              Memuat data pengguna dari database…
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-400">
            <Users className="h-10 w-10 opacity-30" />
            <p className="text-sm font-semibold">Belum ada pengguna terdaftar.</p>
            {isSuperAdmin && (
              <Button size="sm" onClick={openTambah}>
                <UserPlus className="h-4 w-4" />
                Tambah Pengguna Pertama
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6EE] border-b border-[#E8E2D8] text-xs font-bold uppercase text-stone-500">
                <tr>
                  <th className="p-4 sm:px-6">Pengguna</th>
                  <th className="p-4 sm:px-6">Email</th>
                  <th className="p-4 sm:px-6">Peran (Role)</th>
                  <th className="p-4 sm:px-6">Terdaftar Sejak</th>
                  {isSuperAdmin && (
                    <th className="p-4 sm:px-6 text-right">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
                {users.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-[#FFF9F2] transition-colors"
                    >
                      {/* Pengguna */}
                      <td className="p-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={u.name} avatarUrl={u.avatarUrl} />
                          <div>
                            <span className="font-bold text-[#1E2330] block text-sm">
                              {u.name}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] font-bold text-[#FA6400] uppercase tracking-wider">
                                Akun Anda
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 sm:px-6 text-xs font-mono text-stone-600">
                        {u.email}
                      </td>

                      {/* Peran */}
                      <td className="p-4 sm:px-6">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Terdaftar */}
                      <td className="p-4 sm:px-6 text-xs text-stone-500 font-medium whitespace-nowrap">
                        {u.createdAt || "—"}
                      </td>

                      {/* Aksi */}
                      {isSuperAdmin && (
                        <td className="p-4 sm:px-6">
                          <div className="flex items-center justify-end gap-2">
                            {/* Ubah Peran */}
                            <button
                              onClick={() => openUbahPeran(u)}
                              disabled={isSelf}
                              title={isSelf ? "Tidak dapat mengubah peran sendiri" : "Ubah peran"}
                              id={`btn-ubah-peran-${u.id}`}
                              className="h-8 w-8 rounded-xl flex items-center justify-center border border-[#E8E2D8] bg-white text-stone-500 transition-all hover:bg-[#EBF5FB] hover:text-[#2E86C1] hover:border-[#AED6F1] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>

                            {/* Hapus */}
                            <button
                              onClick={() => openHapus(u)}
                              disabled={isSelf}
                              title={isSelf ? "Tidak dapat menghapus akun sendiri" : "Hapus pengguna"}
                              id={`btn-hapus-${u.id}`}
                              className="h-8 w-8 rounded-xl flex items-center justify-center border border-[#E8E2D8] bg-white text-stone-500 transition-all hover:bg-[#FEE2E2] hover:text-[#B91C1C] hover:border-[#FCA5A5] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL — TAMBAH PENGGUNA
      ════════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modalMode === "tambah"}
        onClose={closeModal}
        title="Tambah Pengguna Baru"
        description="Isi formulir berikut untuk membuat akun pengelola CMS baru. Kata sandi akan di-hash secara aman sebelum disimpan."
        maxWidth="lg"
        footer={
          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              form="form-tambah-user"
              type="submit"
              isLoading={isSubmitting}
              id="btn-submit-tambah"
              className="flex-1"
            >
              <UserPlus className="h-4 w-4" />
              Buat Pengguna
            </Button>
          </div>
        }
      >
        <form
          id="form-tambah-user"
          onSubmit={handleTambah}
          className="space-y-4"
          noValidate
        >
          {/* Nama */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-nama"
              className="text-xs font-bold text-[#1E2330] uppercase tracking-wide"
            >
              Nama Lengkap <span className="text-[#FA6400]">*</span>
            </label>
            <Input
              id="input-nama"
              type="text"
              placeholder="cth. Ahmad Fauzan"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-email"
              className="text-xs font-bold text-[#1E2330] uppercase tracking-wide"
            >
              Alamat Email <span className="text-[#FA6400]">*</span>
            </label>
            <Input
              id="input-email"
              type="email"
              placeholder="cth. ahmad@yazzakka.id"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="input-password"
              className="text-xs font-bold text-[#1E2330] uppercase tracking-wide"
            >
              Kata Sandi <span className="text-[#FA6400]">*</span>
            </label>
            <div className="relative">
              <Input
                id="input-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-stone-400 font-medium">
              Kata sandi akan dienkripsi sebelum disimpan ke database.
            </p>
          </div>

          {/* Peran */}
          <div className="space-y-1.5">
            <label
              htmlFor="select-role"
              className="text-xs font-bold text-[#1E2330] uppercase tracking-wide"
            >
              Peran (Role) <span className="text-[#FA6400]">*</span>
            </label>
            <select
              id="select-role"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as UserRole)}
              className="w-full h-10 px-3.5 rounded-xl border border-[#E8E2D8] bg-white text-sm text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/30 focus:border-[#FA6400] transition-all"
            >
              <option value="editor">Editor Konten</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {/* Error */}
          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-xs font-semibold text-[#B91C1C]">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-px" />
              <span>{formError}</span>
            </div>
          )}
        </form>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL — UBAH PERAN
      ════════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modalMode === "ubah-peran"}
        onClose={closeModal}
        title="Ubah Peran Pengguna"
        description={
          selectedUser
            ? `Pilih peran baru untuk akun "${selectedUser.name}" (${selectedUser.email}).`
            : "Pilih peran baru."
        }
        maxWidth="sm"
        footer={
          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              onClick={handleUbahPeran}
              isLoading={isSubmitting}
              id="btn-submit-ubah-peran"
              className="flex-1"
              disabled={selectedUser?.role === newRole}
            >
              Simpan Perubahan
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Peran saat ini */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FAF6EE] border border-[#E8E2D8]">
            <UserAvatar name={selectedUser?.name || ""} avatarUrl={selectedUser?.avatarUrl} />
            <div>
              <p className="text-sm font-bold text-[#1E2330]">{selectedUser?.name}</p>
              <p className="text-xs text-stone-500 font-mono">{selectedUser?.email}</p>
            </div>
          </div>

          {/* Pilih peran */}
          <div className="space-y-2">
            {(["super_admin", "editor"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setNewRole(r)}
                id={`role-option-${r}`}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  newRole === r
                    ? r === "super_admin"
                      ? "bg-[#FFF0E5] border-[#FED7AA] ring-2 ring-[#FA6400]/20"
                      : "bg-[#EBF5FB] border-[#AED6F1] ring-2 ring-[#2E86C1]/20"
                    : "bg-[#FAF6EE] border-[#E8E2D8] hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      r === "super_admin"
                        ? "bg-[#FA6400]/10 text-[#FA6400]"
                        : "bg-[#2E86C1]/10 text-[#2E86C1]"
                    }`}
                  >
                    {r === "super_admin" ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <Pencil className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E2330]">
                      {r === "super_admin" ? "Super Admin" : "Editor Konten"}
                    </p>
                    <p className="text-xs text-stone-400 font-medium">
                      {r === "super_admin"
                        ? "Akses penuh ke seluruh CMS"
                        : "Kelola konten publikasi"}
                    </p>
                  </div>
                </div>
                {newRole === r && (
                  <Check
                    className={`h-5 w-5 shrink-0 ${
                      r === "super_admin" ? "text-[#FA6400]" : "text-[#2E86C1]"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-xs font-semibold text-[#B91C1C]">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-px" />
              <span>{formError}</span>
            </div>
          )}
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL — KONFIRMASI HAPUS
      ════════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modalMode === "hapus"}
        onClose={closeModal}
        title="Hapus Pengguna"
        description="Tindakan ini tidak dapat dibatalkan. Akun yang dihapus tidak dapat dipulihkan kembali."
        maxWidth="sm"
        footer={
          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleHapus}
              isLoading={isSubmitting}
              id="btn-konfirmasi-hapus"
              className="flex-1"
            >
              <Trash2 className="h-4 w-4" />
              Ya, Hapus Pengguna
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Peringatan */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FEF9E7] border border-[#F9E79F]">
            <AlertTriangle className="h-5 w-5 text-[#D68910] shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-[#7D6608] leading-relaxed">
              Anda akan menghapus pengguna berikut secara permanen dari sistem.
            </p>
          </div>

          {/* Info pengguna */}
          {selectedUser && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FAF6EE] border border-[#E8E2D8]">
              <UserAvatar name={selectedUser.name} avatarUrl={selectedUser.avatarUrl} />
              <div>
                <p className="text-sm font-bold text-[#1E2330]">{selectedUser.name}</p>
                <p className="text-xs text-stone-500 font-mono">{selectedUser.email}</p>
                <RoleBadge role={selectedUser.role} />
              </div>
            </div>
          )}

          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-xs font-semibold text-[#B91C1C]">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-px" />
              <span>{formError}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
