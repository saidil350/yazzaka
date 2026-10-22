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
  Clock,
  Send,
  ExternalLink,
  Globe,
  Users,
  UserPlus,
  Newspaper,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
      href: "/admin/berita",
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
      href: "/admin/berita",
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
      {/* ── 1. Header Halaman ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard Ikhtisar {profile.name}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Kelola visibilitas seksi, perbarui konten landing page secara langsung, dan tindak lanjuti pesan konsultasi calon santri baru.
          </p>
        </div>

        {/* Toolbar Aksi */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <Link href="/admin/pages/beranda">
            <Button
              variant="outline"
              size="sm"
              aria-label="Atur urutan seksi beranda"
            >
              <SlidersHorizontal aria-hidden="true" />
              <span>Tata Letak Beranda</span>
            </Button>
          </Link>

          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Button
              variant="accent"
              size="sm"
              aria-label="Buka situs publik di tab baru"
            >
              <span>Lihat Web Publik</span>
              <ExternalLink aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 2. Alert Kotak Masuk Baru (super_admin — halaman Pesan Masuk terbatas) ── */}
      {isSuperAdmin && unreadMessages.length > 0 && (
        <Alert
          role="alert"
          aria-live="polite"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4"
        >
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <MessageSquare aria-hidden="true" />
            <div className="min-w-0">
              <AlertTitle className="col-start-auto">
                Terdapat {unreadMessages.length} pesan konsultasi pendaftaran baru
              </AlertTitle>
              <AlertDescription className="col-start-auto">
                Calon wali santri baru saja mengirimkan formulir pertanyaan melalui landing page.
              </AlertDescription>
            </div>
          </div>
          <Link href="/admin/settings/pesan" className="shrink-0">
            <Button size="sm" aria-label="Buka kotak pesan masuk">
              <span>Buka Kotak Masuk</span>
              <ChevronRight aria-hidden="true" />
            </Button>
          </Link>
        </Alert>
      )}

      {/* ── 3. Kartu Metrik Utama (3 KPI) ── */}
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
                <Card className="h-full group-hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardDescription className="text-sm">
                      {kpi.title}
                    </CardDescription>
                    <Icon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold text-foreground tabular-nums tracking-tight">
                      {kpi.value}
                      <span className="ml-1.5 text-xs font-medium text-muted-foreground">
                        {kpi.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {kpi.desc}
                      </p>
                      <ArrowUpRight
                        className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 4. Grid Dashboard 2 Kolom ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Kolom Kiri (7 kolom): Operasi Utama & Leads ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Kartu: Kontrol Seksi Beranda */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0 pb-4">
              <div className="space-y-1.5">
                <CardTitle>Visibilitas Seksi Beranda</CardTitle>
                <CardDescription>
                  Aktifkan atau sembunyikan seksi konten di halaman depan secara langsung.
                </CardDescription>
              </div>

              <Link href="/admin/pages/beranda" className="shrink-0">
                <Button variant="outline" size="sm">
                  <span>Atur Urutan</span>
                  <ChevronRight aria-hidden="true" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between gap-4 px-6 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {sec.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {sec.key} · {sec.isEnabled ? "Aktif di Beranda" : "Disembunyikan"}
                      </p>
                    </div>

                    <Switch
                      checked={sec.isEnabled}
                      onCheckedChange={() => handleToggleSection(sec.id, sec.title)}
                      aria-label={`Aktifkan atau nonaktifkan seksi ${sec.title}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Kartu: Pesan Konsultasi Terbaru */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1.5">
                <CardTitle>Pesan Konsultasi Masuk</CardTitle>
                <CardDescription>
                  Leads pertanyaan calon wali santri dari formulir kontak publik.
                </CardDescription>
              </div>

              <Link href="/admin/settings/pesan" className="shrink-0">
                <Button variant="ghost" size="sm">
                  <span>Lihat Semua ({messages.length})</span>
                  <ChevronRight aria-hidden="true" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {recentMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="size-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">
                    Belum ada pesan masuk dari formulir kontak publik.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border" role="list">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 sm:px-6 hover:bg-muted/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">
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
                        <p className="text-sm text-foreground truncate">
                          {msg.subject || "Konsultasi Santri Baru"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {msg.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                          <span className="truncate">{msg.phone || msg.email}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock className="size-3" aria-hidden="true" />
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
                            <Button size="sm" variant="outline">
                              <Send aria-hidden="true" />
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

        {/* ── Kolom Kanan (5 kolom): Pintasan Modul & Identitas ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Kartu: Pintasan Editor Modul */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pusat Pengeditan Modul</CardTitle>
              <CardDescription>
                Pintasan cepat untuk memperbarui data dan foto di halaman publik.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-2 pt-0">
              <div className="space-y-0.5">
                {landingModules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link
                      key={mod.href}
                      href={mod.href}
                      className="group flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {mod.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {mod.badge}
                        </p>
                      </div>
                      <ChevronRight
                        className="size-4 text-muted-foreground shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Kartu: Ringkasan Identitas & Legalitas Lembaga */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Profil &amp; Legalitas Lembaga</CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  Akreditasi {profile.accreditation}
                </Badge>
              </div>
              <CardDescription>
                Data resmi yang tampil di header, trust section, dan footer.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">NPSN Resmi</span>
                  <span className="font-medium text-foreground font-mono">{profile.npsn}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Tahun Berdiri</span>
                  <span className="font-medium text-foreground">{profile.establishedYear}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">Kepala Sekolah</span>
                  <span className="font-medium text-foreground truncate">{profile.principal.name}</span>
                </div>
              </div>

              <Separator />

              {/* Statistik kepercayaan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-semibold text-foreground tabular-nums">
                    {profile.studentCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Santri Aktif</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-foreground tabular-nums">
                    {profile.hafizCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Hafiz 30 Juz</div>
                </div>
              </div>

              <Link href="/admin/organization/profil" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <span>Edit Profil &amp; Legalitas</span>
                  <ChevronRight aria-hidden="true" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
