"use client";

import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Users, Image as ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { OrganizationMember } from "@/lib/types";
import { DEFAULT_FOUNDATION } from "@/lib/data/initialData";

// ── Sub-component: Philosophy Value Card (Panca Jiwa) ────────────────────────
interface ValueCardProps {
  index: number;
  title: string;
  description: string;
}

function PhilosophyCard({ index, title, description }: ValueCardProps) {
  return (
    <div className="bg-card border border-border p-4 rounded-lg space-y-1.5">
      <span className="text-xs text-muted-foreground block">
        Jiwa {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// ── Sub-component: Foundation Data Row ───────────────────────────────────────
interface DataRowProps {
  label: string;
  children: React.ReactNode;
}

function FoundationDataRow({ label, children }: DataRowProps) {
  return (
    <div className="py-3 border-b border-border last:border-b-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
      <dt className="text-xs font-medium text-muted-foreground sm:pt-0.5">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-foreground sm:col-span-2 leading-relaxed">
        {children}
      </dd>
    </div>
  );
}

// ── Sub-component: Organization / Educator Member Card ────────────────────────
interface MemberCardProps {
  member: OrganizationMember;
}

function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col justify-between">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {member.photoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <span className="text-xs text-muted-foreground block">
          {member.department}
        </span>
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {member.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {member.roleTitle}
        </p>
        {member.qualifications && (
          <p className="text-xs text-muted-foreground italic">
            {member.qualifications}
          </p>
        )}
        <p className="text-xs text-muted-foreground pt-2 border-t border-border line-clamp-2">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { profile, organization, sections } = useSchoolData();
  const foundation = profile.foundation ?? DEFAULT_FOUNDATION;

  const teamSection = sections.find(
    (s) => s.key === "organization" || s.id === "sec-team"
  );
  const sectionTitle = teamSection?.title || "Pimpinan & Dewan Asatidz";
  const sectionSubtitle =
    teamSection?.subtitle ||
    "Pendidik berdedikasi tinggi yang memadukan kedalaman tradisi keilmuan Islam dan kompetensi sains modern.";

  const sortedMembers = [...organization].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* ── Page Hero Banner ─────────────────────────── */}
        <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <Badge variant="secondary" className="mb-3">
              Profil &amp; Filosofi Lembaga
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Tentang {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
              Sejarah dedikasi mencetak generasi muslim berilmu amaliah, beramal ilmiah, dan berakhlakul karimah sejak tahun {profile.establishedYear}.
            </p>
          </div>
        </section>

        {/* ── Narrative & History ──────────────────────── */}
        <section className="py-12 lg:py-14 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              <div className="lg:col-span-6 space-y-4">
                <Badge variant="secondary">
                  Identitas &amp; Landasan
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
                  Memadukan Kebeningan Sanad Pesantren dan Keunggulan Sains Kontemporer
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>{profile.description}</p>
                  <p>
                    Didirikan dengan tekad melahirkan generasi santri yang tidak hanya hafal Al-Qur&apos;an secara mutqin dan menguasai literatur kitab kuning, namun juga memiliki kecakapan sains, teknologi, dan kepemimpinan untuk menjawab tantangan zaman.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground block">SK Kemenkumham RI</span>
                    <span className="text-sm font-semibold text-foreground">{foundation.skNumber}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Nomor Induk Yayasan</span>
                    <span className="text-sm font-semibold text-foreground">{foundation.registryNumber}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="aspect-[4/3] relative overflow-hidden rounded-lg border border-border bg-muted">
                  {profile.aboutImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={profile.aboutImageUrl}
                      alt={`Gedung ${profile.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs">
                        Foto gedung diunggah via CMS Profil Lembaga
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Foundation Data & Legality ──────────────── */}
        <section className="py-12 lg:py-14 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="max-w-3xl space-y-2">
              <Badge variant="secondary">
                Badan Hukum &amp; Legalitas
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Data Yayasan
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-card border border-border rounded-lg p-6">
                <dl>
                  <FoundationDataRow label="Nama Yayasan">
                    {profile.name}
                  </FoundationDataRow>
                  <FoundationDataRow label="Nomor SK Kemenkumham RI">
                    {foundation.skNumber}
                  </FoundationDataRow>
                  <FoundationDataRow label="Nomor Induk Yayasan">
                    {foundation.registryNumber}
                  </FoundationDataRow>
                  <FoundationDataRow label="Berdiri Sejak">
                    {profile.establishedYear}
                  </FoundationDataRow>
                  <FoundationDataRow label="Pendiri">
                    <ol className="space-y-1">
                      {foundation.founders.map((founder, idx) => (
                        <li key={idx}>
                          {idx + 1}. {founder}
                        </li>
                      ))}
                    </ol>
                  </FoundationDataRow>
                  <FoundationDataRow label="Ketua Yayasan">
                    {foundation.chairman}
                  </FoundationDataRow>
                  <FoundationDataRow label="Contact Person">
                    {foundation.contactPerson}
                  </FoundationDataRow>
                  <FoundationDataRow label="Email Yayasan">
                    <a href={`mailto:${foundation.email}`} className="hover:underline break-all">
                      {foundation.email}
                    </a>
                  </FoundationDataRow>
                </dl>
              </div>

              <div className="lg:col-span-5 bg-card border border-border rounded-lg p-6 space-y-4">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Legalitas Yayasan
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.name} merupakan badan hukum resmi yang telah
                  disahkan oleh Kementerian Hukum dan Hak Asasi Manusia
                  Republik Indonesia melalui SK Nomor{" "}
                  <span className="font-semibold text-foreground">
                    {foundation.skNumber}
                  </span>{" "}
                  dengan Nomor Induk Yayasan{" "}
                  <span className="font-semibold text-foreground">
                    {foundation.registryNumber}
                  </span>
                  , saat ini dipimpin oleh{" "}
                  <span className="font-semibold text-foreground">
                    {foundation.chairman}
                  </span>{" "}
                  selaku Ketua Yayasan.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ── Vision & Mission ─────────────────────────── */}
        <section className="py-12 lg:py-14 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="max-w-3xl space-y-2">
              <Badge variant="secondary">
                Arah &amp; Tujuan
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Visi &amp; Misi Strategis Lembaga
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Vision Box */}
              <div className="lg:col-span-5 bg-card border border-border p-6 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Visi Pokok
                </span>
                <p className="text-lg sm:text-xl text-foreground font-bold leading-snug">
                  &ldquo;{profile.vision}&rdquo;
                </p>
              </div>

              {/* Mission Items */}
              <div className="lg:col-span-7 bg-card border border-border p-6 rounded-lg space-y-3">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Misi Penyelenggaraan Pendidikan
                </span>
                <div className="divide-y divide-border">
                  {profile.mission.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0"
                    >
                      <span className="text-xs font-semibold text-muted-foreground tabular-nums pt-0.5 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── Panca Jiwa Values ────────────────────────── */}
        <section className="py-12 lg:py-14 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="max-w-3xl space-y-2">
              <Badge variant="secondary">
                Nilai Filosofis
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Panca Jiwa Pondok Pesantren {profile.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {profile.values.map((val, idx) => (
                <PhilosophyCard
                  key={idx}
                  index={idx}
                  title={val.title}
                  description={val.description}
                />
              ))}
            </div>

          </div>
        </section>

        {/* ── Leadership & Educators ───────────────────── */}
        <section className="py-12 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-2">
                <Badge variant="secondary">
                  Struktur &amp; Keteladanan
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {sectionTitle}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {sectionSubtitle}
                </p>
              </div>
            </div>

            {sortedMembers.length === 0 ? (
              <EmptyState>
                <EmptyState.Icon icon={Users} />
                <EmptyState.Title>Struktur Pengajar Sedang Diperbarui</EmptyState.Title>
                <EmptyState.Description>Profil pimpinan dan dewan asatidz akan segera dimuat dari sistem.</EmptyState.Description>
              </EmptyState>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {sortedMembers.map((lead) => (
                  <MemberCard key={lead.id} member={lead} />
                ))}
              </div>
            )}

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
