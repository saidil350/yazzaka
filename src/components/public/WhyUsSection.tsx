import React from "react";
import type { SchoolProfile } from "@/lib/types";
import {
  HeartHandshake,
  GraduationCap,
  Users,
  ShieldCheck,
  Landmark,
  ScrollText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WhyUsSectionProps {
  /** Profil sekolah dari server — sumber profile.values (Pilar Karakter). */
  profile: SchoolProfile;
}

export function WhyUsSection({ profile }: WhyUsSectionProps) {

  const iconPalette = [
    {
      icon: ScrollText,
    },
    {
      icon: HeartHandshake,
    },
    { icon: GraduationCap },
    { icon: Users },
    { icon: ShieldCheck },
    {
      icon: Landmark,
    },
  ];

  // Gunakan profile.values dari database CMS jika tersedia, atau fallback ke default list
  const displayItems =
    profile.values && profile.values.length > 0
      ? profile.values.map((v, idx) => {
          const style = iconPalette[idx % iconPalette.length];
          return { icon: style.icon, num: String(idx + 1).padStart(2, "0"), title: v.title, description: v.description };
        })
      : [
          {
            icon: ScrollText,
            num: "01",
            title: "Bimbingan Ulama Al-Azhar Kairo",
            description:
              "Kurikulum dan nilai pembinaan dibimbing langsung oleh Dr. Amri Fatmi, Lc., M.A. (Doktor Akidah Filsafat Al-Azhar Kairo Summa Cum Laude).",
          },
          {
            icon: HeartHandshake,
            num: "02",
            title: "Pendidikan Fitrah & Akhlakul Karimah",
            description:
              "Fokus utama pada penanaman akidah yang kokoh, adab islami dalam kehidupan sehari-hari, serta pembentukan karakter santri yang santun dan berbudi luhur.",
          },
          {
            icon: GraduationCap,
            num: "03",
            title: "Ekosistem Pendidikan Berjenjang",
            description:
              "Menaungi jenjang usia dini (TPA & TKIT), pembinaan karakter (Sekolah Anak Shalih), kesetaraan masyarakat (PKBM), hingga tahfiz Al-Qur'an 30 juz (Darul Quran).",
          },
          {
            icon: Users,
            num: "04",
            title: "Ketahanan & Edukasi Keluarga",
            description:
              "Menjadikan keluarga sebagai pilar utama pembinaan melalui program parenting berkala, kajian tematik, dan sinergi aktif antara asatizah dan orang tua.",
          },
          {
            icon: ShieldCheck,
            num: "05",
            title: "Legalitas Resmi SK Kemenkumham RI",
            description:
              "Lembaga berbadan hukum resmi dengan SK Kemenkumham RI No. AHU-0005614.AH.01.04. Tahun 2022, menjamin tata kelola yayasan yang amanah dan akuntabel.",
          },
          {
            icon: Landmark,
            num: "06",
            title: "Kawasan Pesantren Peradaban 6.0",
            description:
              "Inisiasi strategis pembangunan pesantren peradaban modern di Cot Rheng, Pidie, guna mencetak generasi ulama dan cendekiawan berwawasan global.",
          },
        ];

  return (
    <section id="keunggulan" className="py-14 lg:py-16 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <Badge variant="secondary">
            <span>Mengapa Memilih {profile.name}?</span>
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight leading-tight">
            Keunggulan &amp; Nilai Pokok Lembaga
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Memadukan bimbingan ulama, penguatan karakter tauhid &amp; adab, serta ekosistem belajar yang ramah anak, berjenjang, dan menyenangkan.
          </p>
        </div>

        {/* Playful Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-border rounded-lg p-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    Poin {adv.num}
                  </span>

                  <div className="space-y-2">
                    <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold leading-snug">
                      <Icon className="h-4 w-4 text-yazzaka-teal-dark shrink-0" strokeWidth={1.8} />
                      {adv.title}
                    </h3>

                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {adv.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
