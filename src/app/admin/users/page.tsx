"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { User, UserRole } from "@/lib/types";
import { Plus, Users, Shield, Check, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersManagementPage() {
  const { users } = useSchoolData();
  const { role, switchRole } = useAuth();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("editor");

  const rolesMatrix = [
    {
      role: "super_admin",
      title: "Super Admin",
      desc: "Akses mutlak ke seluruh modul CMS, pengaturan tema, database & manajemen pengguna.",
    },
    {
      role: "admin",
      title: "Administrator",
      desc: "Mengelola seluruh konten situs, profil sekolah, dan pengaturan umum.",
    },
    {
      role: "editor",
      title: "Editor",
      desc: "Menulis, menyunting artikel berita, galeri foto/video, dan agenda kegiatan.",
    },
    {
      role: "admission_staff",
      title: "Admission Staff (PPDB)",
      desc: "Mengelola informasi pendaftaran, syarat, biaya, dan melayani pesan kontak masuk.",
    },
    {
      role: "viewer",
      title: "Viewer",
      desc: "Akses baca dan pratinjau (read-only) tanpa hak mengubah data.",
    },
  ];

  const handleSimulateRole = (r: UserRole) => {
    switchRole(r);
    toast(`Peran simulasi berhasil dialihkan ke: ${r.toUpperCase()}`, "info");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
          Users & Access Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
          Manajemen Pengguna & Hak Akses (RBAC)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Daftar staf pengelola CMS dengan peran dan izin yang disesuaikan menurut tupoksi masing-masing.
        </p>
      </div>

      {/* Role Switcher Showcase Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[var(--color-primary)]">
          Simulasi Uji Hak Akses Pengguna (Role Quick Switch)
        </h3>
        <p className="text-xs text-slate-500">
          Klik tombol di bawah ini untuk langsung merasakan tampilan dan batasan akses sesuai peran yang dipilih:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {rolesMatrix.map((item) => {
            const isCurrent = role === item.role;
            return (
              <div
                key={item.role}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      {item.title}
                    </span>
                    {isCurrent && (
                      <Badge variant="accent" className="text-[10px]">
                        Aktif
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <Button
                  variant={isCurrent ? "accent" : "outline"}
                  size="sm"
                  disabled={isCurrent}
                  onClick={() => handleSimulateRole(item.role as UserRole)}
                  className="w-full text-xs font-semibold"
                >
                  {isCurrent ? "Sedang Aktif" : "Uji Peran Ini"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-[var(--color-primary)]">
            Daftar Akun Pengguna Terdaftar
          </h3>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="p-4 sm:px-6">Pengguna</th>
              <th className="p-4 sm:px-6">Email</th>
              <th className="p-4 sm:px-6">Peran (Role)</th>
              <th className="p-4 sm:px-6">Terdaftar Sejak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-4 sm:px-6 font-semibold text-slate-900 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      u.avatarUrl ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={u.name}
                    className="h-8 w-8 rounded-full object-cover border border-slate-300"
                  />
                  <span>{u.name}</span>
                </td>
                <td className="p-4 sm:px-6 text-xs font-mono text-slate-600">
                  {u.email}
                </td>
                <td className="p-4 sm:px-6">
                  <Badge variant="secondary" className="text-xs uppercase">
                    {u.role.replace("_", " ")}
                  </Badge>
                </td>
                <td className="p-4 sm:px-6 text-xs text-slate-500">
                  {u.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
