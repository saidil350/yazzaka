"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import {
  GraduationCap,
  Building2,
  Trophy,
  Quote,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  PhoneCall,
  SlidersHorizontal,
  ChevronRight,
  Database,
  Globe,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  UserPlus,
  Newspaper,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AdminDashboardOverview() {
  const {
    profile,
    programs,
    facilities,
    achievements,
    testimonials,
    sections,
    messages,
    articles,
    admission,
    organization,
    toggleSection,
  } = useSchoolData();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const unreadMessages = messages.filter((m) => m.status === "new");
  const recentMessages = messages.slice(0, 5);

  // KPI Utama yang secara langsung terhubung ke Landing Page
  const landingKpis = [
    {
      title: "Penerimaan Santri (PPDB)",
      value: admission.isOpen ? "Aktif" : "Tutup",
      unit: admission.academicYear,
      desc: admission.periodName,
      icon: UserPlus,
      href: "/admin/content/pendaftaran",
      badgeColor: "bg-[#FFF0E5] text-[#FA6400] border-[#FED7AA]",
      accentHover: "hover:border-[#FA6400]/50",
    },
    {
      title: "Berita & Publikasi",
      value: articles.length,
      unit: "Artikel",
      desc: "Liputan & wawasan santri",
      icon: Newspaper,
      href: "/admin/content/berita",
      badgeColor: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
      accentHover: "hover:border-[#D97706]/50",
    },
    {
      title: "Testimoni Publik",
      value: testimonials.length,
      unit: "Ulasan Terbit",
      desc: "Kesan wali santri & alumni",
      icon: Quote,
      href: "/admin/content/testimoni",
      badgeColor: "bg-[#F3E8FF] text-[#9333EA] border-[#E9D5FF]",
      accentHover: "hover:border-[#9333EA]/50",
    },
  ];

  // Modul Pengeditan Cepat Landing Page
  const landingModules = [
    {
      title: "Penerimaan Santri (PPDB)",
      desc: "Gelombang pendaftaran, tahun ajaran, rincian biaya, dan FAQ.",
      href: "/admin/content/pendaftaran",
      icon: UserPlus,
      badge: "Seksi PPDB",
    },
    {
      title: "Pimpinan & Dewan Asatidz",
      desc: "Profil pimpinan, kepala sekolah, asatidz, kualifikasi ijazah, dan foto.",
      href: "/admin/organization/tim",
      icon: Users,
      badge: "Seksi Asatidz",
    },
    {
      title: "Berita & Artikel Publikasi",
      desc: "Tulis, edit, dan terbitkan artikel wawasan atau liputan kegiatan.",
      href: "/admin/content/berita",
      icon: Newspaper,
      badge: "Seksi Berita",
    },
    {
      title: "Profil & Identitas Lembaga",
      desc: "Nama pesantren, slogan hero, sambutan pimpinan, dan legalitas.",
      href: "/admin/organization/profil",
      icon: Globe,
      badge: "Hero & About",
    },
    {
      title: "Testimoni & Ulasan",
      desc: "Ulasan dan pengalaman orang tua santri dan alumni pesantren.",
      href: "/admin/content/testimoni",
      icon: Quote,
      badge: "Seksi Testimoni",
    },
    {
      title: "Kontak & WhatsApp Hotline",
      desc: "Nomor WhatsApp pendaftaran, email, alamat maps, dan media sosial.",
      href: "/admin/settings/contact",
      icon: PhoneCall,
      badge: "Header & Footer",
    },
  ];

  const handleToggleSection = async (sectionId: string, sectionTitle: string) => {
    try {
      await toggleSection(sectionId);
      toast(`Visibilitas seksi “${sectionTitle}” berhasil diperbarui`, "success");
    } catch {
      toast("Gagal memperbarui status seksi", "error");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* ── 1. Page Header (Shadcn Dashboard Standard with Warm Accents) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] text-xs font-extrabold shadow-2xs">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Pusat Kendali Landing Page
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4EA] border border-[#BDE7CC] text-[#15803D] text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-[#15803D] animate-pulse" aria-hidden="true" />
              Live Sync
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E2330]">
            Dashboard Ikhtisar {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed font-medium">
            Kelola visibilitas seksi, perbarui konten landing page secara langsung, dan tindak lanjuti pesan konsultasi calon santri baru.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <Link href="/admin/pages/beranda">
            <Button
              variant="outline"
              size="sm"
              className="h-10 text-xs font-bold gap-2 rounded-full border-2 border-[#E8E2D8] hover:border-[#FA6400] hover:bg-[#FAF6EE] text-[#1E2330]"
              aria-label="Atur urutan seksi beranda"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#FA6400]" aria-hidden="true" />
              <span>Tata Letak Beranda</span>
            </Button>
          </Link>

          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="default"
              size="sm"
              className="h-10 text-xs font-bold gap-2 rounded-full px-5 shadow-sm"
              aria-label="Buka situs publik di tab baru"
            >
              <span>Lihat Web Publik</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Alert Kotak Masuk Baru (Tampil dinamis jika ada leads masuk) ── */}
      {unreadMessages.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-[#FFF0E5] border border-[#FED7AA] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-in fade-in duration-300"
        >
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="h-11 w-11 rounded-2xl bg-[#FA6400] text-white flex items-center justify-center shrink-0 shadow-sm shadow-[#FA6400]/30">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#1E2330] truncate">
                Terdapat {unreadMessages.length} pesan konsultasi pendaftaran baru
              </h2>
              <p className="text-xs text-stone-600 mt-0.5 font-medium leading-relaxed">
                Calon wali santri baru saja mengirimkan formulir pertanyaan melalui landing page.
              </p>
            </div>
          </div>
          <Link href="/admin/settings/pesan" className="shrink-0">
            <Button
              size="sm"
              className="font-bold text-xs h-9 px-5 rounded-full shadow-xs"
              aria-label="Buka kotak pesan masuk"
            >
              <span>Buka Kotak Masuk</span>
              <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      )}

      {/* ── 3. Top Metric Cards (3 KPI Utama) ── */}
      <section aria-labelledby="kpi-section-heading">
        <h2 id="kpi-section-heading" className="sr-only">
          Statistik Konten Landing Page
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {landingKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={kpi.href}
                href={kpi.href}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FA6400] rounded-3xl"
                aria-label={`Kelola ${kpi.title}, total ${kpi.value} ${kpi.unit}`}
              >
                <Card className={`h-full border-2 border-[#E8E2D8] bg-white hover:shadow-md transition-all duration-200 ${kpi.accentHover}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-500 group-hover:text-[#1E2330] transition-colors">
                      {kpi.title}
                    </CardTitle>
                    <div className={`p-2 rounded-2xl border ${kpi.badgeColor} shadow-2xs`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-[#1E2330] tabular-nums tracking-tight">
                        {kpi.value}
                      </span>
                      <span className="text-xs font-bold text-stone-500">{kpi.unit}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-stone-500 font-medium line-clamp-1">
                        {kpi.desc}
                      </p>
                      <ArrowUpRight className="h-3.5 w-3.5 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:text-[#FA6400] transition-all" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 4. Main 2-Column Dashboard Grid (Shadcn Dashboard Pattern) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column (7 cols): Primary Operations & Leads ── */}
        <div className="lg:col-span-7 space-y-8">
          {/* Card: Live Section Controller */}
          <Card className="border-2 border-[#E8E2D8] bg-white">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#FA6400]" aria-hidden="true" />
                  <CardTitle className="text-base font-bold text-[#1E2330]">
                    Visibilitas Seksi Beranda
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-stone-500 mt-0.5 font-medium">
                  Aktifkan atau sembunyikan seksi konten di halaman depan secara langsung.
                </CardDescription>
              </div>

              <Link href="/admin/pages/beranda">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold rounded-full border border-[#E8E2D8] hover:border-[#FA6400] hover:text-[#FA6400] text-stone-700"
                >
                  <span>Atur Urutan</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1 text-stone-400" aria-hidden="true" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className={`p-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                      sec.isEnabled
                        ? "bg-[#FAF6EE] border-[#E8E2D8]"
                        : "bg-[#FAF6EE]/40 border-[#E8E2D8]/50 opacity-60"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            sec.isEnabled
                              ? "bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                              : "bg-stone-300"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-bold text-[#1E2330] truncate block">
                          {sec.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 block truncate mt-0.5 font-medium">
                        #{sec.key} · {sec.isEnabled ? "Aktif di Beranda" : "Disembunyikan"}
                      </span>
                    </div>

                    <Switch
                      checked={sec.isEnabled}
                      onCheckedChange={() => handleToggleSection(sec.id, sec.title)}
                      id={`section-switch-${sec.id}`}
                      aria-label={`Aktifkan atau nonaktifkan seksi ${sec.title}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card: Recent Inquiries (Pesan Masuk) */}
          <Card className="border-2 border-[#E8E2D8] bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#E8E2D8] bg-[#FAF6EE] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#FA6400]" aria-hidden="true" />
                  <CardTitle className="text-base font-bold text-[#1E2330]">
                    Pesan Konsultasi Masuk
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-stone-500 mt-0.5 font-medium">
                  Leads pertanyaan calon wali santri dari formulir kontak publik.
                </CardDescription>
              </div>

              <Link href="/admin/settings/pesan">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-bold text-stone-700 hover:text-[#FA6400] rounded-full"
                >
                  <span>Lihat Semua ({messages.length})</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1 text-stone-400" aria-hidden="true" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-8 w-8 text-stone-300 mx-auto mb-2" aria-hidden="true" />
                  <p className="text-xs text-stone-500 font-medium">
                    Belum ada pesan masuk dari formulir kontak publik.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E8E2D8]" role="list">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 sm:px-6 hover:bg-[#FFF9F2] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#1E2330] truncate">
                            {msg.name}
                          </span>
                          {msg.status === "new" ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA] text-[10px] font-bold shadow-2xs">
                              Baru
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6EE] text-stone-600 border border-[#E8E2D8] text-[10px] font-medium">
                              {msg.status === "replied" ? "Dibalas" : "Dibaca"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-stone-700 truncate">
                          {msg.subject || "Konsultasi Santri Baru"}
                        </p>
                        <p className="text-xs text-stone-500 truncate max-w-md font-medium">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-0.5 font-medium">
                          <span>{msg.phone || msg.email}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {msg.submittedAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {msg.phone && (
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Halo ${msg.name}, terima kasih telah menghubungi Pondok Pesantren Yazzakka mengenai "${msg.subject}".`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Balas WhatsApp ke ${msg.name}`}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5 rounded-full shadow-2xs"
                            >
                              <Send className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                              <span>Balas WA</span>
                            </Button>
                          </a>
                        )}
                        <Link href="/admin/settings/pesan">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs font-bold text-stone-600 hover:text-[#FA6400] rounded-full"
                          >
                            Rincian
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Right Column (5 cols): Quick Editor Shortcuts & Identity ── */}
        <div className="lg:col-span-5 space-y-8">
          {/* Card: Quick Module Editor Shortcuts */}
          <Card className="border-2 border-[#E8E2D8] bg-white">
            <CardHeader className="border-b border-[#E8E2D8] pb-4">
              <CardTitle className="text-base font-bold text-[#1E2330]">
                Pusat Pengeditan Modul
              </CardTitle>
              <CardDescription className="text-xs text-stone-500 font-medium">
                Pintasan cepat untuk memperbarui data dan foto di halaman publik.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5">
              {landingModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    className="flex items-center justify-between p-3 rounded-2xl border border-[#E8E2D8] bg-white hover:bg-[#FFF9F2] hover:border-[#FA6400]/40 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-[#FFF0E5] border border-[#FED7AA] flex items-center justify-center text-[#FA6400] group-hover:bg-[#FA6400] group-hover:text-white transition-all shrink-0 shadow-2xs">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-[#1E2330] group-hover:text-[#FA6400] transition-colors truncate">
                          {mod.title}
                        </h3>
                        <span className="text-[10px] text-stone-400 font-semibold block">
                          {mod.badge}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-[#FA6400] group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Card: Institutional Trust Metrics & Identity Summary */}
          <Card className="border-2 border-[#E8E2D8] bg-gradient-to-b from-[#FAF6EE] to-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-[#1E2330]">
                  Profil &amp; Legalitas Lembaga
                </CardTitle>
                <Badge variant="success" className="text-[10px] font-bold">
                  Akreditasi {profile.accreditation}
                </Badge>
              </div>
              <CardDescription className="text-xs text-stone-500 font-medium">
                Data resmi yang tampil di header, trust section, dan footer.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D8] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">NPSN Resmi:</span>
                  <span className="font-bold text-[#1E2330] font-mono">{profile.npsn}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Tahun Berdiri:</span>
                  <span className="font-bold text-[#1E2330]">{profile.establishedYear}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Kepala Sekolah:</span>
                  <span className="font-bold text-[#1E2330] truncate max-w-[180px]">{profile.principal.name}</span>
                </div>
              </div>

              {/* Trust Metric Counters */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-white border border-[#E8E2D8] text-center">
                  <span className="text-xl font-extrabold text-[#1E2330] tabular-nums block">
                    {profile.studentCount}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                    Santri Aktif
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E8E2D8] text-center">
                  <span className="text-xl font-extrabold text-[#FA6400] tabular-nums block">
                    {profile.hafizCount}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                    Hafiz 30 Juz
                  </span>
                </div>
              </div>

              <Link href="/admin/organization/profil" className="block pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold h-9 rounded-full border border-[#E8E2D8] hover:border-[#FA6400] hover:text-[#FA6400]"
                >
                  <span>Edit Profil &amp; Legalitas</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

