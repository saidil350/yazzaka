"use client";

import React from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Compass, Sparkles, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { OrganizationMember } from "@/lib/types";

// ── Sub-component: Philosophy Value Card (Panca Jiwa) ────────────────────────
interface ValueCardProps {
  index: number;
  title: string;
  description: string;
}

const VALUE_THEMES = [
  { bg: "bg-[#FFF0E5]", border: "border-[#FED7AA]", text: "text-[#C2410C]" },
  { bg: "bg-[#E0F2FE]", border: "border-[#BAE6FD]", text: "text-[#0369A1]" },
  { bg: "bg-[#EDE9FE]", border: "border-[#DDD6FE]", text: "text-[#6D28D9]" },
  { bg: "bg-[#DCFCE7]", border: "border-[#BBF7D0]", text: "text-[#15803D]" },
  { bg: "bg-[#FEF9C3]", border: "border-[#FEF08A]", text: "text-[#A16207]" },
] as const;

function PhilosophyCard({ index, title, description }: ValueCardProps) {
  const theme = VALUE_THEMES[index % VALUE_THEMES.length];

  return (
    <div
      className={`${theme.bg} ${theme.border} border-2 p-4 rounded-2xl space-y-1.5 shadow-xs`}
    >
      <span className={`text-[10px] font-extrabold uppercase ${theme.text} block`}>
        Jiwa 0{index + 1}
      </span>
      <h3 className="text-sm font-bold text-[#1E2330]">{title}</h3>
      <p className="text-xs text-stone-600 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

// ── Sub-component: Organization / Educator Member Card ────────────────────────
interface MemberCardProps {
  member: OrganizationMember;
}

function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="bg-white border-2 border-[#E8E2D8] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#FA6400]/40 transition-all">
      <div className="h-52 relative overflow-hidden bg-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.photoUrl}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-1">
        <span className="text-[10px] font-bold text-[#FA6400] uppercase tracking-wider block">
          {member.department}
        </span>
        <h3 className="text-sm font-bold text-[#1E2330] leading-snug">
          {member.name}
        </h3>
        <p className="text-xs text-stone-500 font-semibold">
          {member.roleTitle}
        </p>
        {member.qualifications && (
          <p className="text-[10px] text-stone-400 italic">
            {member.qualifications}
          </p>
        )}
        <p className="text-[11px] text-stone-600 pt-2 border-t border-stone-100 line-clamp-2 font-medium">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

const PRESET_DEPARTMENTS_ORDER = [
  "Taman Pendidikan Al-Qur'an (TPA)",
  "TKIT Yazzakka",
  "PKBM Yazzakka",
  "Sekolah Anak Shalih Yazzakka",
  "Darul Quran Yazzakka",
  "Pimpinan Yayasan",
];

export default function AboutPage() {
  const { profile, organization, sections } = useSchoolData();
  const [activeDept, setActiveDept] = React.useState("Semua");

  const teamSection = sections.find(
    (s) => s.key === "organization" || s.id === "sec-team"
  );
  const sectionTitle = teamSection?.title || "Pimpinan & Dewan Asatidz";
  const sectionSubtitle =
    teamSection?.subtitle ||
    "Pendidik berdedikasi tinggi yang memadukan kedalaman tradisi keilmuan Islam dan kompetensi sains modern.";

  const sortedMembers = [...organization].sort((a, b) => {
    if (activeDept === "Semua") {
      const idxA = PRESET_DEPARTMENTS_ORDER.indexOf(a.department);
      const idxB = PRESET_DEPARTMENTS_ORDER.indexOf(b.department);
      if (idxA !== -1 && idxB !== -1 && idxA !== idxB) {
        return idxA - idxB;
      }
    }
    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
  });

  const availableDepts = [
    "Semua",
    ...PRESET_DEPARTMENTS_ORDER.filter((dept) =>
      organization.some((m) => m.department === dept)
    ),
    ...Array.from(
      new Set(
        organization
          .map((m) => m.department)
          .filter((d) => d && !PRESET_DEPARTMENTS_ORDER.includes(d))
      )
    ),
  ];

  const displayedMembers =
    activeDept === "Semua"
      ? sortedMembers
      : sortedMembers.filter((m) => m.department === activeDept);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Page Hero Banner ─────────────────────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#6D28D9] font-bold text-xs mb-3 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Profil &amp; Filosofi Lembaga</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Tentang {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Sejarah dedikasi mencetak generasi muslim berilmu amaliah, beramal ilmiah, dan berakhlakul karimah sejak tahun {profile.establishedYear}.
            </p>
          </div>
        </section>

        {/* ── Narrative & History ──────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFF0E5] text-[#FA6400] font-bold text-xs border border-[#FED7AA]">
                  Identitas &amp; Landasan
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330] leading-snug">
                  Memadukan Kebeningan Sanad Pesantren dan Keunggulan Sains Kontemporer
                </h2>
                <div className="space-y-3 text-sm text-stone-600 leading-relaxed font-medium">
                  <p>{profile.description}</p>
                  <p>
                    Didirikan dengan tekad melahirkan generasi santri yang tidak hanya hafal Al-Qur&apos;an secara mutqin dan menguasai literatur kitab kuning, namun juga memiliki kecakapan sains, teknologi, dan kepemimpinan untuk menjawab tantangan zaman.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E8E2D8] text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E8E2D8]">
                    <span className="font-extrabold text-[#1E2330] block">NPSN Resmi:</span>
                    <span className="text-stone-600 font-semibold">{profile.npsn}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#E8E2D8]">
                    <span className="font-extrabold text-[#1E2330] block">Akreditasi BAN-S/M:</span>
                    <span className="text-emerald-700 font-bold">Peringkat {profile.accreditation} (Unggul)</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-3xl overflow-hidden border-2 border-[#E8E2D8] bg-[#FAF6EE] p-2 shadow-sm">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-stone-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80"
                      alt="Gedung Sekolah Yazzakka"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Vision & Mission ─────────────────────────── */}
        <section className="py-12 lg:py-14 bg-[#FAF6EE] border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-xs border border-[#BAE6FD]">
                Arah &amp; Tujuan
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
                Visi &amp; Misi Strategis Lembaga
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Vision Box */}
              <div className="lg:col-span-5 bg-[#EDE9FE] border-2 border-[#DDD6FE] p-6 rounded-3xl space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center">
                    <Compass className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D28D9]">
                    Visi Pokok
                  </span>
                </div>
                <p className="text-lg sm:text-xl text-[#1E2330] font-bold leading-snug">
                  &ldquo;{profile.vision}&rdquo;
                </p>
              </div>

              {/* Mission Items */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-[#E8E2D8] space-y-3 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Misi Penyelenggaraan Pendidikan
                </span>
                <div className="space-y-2">
                  {profile.mission.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#E8E2D8] flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-[#FFF0E5] text-[#FA6400] font-bold text-xs flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-[#1E2330] leading-relaxed font-medium">
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
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFF0E5] text-[#FA6400] font-bold text-xs border border-[#FED7AA]">
                Nilai Filosofis
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
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
        <section className="py-12 lg:py-14 bg-[#FAF6EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-xs border border-[#BBF7D0]">
                  Struktur &amp; Keteladanan
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
                  {sectionTitle}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  {sectionSubtitle}
                </p>
              </div>

              {/* Department Filter Tabs */}
              {availableDepts.length > 2 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {availableDepts.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeDept === dept
                          ? "bg-[#FA6400] text-white shadow-2xs"
                          : "bg-white text-stone-600 border border-[#E8E2D8] hover:bg-[#FFF0E5]"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {displayedMembers.length === 0 ? (
              <EmptyState>
                <EmptyState.Icon icon={Users} />
                <EmptyState.Title>Struktur Pengajar Sedang Diperbarui</EmptyState.Title>
                <EmptyState.Description>Profil pimpinan dan dewan asatidz akan segera dimuat dari sistem.</EmptyState.Description>
              </EmptyState>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {displayedMembers.map((lead) => (
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
