import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Achievement, SchoolProfile } from "@/lib/types";
import { ArrowRight, Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

interface AchievementsSectionProps {
  /** Prestasi dari server (urut tahun terbaru). */
  achievements: Achievement[];
  /** Profil untuk penyebutan nama lembaga di deskripsi. */
  profile: SchoolProfile;
}

export function AchievementsSection({ achievements, profile }: AchievementsSectionProps) {

  return (
    <section id="prestasi" className="py-14 lg:py-16 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="secondary" className="gap-2">
              <Trophy className="h-3 w-3 text-yazzaka-orange" />
              <span>Rekam Jejak Keberhasilan</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight leading-tight">
              Prestasi Santri &amp; Siswa Unggulan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Capaian membanggakan santri {profile.name} di ajang olimpiade sains nasional, musabaqah hifdzil Quran internasional, dan riset robotika.
            </p>
          </div>

          <Link href="/prestasi">
            <Button
              variant="outline"
              size="default"
              className="font-bold text-xs h-9 px-4 shrink-0"
            >
              <span>Lihat Semua Prestasi</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Headspace Achievement Cards Grid or EmptyState */}
        {achievements.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="Belum Ada Prestasi yang Tercatat"
            description="Prestasi santri di berbagai bidang olimpiade dan kejuaraan akan segera ditambahkan."
            action={{
              label: "Buka Halaman Prestasi",
              href: "/prestasi",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {achievements.slice(0, 4).map((ach) => (
              <div
                key={ach.id}
                className="bg-white border border-border rounded-lg overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={ach.imageUrl}
                    alt={ach.title}
                    fill
                    sizes="(min-width:1024px) 290px, (min-width:768px) 45vw, 90vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-1.5">
                      {ach.category} • {ach.year}
                    </Badge>
                    <h4 className="text-sm font-bold leading-snug line-clamp-2">
                      {ach.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-border space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Award className="h-3 w-3 text-amber-500" />
                      <span>{ach.studentName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {ach.competitionName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
