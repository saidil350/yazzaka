"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isInitialized, loginWithCredentials } = useAuth();
  const { profile } = useSchoolData();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Path tujuan internal setelah login (dari ?next=), divalidasi same-origin
  const resolveNextPath = () => {
    if (typeof window === "undefined") return "/admin";
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") ?? "";
    if (next.startsWith("/") && !next.startsWith("//") && !next.includes("\\")) {
      return next;
    }
    return "/admin";
  };

  // Jika pengguna sudah memiliki sesi login aktif, alihkan ke dashboard admin
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(resolveNextPath());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Bersihkan error sebelumnya
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Alamat email wajib diisi.");
      return;
    }

    if (!password) {
      setErrorMessage("Kata sandi wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginWithCredentials(trimmedEmail, password);

      if (result.success) {
        toast("Autentikasi berhasil. Mengalihkan ke panel CMS...", "success");
        router.push(resolveNextPath());
        router.refresh();
      } else {
        setErrorMessage(
          result.error ||
            "Kombinasi email atau kata sandi tidak valid. Silakan periksa kembali."
        );
        // Kosongkan field kata sandi untuk keamanan, pertahankan email
        setPassword("");
      }
    } catch {
      setErrorMessage(
        "Terjadi gangguan saat memproses permintaan masuk. Silakan coba kembali."
      );
      setPassword("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoSrc =
    profile?.branding?.logoUrl && profile.branding.logoUrl !== "/logo-yazzaka.svg"
      ? profile.branding.logoUrl
      : "/yazzakka.png";

  return (
    <div className="min-h-screen bg-[#FCF8F1] flex flex-col justify-between text-[#1E2330] selection:bg-[#FFF0E5] selection:text-[#FA6400]">
      {/* ── Top Header Bar ────────────────────────────────────────── */}
      <header className="w-full border-b border-[#E8E2D8] bg-white/80 backdrop-blur-xs py-3 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#FA6400] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA6400] rounded-lg px-2 py-1"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Kembali ke Situs Publik</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
            <Shield className="h-3.5 w-3.5 text-stone-400" />
            <span>Akses Terbatas untuk Staf</span>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ─────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Card Form Container */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
            {/* 1. Brand Identity */}
            <div className="text-center space-y-3 pb-2 border-b border-[#F3EFE6]">
              <div className="flex justify-center">
                <Image
                  src={logoSrc}
                  alt={profile?.name || "Logo Yayasan Yazzakka"}
                  width={160}
                  height={44}
                  style={{ width: "auto", height: "auto" }}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </div>
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#FA6400] bg-[#FFF0E5] px-2.5 py-0.5 rounded-full border border-[#FED7AA]/60 mb-1.5">
                  Content Management System
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E2330] tracking-tight">
                  Masuk ke Panel CMS
                </h1>
                <p className="text-xs text-stone-500 font-medium mt-1 leading-relaxed">
                  Pusat administrasi konten dan publikasi informasi {profile?.name || "Yayasan Yazzakka Aceh"}
                </p>
              </div>
            </div>

            {/* 2. Authentication Error Alert */}
            {errorMessage && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs leading-relaxed"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-900">Gagal Masuk</p>
                  <p className="mt-0.5 text-rose-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* 3. Semantic Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="cms-login-email"
                  className="block text-xs font-bold text-[#1E2330]"
                >
                  Alamat Email Staf
                  <span className="ml-1 text-rose-500" aria-label="wajib diisi">
                    *
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="cms-login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@yazzakka.sch.id"
                    className="flex h-10 w-full rounded-xl border border-[#E8E2D8] bg-white pl-10 pr-3.5 py-2 text-sm font-medium text-[#1E2330] placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] disabled:bg-[#FAF6EE] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field with Accessible Visibility Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="cms-login-password"
                    className="block text-xs font-bold text-[#1E2330]"
                  >
                    Kata Sandi
                    <span className="ml-1 text-rose-500" aria-label="wajib diisi">
                      *
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="cms-login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="flex h-10 w-full rounded-xl border border-[#E8E2D8] bg-white pl-10 pr-10 py-2 text-sm font-medium text-[#1E2330] placeholder:text-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] disabled:bg-[#FAF6EE] disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA6400] rounded-r-xl"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="default"
                  size="default"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className="w-full justify-center h-11 text-sm font-bold shadow-xs rounded-xl"
                >
                  <span>Masuk ke Panel CMS</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </form>
          </div>

          {/* 4. Supporting Information */}
          <div className="mt-6 text-center space-y-2 text-xs text-stone-500">
            <p>
              Kendala akses akun? Hubungi Administrator TI di{" "}
              <a
                href={`mailto:${profile?.email || "info@yazzakka.sch.id"}`}
                className="font-semibold text-stone-700 hover:text-[#FA6400] underline underline-offset-2"
              >
                {profile?.email || "info@yazzakka.sch.id"}
              </a>
            </p>
            <p className="text-[11px] text-stone-400">
              Hak Cipta © {new Date().getFullYear()} {profile?.name || "Yayasan Yazzakka Aceh"}. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
