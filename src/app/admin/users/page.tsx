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
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// ─── Tipe ──────────────────────────────────────────────────────────────────

type ModalMode = "tambah" | "ubah-peran" | "hapus" | null;

// ─── Komponen Badge Peran ──────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "super_admin") {
    return (
      <Badge variant="default" className="gap-1.5">
        <Shield className="h-3 w-3" />
        Super Admin
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1.5">
      <Pencil className="h-3 w-3" />
      Editor
    </Badge>
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
        className="h-9 w-9 rounded-full object-cover border border-border shrink-0"
      />
    );
  }

  return (
    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
      <span className="text-[10px] font-medium">{initials}</span>
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
      color: "text-primary",
      bg: "bg-muted border-border",
      activeBg: "bg-muted border-border ring-2 ring-primary/20",
      desc: "Akses mutlak ke seluruh modul CMS, pengaturan identitas lembaga, SEO, database & manajemen pengguna.",
    },
    {
      role: "editor",
      title: "Editor Konten",
      icon: <Pencil className="h-4 w-4" />,
      color: "text-info",
      bg: "bg-muted border-border",
      activeBg: "bg-muted border-border ring-2 ring-info/20",
      desc: "Mengelola konten publikasi seperti program pendidikan, fasilitas, prestasi, testimoni, berita & agenda kegiatan.",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Toast Notifikasi */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-lg border text-sm font-semibold transition-colors animate-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-success-bg border-success/20 text-success"
              : "bg-danger-bg border-destructive/20 text-destructive"
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
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Users &amp; Access Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Manajemen Pengguna &amp; Hak Akses (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-base text-foreground">
            Hak Akses per Peran (RBAC)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
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
                className={`p-5 rounded-lg border transition-colors flex flex-col justify-between space-y-3 ${
                  isCurrent ? item.activeBg : item.bg
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 font-medium text-sm text-foreground`}>
                      <span className={item.color}>{item.icon}</span>
                      {item.title}
                    </div>
                    {isCurrent && (
                      <Badge variant="outline" className="text-[10px] bg-warning-bg border-warning/20 text-warning">
                        Peran Anda
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tabel Pengguna */}
      <Card className="overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border bg-muted flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground">
                Daftar Akun Pengguna Terdaftar
              </h3>
              <p className="text-xs text-muted-foreground">
                {users.length} pengguna terdaftar
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-xs font-medium text-muted-foreground">
              Memuat data pengguna dari database…
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Users className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">Belum ada pengguna terdaftar.</p>
            {isSuperAdmin && (
              <Button size="sm" onClick={openTambah}>
                <UserPlus className="h-4 w-4" />
                Tambah Pengguna Pertama
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 sm:px-6">Pengguna</TableHead>
                <TableHead className="p-4 sm:px-6">Email</TableHead>
                <TableHead className="p-4 sm:px-6">Peran (Role)</TableHead>
                <TableHead className="p-4 sm:px-6">Terdaftar Sejak</TableHead>
                {isSuperAdmin && (
                  <TableHead className="p-4 sm:px-6 text-right">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <TableRow key={u.id}>
                    {/* Pengguna */}
                    <TableCell className="p-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} avatarUrl={u.avatarUrl} />
                        <div>
                          <span className="font-medium text-foreground block text-sm">
                            {u.name}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
                              Akun Anda
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="p-4 sm:px-6 text-xs font-mono text-muted-foreground">
                      {u.email}
                    </TableCell>

                    {/* Peran */}
                    <TableCell className="p-4 sm:px-6">
                      <RoleBadge role={u.role} />
                    </TableCell>

                    {/* Terdaftar */}
                    <TableCell className="p-4 sm:px-6 text-xs text-muted-foreground whitespace-nowrap">
                      {u.createdAt || "—"}
                    </TableCell>

                    {/* Aksi */}
                    {isSuperAdmin && (
                      <TableCell className="p-4 sm:px-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* Ubah Peran */}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openUbahPeran(u)}
                            disabled={isSelf}
                            title={isSelf ? "Tidak dapat mengubah peran sendiri" : "Ubah peran"}
                            aria-label={isSelf ? "Tidak dapat mengubah peran sendiri" : "Ubah peran"}
                            id={`btn-ubah-peran-${u.id}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          {/* Hapus */}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openHapus(u)}
                            disabled={isSelf}
                            title={isSelf ? "Tidak dapat menghapus akun sendiri" : "Hapus pengguna"}
                            aria-label={isSelf ? "Tidak dapat menghapus akun sendiri" : "Hapus pengguna"}
                            id={`btn-hapus-${u.id}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

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
          <Input
            id="input-nama"
            label="Nama Lengkap"
            type="text"
            placeholder="cth. Ahmad Fauzan"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            autoComplete="name"
          />

          {/* Email */}
          <Input
            id="input-email"
            label="Alamat Email"
            type="email"
            placeholder="cth. ahmad@yazzakka.id"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
            autoComplete="email"
          />

          {/* Password */}
          <div className="space-y-1.5">
            <div className="relative">
              <Input
                id="input-password"
                label="Kata Sandi"
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
                className="absolute right-3 top-7 text-muted-foreground hover:text-foreground transition-colors"
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
            <p className="text-[10px] text-muted-foreground">
              Kata sandi akan dienkripsi sebelum disimpan ke database.
            </p>
          </div>

          {/* Peran */}
          <Select
            id="select-role"
            label="Peran (Role)"
            required
            value={formRole}
            onChange={(e) => setFormRole(e.target.value as UserRole)}
          >
            <option value="editor">Editor Konten</option>
            <option value="super_admin">Super Admin</option>
          </Select>

          {/* Error */}
          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-danger-bg border border-destructive/20 text-xs font-medium text-destructive">
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
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted border border-border">
            <UserAvatar name={selectedUser?.name || ""} avatarUrl={selectedUser?.avatarUrl} />
            <div>
              <p className="text-sm font-medium text-foreground">{selectedUser?.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{selectedUser?.email}</p>
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
                className={`w-full flex items-center justify-between p-4 rounded-lg border text-left transition-colors ${
                  newRole === r
                    ? r === "super_admin"
                      ? "bg-primary/10 border-primary/20 ring-2 ring-primary/20"
                      : "bg-info/10 border-info/20 ring-2 ring-info/20"
                    : "bg-muted border-border hover:bg-card"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      r === "super_admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-info/10 text-info"
                    }`}
                  >
                    {r === "super_admin" ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <Pencil className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {r === "super_admin" ? "Super Admin" : "Editor Konten"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r === "super_admin"
                        ? "Akses penuh ke seluruh CMS"
                        : "Kelola konten publikasi"}
                    </p>
                  </div>
                </div>
                {newRole === r && (
                  <Check
                    className={`h-5 w-5 shrink-0 ${
                      r === "super_admin" ? "text-primary" : "text-info"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-danger-bg border border-destructive/20 text-xs font-medium text-destructive">
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
          <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-bg border border-warning/20">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-foreground leading-relaxed">
              Anda akan menghapus pengguna berikut secara permanen dari sistem.
            </p>
          </div>

          {/* Info pengguna */}
          {selectedUser && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted border border-border">
              <UserAvatar name={selectedUser.name} avatarUrl={selectedUser.avatarUrl} />
              <div>
                <p className="text-sm font-medium text-foreground">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{selectedUser.email}</p>
                <RoleBadge role={selectedUser.role} />
              </div>
            </div>
          )}

          {formError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-danger-bg border border-destructive/20 text-xs font-medium text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-px" />
              <span>{formError}</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
