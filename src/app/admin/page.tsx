"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import {
  MessageSquare,
  ArrowUpRight,
  PhoneCall,
  SlidersHorizontal,
  ChevronRight,
  Globe,
  Clock,
  Send,
  ExternalLink,
  Users,
  UserPlus,
  Newspaper,
  Quote,
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
    testimonials,
    sections,
    messages,
    articles,
    admission,
    toggleSection,
  } = useSchoolData();
  const { role } = useAuth();

  const isSuperAdmin = role === "super_admin";
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
    },
    {
      title: "Berita & Publikasi",
      value: articles.length,
      unit: "Artikel",
      desc: "Liputan & wawasan santri",
      icon: Newspaper,
      href: "/admin/content/berita",
    },
    {
      title: "Testimoni Publik",
      value: testimonials.length,
      unit: "Ulasan Terbit",
      desc: "Kesan wali santri & alumni",
      icon: Quote,
      href: "/admin/content/testimoni",
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
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Dashboard Ikhtisar {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Kelola visibilitas seksi, perbarui konten landing page secara langsung, dan tindak lanjuti pesan konsultasi calon santri baru.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <Link href="/admin/pages/beranda">
            <Button
              variant="outline"
              size="sm"
              aria-label="Atur urutan seksi beranda"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Tata Letak Beranda</span>
            </Button>
          </Link>

          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="default"
              size="sm"
              aria-label="Buka situs publik di tab baru"
            >
              <span>Lihat Web Publik</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Alert Kotak Masuk Baru (super_admin — halaman Pesan Masuk terbatas) ── */}
      {isSuperAdmin && unreadMessages.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-muted border border-border rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300"
        >
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">
                Terdapat {unreadMessages.length} pesan konsultasi pendaftaran baru
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Calon wali santri baru saja mengirimkan formulir pertanyaan melalui landing page.
              </p>
            </div>
          </div>
          <Link href="/admin/settings/pesan" className="shrink-0">
            <Button
              size="sm"
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
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                aria-label={`Kelola ${kpi.title}, total ${kpi.value} ${kpi.unit}`}
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                      {kpi.title}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-muted text-foreground">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-foreground tabular-nums tracking-tight">
                        {kpi.value}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">{kpi.unit}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {kpi.desc}
                      </p>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-opacity" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 4. Main 2-Column Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column (7 cols): Primary Operations & Leads ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Live Section Controller */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
                  <CardTitle className="text-base">
                    Visibilitas Seksi Beranda
                  </CardTitle>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Aktifkan atau sembunyikan seksi konten di halaman depan secara langsung.
                </CardDescription>
              </div>

              <Link href="/admin/pages/beranda">
                <Button variant="outline" size="sm">
                  <span>Atur Urutan</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1 text-muted-foreground" aria-hidden="true" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
                      sec.isEnabled
                        ? "bg-muted border-border"
                        : "bg-muted/40 border-border/50 opacity-60"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            sec.isEnabled
                              ? "bg-success"
                              : "bg-muted-foreground/30"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-xs font-medium text-foreground truncate block">
                          {sec.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
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
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" aria-hidden="true" />
                  <CardTitle className="text-base">
                    Pesan Konsultasi Masuk
                  </CardTitle>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Leads pertanyaan calon wali santri dari formulir kontak publik.
                </CardDescription>
              </div>

              <Link href="/admin/settings/pesan">
                <Button variant="ghost" size="sm">
                  <span>Lihat Semua ({messages.length})</span>
                  <ChevronRight className="h-3.5 w-3.5 ml-1 text-muted-foreground" aria-hidden="true" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
                  <p className="text-xs text-muted-foreground">
                    Belum ada pesan masuk dari formulir kontak publik.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border" role="list">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 sm:px-6 hover:bg-muted transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground truncate">
                            {msg.name}
                          </span>
                          {msg.status === "new" ? (
                            <Badge variant="default">Baru</Badge>
                          ) : (
                            <Badge variant="secondary">
                              {msg.status === "replied" ? "Dibalas" : "Dibaca"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-medium text-foreground truncate">
                          {msg.subject || "Konsultasi Santri Baru"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
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
                              className="gap-1.5"
                            >
                              <Send className="h-3 w-3" aria-hidden="true" />
                              <span>Balas WA</span>
                            </Button>
                          </a>
                        )}
                        <Link href="/admin/settings/pesan">
                          <Button size="sm" variant="ghost">
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
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Quick Module Editor Shortcuts */}
          <Card>
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base">
                Pusat Pengeditan Modul
              </CardTitle>
              <CardDescription className="text-xs">
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
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted hover:border-primary/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {mod.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground block">
                          {mod.badge}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Card: Institutional Trust Metrics & Identity Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Profil &amp; Legalitas Lembaga
                </CardTitle>
                <Badge variant="outline" className="text-[10px] bg-success-bg border-success/20 text-success">
                  Akreditasi {profile.accreditation}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Data resmi yang tampil di header, trust section, dan footer.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-1">
              <div className="p-3.5 rounded-lg bg-card border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">NPSN Resmi:</span>
                  <span className="font-medium text-foreground font-mono">{profile.npsn}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tahun Berdiri:</span>
                  <span className="font-medium text-foreground">{profile.establishedYear}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Kepala Sekolah:</span>
                  <span className="font-medium text-foreground truncate max-w-[180px]">{profile.principal.name}</span>
                </div>
              </div>

              {/* Trust Metric Counters */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <span className="text-xl font-semibold text-foreground tabular-nums block">
                    {profile.studentCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                    Santri Aktif
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border text-center">
                  <span className="text-xl font-semibold text-primary tabular-nums block">
                    {profile.hafizCount}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                    Hafiz 30 Juz
                  </span>
                </div>
              </div>

              <Link href="/admin/organization/profil" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full">
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
