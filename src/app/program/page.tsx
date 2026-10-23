"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Program } from "@/lib/types";
import { ArrowRight, CheckCircle2, Sparkles, Layers, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProgramsDirectoryPage() {
  const { programs, profile } = useSchoolData();

  const published = programs
    .filter((p) => p.status === "published")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const getUnitBadge = (prog: Program) => {
    const cat = (prog.category || "").toLowerCase();
    const slug = (prog.slug || "").toLowerCase();

    if (cat.includes("wakaf") || slug.includes("peradaban")) {
      return { tag: "Wakaf Pembangunan", variant: "default" as const };
    }
    if (cat.includes("tahfiz") || slug.includes("darul-quran")) {
      return { tag: "Tahfiz 30 Juz Bersanad", variant: "secondary" as const };
    }
    if (slug.includes("tpa")) {
      return { tag: "Pendidikan Al-Qur'an", variant: "secondary" as const };
    }
    if (slug.includes("tkit")) {
      return { tag: "TK Islam Terpadu", variant: "secondary" as const };
    }
    if (slug.includes("pkbm")) {
      return { tag: "Kesetaraan & Vokasi", variant: "secondary" as const };
    }
    if (slug.includes("anak-shalih") || slug.includes("karakter")) {
      return { tag: "Pembinaan Karakter", variant: "secondary" as const };
    }
    return { tag: prog.category || "Program Unggulan", variant: "secondary" as const };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* ── Page Hero ────────────────────────────────── */}
        <section className="bg-background py-10 lg:py-14 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <Badge variant="secondary" className="gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-yazzaka-teal-dark" />
                <span>Unit Pendidikan &amp; Program Strategis</span>
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Struktur Pendidikan {profile.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
                Menaungi {published.length} unit pendidikan formal, non-formal, tahfiz intensif Al-Qur&apos;an, serta program strategis di {profile.city}, {profile.province}.
              </p>
            </div>
          </div>
        </section>

        {/* ── Directory Grid ──────────────────────────── */}
        <section className="py-12 lg:py-14 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Programs Cards Grid or EmptyState */}
            {published.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="Tidak Ada Program Ditemukan"
                description="Belum ada program pendidikan yang dipublikasikan."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {published.map((prog) => {
                  const badgeInfo = getUnitBadge(prog);
                  const isSpecialWakaf = prog.category?.toLowerCase().includes("wakaf") || prog.slug.includes("peradaban");

                  return (
                    <Link
                      key={prog.id}
                      href={`/program/${prog.slug}`}
                      className="group block h-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <Card className="h-full overflow-hidden flex flex-col justify-between interactive-lift">
                        <div>
                          {/* Banner Image */}
                          <div className="aspect-[16/10] overflow-hidden bg-muted">
                            {prog.imageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={prog.imageUrl}
                                alt={prog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <BookOpen className="h-8 w-8" />
                              </div>
                            )}
                          </div>

                          {/* Content Body */}
                          <div className="p-5 space-y-3">
                            <Badge variant={badgeInfo.variant}>
                              {badgeInfo.tag}
                            </Badge>

                            <CardTitle className="text-lg font-bold text-foreground tracking-tight leading-snug">
                              {prog.title}
                            </CardTitle>

                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {prog.shortDesc}
                            </p>

                            {/* Features */}
                            {prog.features && prog.features.length > 0 && (
                              <div className="pt-3 border-t border-border space-y-2">
                                <span className="text-xs font-medium text-muted-foreground block">
                                  Fokus &amp; Capaian
                                </span>
                                {prog.features.slice(0, 3).map((feat, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="flex items-center gap-2 text-sm text-foreground font-medium"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-yazzaka-teal-dark shrink-0" />
                                    <span className="line-clamp-1">{feat}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Footer */}
                        <div className="px-5 pb-5">
                          <div className="flex items-center justify-between gap-2 border-t border-border pt-4 text-sm font-semibold text-foreground">
                            <span>
                              {isSpecialWakaf ? "Detail Wakaf & Masterplan" : "Rincian Kurikulum & Pendaftaran"}
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}

          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
