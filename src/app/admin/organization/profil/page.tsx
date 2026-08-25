"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Building2, User } from "lucide-react";

export default function AdminOrgProfilePage() {
  const { profile, updateProfile } = useSchoolData();
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

  // Principal
  const [principalName, setPrincipalName] = useState(profile.principal.name);
  const [principalTitle, setPrincipalTitle] = useState(profile.principal.title);
  const [principalPhoto, setPrincipalPhoto] = useState(profile.principal.photoUrl);
  const [principalWelcome, setPrincipalWelcome] = useState(profile.principal.welcomeMessage);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      tagline,
      npsn,
      accreditation,
      establishedYear: Number(establishedYear),
      studentCount: Number(studentCount),
      teacherCount: Number(teacherCount),
      alumniCount: Number(alumniCount),
      hafizCount: Number(hafizCount),
      principal: {
        name: principalName,
        title: principalTitle,
        photoUrl: principalPhoto,
        welcomeMessage: principalWelcome,
      },
    });
    toast("Profil resmi dan data statistik lembaga berhasil diperbarui!", "success");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Organization / Profil Lembaga
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Profil Resmi & Identitas Sekolah
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Kelola nama resmi lembaga, NPSN, akreditasi, data statistik kunci, serta informasi pimpinan sekolah.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
          <h3 className="text-base font-bold text-[#1E2330]">
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
          <div className="pt-4 border-t border-[#E8E2D8]">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] mb-4 block">
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
        </div>

        {/* Principal Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
          <h3 className="text-base font-bold text-[#1E2330]">
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

          <Input
            label="URL Foto Pimpinan"
            value={principalPhoto}
            onChange={(e) => setPrincipalPhoto(e.target.value)}
          />

          <Textarea
            label="Sambutan Singkat Pimpinan"
            rows={5}
            value={principalWelcome}
            onChange={(e) => setPrincipalWelcome(e.target.value)}
          />

          <div className="flex justify-end pt-4 border-t border-[#E8E2D8]">
            <Button type="submit" variant="default" size="default" className="font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
              <Save className="h-4 w-4" />
              Simpan Profil Lembaga
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
