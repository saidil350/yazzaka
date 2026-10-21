"use client";

import React, { useState, useEffect } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { User, UserRole } from "@/lib/types";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  return (
    <Badge variant={role === "super_admin" ? "default" : "secondary"}>
      {role === "super_admin" ? "Super Admin" : "Editor"}
    </Badge>
  );
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────

export default function AdminUsersManagementPage() {
  const { users, addUser, updateUserRole, deleteUser, refreshUsers, isLoading } =
    useSchoolData();
  const { role: currentRole, currentUser } = useAuth();
  const { toast } = useToast();

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
      toast(`Pengguna "${formName.trim()}" berhasil ditambahkan.`, "success");
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
      toast(
        `Peran "${selectedUser.name}" diperbarui menjadi ${newRole.replace("_", " ")}.`,
        "success"
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
      toast(`Pengguna "${selectedUser.name}" berhasil dihapus.`, "success");
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
    toast("Data pengguna berhasil diperbarui.", "success");
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const kolomAksi = isSuperAdmin;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akun pengelola CMS beserta perannya. Peran divalidasi di sisi
            server dan hanya dapat diubah oleh Super Admin.
          </p>
        </div>

        {/* Tombol Aksi Header */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isLoading}
            id="btn-refresh-users"
          >
            Perbarui
          </Button>
          {isSuperAdmin && (
            <Button
              size="sm"
              onClick={openTambah}
              id="btn-tambah-pengguna"
            >
              Tambah Pengguna
            </Button>
          )}
        </div>
      </div>

      {/* Tabel Pengguna */}
      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengguna</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Terdaftar Sejak</TableHead>
              {kolomAksi && <TableHead className="text-right">Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[0, 1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-44" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {kolomAksi && (
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <p className="text-sm">Belum ada pengguna terdaftar.</p>
          {isSuperAdmin && (
            <Button size="sm" variant="outline" onClick={openTambah}>
              Tambah Pengguna
            </Button>
          )}
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {users.length} pengguna terdaftar
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Terdaftar Sejak</TableHead>
                {isSuperAdmin && (
                  <TableHead className="text-right">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <TableRow key={u.id}>
                    {/* Pengguna */}
                    <TableCell>
                      <span className="font-medium text-foreground block">
                        {u.name}
                      </span>
                      {isSelf && (
                        <span className="text-xs text-muted-foreground">
                          Akun Anda
                        </span>
                      )}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-muted-foreground font-normal">
                      {u.email}
                    </TableCell>

                    {/* Peran */}
                    <TableCell>
                      <RoleBadge role={u.role} />
                    </TableCell>

                    {/* Terdaftar */}
                    <TableCell className="text-muted-foreground font-normal whitespace-nowrap">
                      {u.createdAt || "—"}
                    </TableCell>

                    {/* Aksi */}
                    {isSuperAdmin && (
                      <TableCell>
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
                            <Pencil className="h-4 w-4" />
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
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL — TAMBAH PENGGUNA
      ════════════════════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={modalMode === "tambah"}
        onClose={closeModal}
        title="Tambah Pengguna"
        description="Buat akun pengelola CMS baru. Kata sandi di-hash secara aman sebelum disimpan."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              form="form-tambah-user"
              type="submit"
              isLoading={isSubmitting}
              id="btn-submit-tambah"
            >
              Simpan
            </Button>
          </>
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

          {/* Peran */}
          <Select
            id="select-role"
            label="Peran"
            required
            value={formRole}
            onChange={(e) => setFormRole(e.target.value as UserRole)}
          >
            <option value="editor">Editor</option>
            <option value="super_admin">Super Admin</option>
          </Select>

          {/* Error */}
          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
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
            ? `Pilih peran baru untuk ${selectedUser.name} (${selectedUser.email}).`
            : "Pilih peran baru."
        }
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              onClick={handleUbahPeran}
              isLoading={isSubmitting}
              id="btn-submit-ubah-peran"
              disabled={selectedUser?.role === newRole}
            >
              Simpan Perubahan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            id="select-peran-baru"
            label="Peran"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as UserRole)}
          >
            <option value="editor">Editor</option>
            <option value="super_admin">Super Admin</option>
          </Select>

          {formError && (
            <p className="text-sm text-destructive">{formError}</p>
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
        description="Tindakan ini tidak dapat dibatalkan. Pengguna berikut akan dihapus secara permanen dari sistem."
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleHapus}
              isLoading={isSubmitting}
              id="btn-konfirmasi-hapus"
            >
              Hapus Pengguna
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          {selectedUser && (
            <>
              <p className="text-sm font-medium text-foreground">
                {selectedUser.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.email}
              </p>
              <div className="pt-1">
                <RoleBadge role={selectedUser.role} />
              </div>
            </>
          )}
          {formError && (
            <p className="text-sm text-destructive pt-3">{formError}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
