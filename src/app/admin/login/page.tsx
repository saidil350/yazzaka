"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { UserRole } from "@/lib/types";
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { profile } = useSchoolData();
  const { toast } = useToast();

  const [email, setEmail] = useState("admin@yazzaka.sch.id");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("super_admin");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    toast(`Berhasil masuk sebagai ${role.toUpperCase()}!`, "success");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--color-primary)]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center">
          <div className="h-12 w-12 rounded-2xl bg-[var(--color-accent)] text-white flex items-center justify-center shadow-lg">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Login Portal CMS Sekolah
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Masuk ke dashboard administrasi {profile.name}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-200 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Alamat Email Akun Staf"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Kata Sandi (Password)"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Pilih Role Masuk (Demo Quick Select)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] font-medium"
              >
                <option value="super_admin">Super Admin (Akses Mutlak)</option>
                <option value="admin">Administrator (Website)</option>
                <option value="editor">Editor (Berita & Media)</option>
                <option value="admission_staff">Admission Staff (PPDB)</option>
                <option value="viewer">Viewer (Read Only)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full justify-center shadow-md font-bold"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
              ← Kembali ke Situs Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
