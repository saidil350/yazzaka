"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

  const [email, setEmail] = useState("admin@yazzakka.sch.id");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<UserRole>("super_admin");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    toast(`Berhasil masuk sebagai ${role.toUpperCase()}!`, "success");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#FCF8F1] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Playful Pastel Blobs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#FFEBD4] rounded-full blur-3xl pointer-events-none opacity-80" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#EDE9FE] rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-[#E6F4EA] rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-block bg-white p-3 rounded-2xl shadow-sm border border-[#E8E2D8] hover:scale-105 transition-transform">
          <Image
            src={
              profile.branding?.logoUrl && profile.branding.logoUrl !== "/logo-yazzaka.svg"
                ? profile.branding.logoUrl
                : "/yazzakka.png"
            }
            alt={profile.name}
            width={180}
            height={48}
            style={{ width: "auto", height: "auto" }}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <div className="pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] text-xs font-extrabold shadow-2xs mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Portal Administrasi Terpadu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330] tracking-tight">
            Masuk ke Panel CMS
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Pusat pengelolaan website &amp; layanan pendaftaran {profile.name}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border-2 border-[#E8E2D8] space-y-6">
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
              <label className="text-xs font-bold text-[#1E2330] block">
                Pilih Role Masuk (Demo Quick Select)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-11 rounded-xl border-2 border-[#E8E2D8] px-3 text-sm bg-[#FAF6EE] focus:outline-none focus:ring-2 focus:ring-[#FA6400] focus:border-[#FA6400] text-[#1E2330] font-bold cursor-pointer"
              >
                <option value="super_admin">Super Admin (Akses Mutlak)</option>
                <option value="admin">Administrator (Website)</option>
                <option value="editor">Editor (Berita &amp; Media)</option>
                <option value="admission_staff">Admission Staff (PPDB)</option>
                <option value="viewer">Viewer (Read Only)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full justify-center shadow-md font-extrabold h-11 rounded-full mt-2"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="pt-4 border-t border-[#E8E2D8] text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#FA6400] transition-colors">
              <span>← Kembali ke Situs Publik</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
