"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useAuth } from "@/context/AuthContext";
import { User, UserRole } from "@/lib/types";
import { Users, Shield, Check, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersManagementPage() {
  const { users } = useSchoolData();
  const { role } = useAuth();

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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Users &amp; Access Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Manajemen Pengguna &amp; Hak Akses (RBAC)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Daftar staf pengelola CMS dengan peran dan izin yang disesuaikan menurut tupoksi masing-masing.
        </p>
      </div>

      {/* Role Matrix Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#1E2330]">
          Hak Akses per Peran (RBAC)
        </h3>
        <p className="text-xs text-stone-500 font-medium">
          Peran ditetapkan oleh administrator dan divalidasi di sisi server. Perubahan peran hanya dapat dilakukan melalui manajemen akun.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {rolesMatrix.map((item) => {
            const isCurrent = role === item.role;
            return (
              <div
                key={item.role}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? "bg-[#FFF0E5] border-[#FED7AA] shadow-xs ring-2 ring-[#FA6400]/20"
                    : "bg-[#FAF6EE] border-[#E8E2D8]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1E2330]">
                      {item.title}
                    </span>
                    {isCurrent && (
                      <Badge variant="accent" className="text-[10px] font-bold">
                        Peran Anda
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-[#E8E2D8] bg-[#FAF6EE] flex items-center justify-between">
          <h3 className="font-bold text-base text-[#1E2330]">
            Daftar Akun Pengguna Terdaftar
          </h3>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAF6EE] border-b border-[#E8E2D8] text-xs font-bold uppercase text-stone-500">
            <tr>
              <th className="p-4 sm:px-6">Pengguna</th>
              <th className="p-4 sm:px-6">Email</th>
              <th className="p-4 sm:px-6">Peran (Role)</th>
              <th className="p-4 sm:px-6">Terdaftar Sejak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[#FFF9F2] transition-colors">
                <td className="p-4 sm:px-6 font-bold text-[#1E2330] flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      u.avatarUrl ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={u.name}
                    className="h-9 w-9 rounded-full object-cover border-2 border-[#E8E2D8] shadow-2xs"
                  />
                  <span>{u.name}</span>
                </td>
                <td className="p-4 sm:px-6 text-xs font-mono text-stone-600">
                  {u.email}
                </td>
                <td className="p-4 sm:px-6">
                  <Badge variant="secondary" className="text-xs uppercase font-bold">
                    {u.role.replace("_", " ")}
                  </Badge>
                </td>
                <td className="p-4 sm:px-6 text-xs text-stone-500 font-medium">
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
