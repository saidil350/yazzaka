"use client";

import React, { useEffect, useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Plus, Trash2 } from "lucide-react";
import { DEFAULT_FOUNDATION } from "@/lib/data/initialData";
import type {
  DonationBankAccount,
  DonationPlatform,
} from "@/lib/types";

export default function AdminOrgProfilePage() {
  const { profile, updateProfile, isLoading } = useSchoolData();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [npsn, setNpsn] = useState(profile.npsn);
  const [accreditation, setAccreditation] = useState(profile.accreditation);
  const [establishedYear, setEstablishedYear] = useState(profile.establishedYear);
  const [studentCount, setStudentCount] = useState(profile.studentCount);
  const [teacherCount, setTeacherCount] = useState(profile.teacherCount);
  const [alumniCount, setAlumniCount] = useState(profile.alumniCount);
  const [hafizCount, setHafizCount] = useState(profile.hafizCount);
  const [aboutImage, setAboutImage] = useState(profile.aboutImageUrl ?? "");

  // Data Yayasan (legalitas)
  const foundation = profile.foundation ?? DEFAULT_FOUNDATION;
  const [skNumber, setSkNumber] = useState(foundation.skNumber);
  const [registryNumber, setRegistryNumber] = useState(foundation.registryNumber);
  const [founders, setFounders] = useState<string[]>(foundation.founders);
  const [chairman, setChairman] = useState(foundation.chairman);
  const [contactPerson, setContactPerson] = useState(foundation.contactPerson);
  const [foundationEmail, setFoundationEmail] = useState(foundation.email);

  // Info donasi (rekening transfer & platform eksternal)
  const [bankAccounts, setBankAccounts] = useState<DonationBankAccount[]>(
    foundation.donation?.bankAccounts ?? []
  );
  const [platforms, setPlatforms] = useState<DonationPlatform[]>(
    foundation.donation?.platforms ?? []
  );

  // Principal
  const [principalName, setPrincipalName] = useState(profile.principal.name);
  const [principalTitle, setPrincipalTitle] = useState(profile.principal.title);
  const [principalPhoto, setPrincipalPhoto] = useState(profile.principal.photoUrl);
  const [principalWelcome, setPrincipalWelcome] = useState(profile.principal.welcomeMessage);

  // useState hanya membaca nilai awal — sinkronkan form saat profile
  // selesai dimuat dari DB agar Simpan tidak menimpa DB dengan data fallback.
  useEffect(() => {
    setName(profile.name);
    setTagline(profile.tagline);
    setNpsn(profile.npsn);
    setAccreditation(profile.accreditation);
    setEstablishedYear(profile.establishedYear);
    setStudentCount(profile.studentCount);
    setTeacherCount(profile.teacherCount);
    setAlumniCount(profile.alumniCount);
    setHafizCount(profile.hafizCount);
    setAboutImage(profile.aboutImageUrl ?? "");
    const f = profile.foundation ?? DEFAULT_FOUNDATION;
    setSkNumber(f.skNumber);
    setRegistryNumber(f.registryNumber);
    setFounders(f.founders);
    setChairman(f.chairman);
    setContactPerson(f.contactPerson);
    setFoundationEmail(f.email);
    setBankAccounts(f.donation?.bankAccounts ?? []);
    setPlatforms(f.donation?.platforms ?? []);
    setPrincipalName(profile.principal.name);
    setPrincipalTitle(profile.principal.title);
    setPrincipalPhoto(profile.principal.photoUrl);
    setPrincipalWelcome(profile.principal.welcomeMessage);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        tagline,
        npsn,
        accreditation,
        establishedYear: Number(establishedYear),
        studentCount: Number(studentCount),
        teacherCount: Number(teacherCount),
        alumniCount: Number(alumniCount),
        hafizCount: Number(hafizCount),
        aboutImageUrl: aboutImage,
        foundation: {
          skNumber,
          registryNumber,
          founders: founders.filter((n) => n.trim() !== ""),
          chairman,
          contactPerson,
          email: foundationEmail,
          donation: {
            bankAccounts: bankAccounts.filter(
              (a) => a.bankName.trim() !== "" || a.accountNumber.trim() !== ""
            ),
            platforms: platforms.filter(
              (p) => p.label.trim() !== "" || p.url.trim() !== ""
            ),
          },
        },
        principal: {
          name: principalName,
          title: principalTitle,
          photoUrl: principalPhoto,
          welcomeMessage: principalWelcome,
        },
      });
      toast("Profil resmi dan data statistik lembaga berhasil diperbarui!", "success");
    } catch {
      toast("Gagal menyimpan profil. Perubahan tidak tersimpan — coba lagi.", "error");
    }
  };

  // Form hanya dipasang setelah data awal tiba — mencegah admin menyunting
  // nilai fallback seed selama sinkronisasi DB berjalan (belt-and-braces
  // dengan efek re-sync profile di atas).
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8" aria-busy="true">
        <div className="space-y-2">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-3 w-full max-w-lg" />
        </div>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-60" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <div className="border-t border-border pt-4 space-y-4">
            <Skeleton className="h-3 w-64" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </Card>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-52" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-16 sm:w-2/3" />
        </Card>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-28" />
        </Card>
        <Card className="p-6 space-y-6">
          <Skeleton className="h-5 w-56" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Organization / Profil Lembaga
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Profil Resmi & Identitas Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Kelola nama resmi lembaga, NPSN, akreditasi, data statistik kunci, serta informasi pimpinan sekolah.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Identity */}
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-semibold text-foreground">
            Identitas Pokok & Akreditasi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Resmi Sekolah"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Motto / Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="NPSN Resmi"
              value={npsn}
              onChange={(e) => setNpsn(e.target.value)}
            />
            <Input
              label="Peringkat Akreditasi"
              value={accreditation}
              onChange={(e) => setAccreditation(e.target.value)}
            />
            <Input
              label="Tahun Berdiri"
              type="number"
              value={establishedYear}
              onChange={(e) => setEstablishedYear(Number(e.target.value))}
            />
          </div>

          {/* Statistics Key Numbers */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4 block">
              Metrik Kunci Sekolah (Tampil di Trust Section)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="Jumlah Santri Aktif"
                type="number"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
              />
              <Input
                label="Jumlah Guru / Asatidz"
                type="number"
                value={teacherCount}
                onChange={(e) => setTeacherCount(Number(e.target.value))}
              />
              <Input
                label="Jumlah Alumni"
                type="number"
                value={alumniCount}
                onChange={(e) => setAlumniCount(Number(e.target.value))}
              />
              <Input
                label="Santri Hafiz 30 Juz"
                type="number"
                value={hafizCount}
                onChange={(e) => setHafizCount(Number(e.target.value))}
              />
            </div>
          </div>
        </Card>

        {/* Data Yayasan & Legalitas */}
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-semibold text-foreground">
            Data Yayasan & Legalitas
          </h3>
          <p className="text-xs text-muted-foreground">
            Tampil pada seksi &quot;Data &amp; Legalitas Yayasan&quot; di halaman /tentang-kami.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nomor SK Kemenkumham RI"
              value={skNumber}
              onChange={(e) => setSkNumber(e.target.value)}
            />
            <Input
              label="Nomor Induk Yayasan"
              value={registryNumber}
              onChange={(e) => setRegistryNumber(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ketua Yayasan"
              value={chairman}
              onChange={(e) => setChairman(e.target.value)}
            />
            <Input
              label="Contact Person Yayasan"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>

          <Input
            label="Email Resmi Yayasan"
            type="email"
            value={foundationEmail}
            onChange={(e) => setFoundationEmail(e.target.value)}
          />

          <div className="space-y-3">
            <span className="text-xs font-medium text-muted-foreground block">
              Pendiri Yayasan
            </span>
            {founders.map((founder, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Input
                  aria-label={`Nama pendiri ${idx + 1}`}
                  value={founder}
                  onChange={(e) =>
                    setFounders(founders.map((f, i) => (i === idx ? e.target.value : f)))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Hapus pendiri ${idx + 1}`}
                  onClick={() => setFounders(founders.filter((_, i) => i !== idx))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFounders([...founders, ""])}
            >
              <Plus className="h-4 w-4" />
              Tambah Pendiri
            </Button>
          </div>
        </Card>

        {/* Informasi Donasi */}
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Informasi Donasi
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Tampil saat tombol Donasi di header situs publik diklik. Isi minimal satu
              rekening atau platform untuk mengaktifkan tombol; jika semua kosong, tombol
              disembunyikan.
            </p>
          </div>

          {/* Rekening Transfer Bank */}
          <div className="space-y-4">
            <span className="text-xs font-medium text-muted-foreground block">
              Rekening Transfer Bank
            </span>
            {bankAccounts.map((acc, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Rekening {idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setBankAccounts(bankAccounts.filter((_, i) => i !== idx))
                    }
                    className="text-destructive hover:text-destructive"
                    aria-label={`Hapus rekening ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Bank"
                    value={acc.bankName}
                    placeholder="Bank BSI"
                    onChange={(e) =>
                      setBankAccounts(
                        bankAccounts.map((a, i) =>
                          i === idx ? { ...a, bankName: e.target.value } : a
                        )
                      )
                    }
                  />
                  <Input
                    label="Nomor Rekening"
                    value={acc.accountNumber}
                    placeholder="7000123456"
                    onChange={(e) =>
                      setBankAccounts(
                        bankAccounts.map((a, i) =>
                          i === idx ? { ...a, accountNumber: e.target.value } : a
                        )
                      )
                    }
                  />
                </div>
                <Input
                  label="Nama Pemilik Rekening"
                  value={acc.accountHolder}
                  placeholder="Yayasan Bina Iman Akhlak Yazzakka"
                  onChange={(e) =>
                    setBankAccounts(
                      bankAccounts.map((a, i) =>
                        i === idx ? { ...a, accountHolder: e.target.value } : a
                      )
                    )
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setBankAccounts([
                  ...bankAccounts,
                  { bankName: "", accountNumber: "", accountHolder: "" },
                ])
              }
            >
              <Plus className="h-4 w-4" />
              Tambah Rekening
            </Button>
          </div>

          {/* Platform Donasi Eksternal */}
          <div className="space-y-4">
            <span className="text-xs font-medium text-muted-foreground block">
              Platform Donasi Eksternal
            </span>
            {platforms.map((platform, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border p-4 space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Platform {idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setPlatforms(platforms.filter((_, i) => i !== idx))
                    }
                    className="text-destructive hover:text-destructive"
                    aria-label={`Hapus platform ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Platform"
                    value={platform.label}
                    placeholder="Kitabisa"
                    onChange={(e) =>
                      setPlatforms(
                        platforms.map((p, i) =>
                          i === idx ? { ...p, label: e.target.value } : p
                        )
                      )
                    }
                  />
                  <Input
                    label="Tautan Donasi"
                    type="url"
                    value={platform.url}
                    placeholder="https://kitabisa.com/campaign"
                    onChange={(e) =>
                      setPlatforms(
                        platforms.map((p, i) =>
                          i === idx ? { ...p, url: e.target.value } : p
                        )
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPlatforms([...platforms, { label: "", url: "" }])}
            >
              <Plus className="h-4 w-4" />
              Tambah Platform
            </Button>
          </div>
        </Card>

        {/* Foto Gedung / Kampus */}
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-semibold text-foreground">
            Foto Gedung / Kampus
          </h3>
          <ImageUpload
            label="Foto Gedung Sekolah (Halaman Tentang Kami)"
            value={aboutImage}
            onChange={(val) => setAboutImage(val)}
            placeholder="https://contoh.com/gambar.jpg"
            helperText="Tampil pada seksi profil di halaman /tentang-kami. Rasio disarankan 16:10."
          />
        </Card>

        {/* Principal Info */}
        <Card className="p-6 space-y-6">
          <h3 className="text-base font-semibold text-foreground">
            Data Pimpinan / Kepala Sekolah
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap & Gelar Pimpinan"
              value={principalName}
              onChange={(e) => setPrincipalName(e.target.value)}
            />
            <Input
              label="Jabatan Resmi"
              value={principalTitle}
              onChange={(e) => setPrincipalTitle(e.target.value)}
            />
          </div>

          <ImageUpload
            label="Foto Pimpinan / Kepala Sekolah"
            value={principalPhoto}
            onChange={(val) => setPrincipalPhoto(val)}
            placeholder="https://contoh.com/gambar.jpg"
            helperText="Unggah foto formal pimpinan lembaga (drag & drop) atau tautkan URL gambar."
          />

          <Textarea
            label="Sambutan Singkat Pimpinan"
            rows={5}
            value={principalWelcome}
            onChange={(e) => setPrincipalWelcome(e.target.value)}
          />

          <div className="flex justify-end pt-4 border-t border-border">
            <Button type="submit">
              <Save className="h-4 w-4" />
              Simpan Profil Lembaga
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
