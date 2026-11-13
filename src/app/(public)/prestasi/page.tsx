import type { Metadata } from "next";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { PaginationNav } from "@/components/public/pagination-nav";
import { getPublicProfile, listAchievements } from "@/lib/public-data";
import { initialSchoolProfile } from "@/lib/data/initialData";
import type { SchoolProfile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Prestasi & Penghargaan",
  description:
    "Rekam jejak prestasi santri Yazzakka di olimpiade sains nasional, musabaqah hifdzil Quran internasional, dan riset robotika.",
  alternates: { canonical: "/prestasi" },
};

const ACHIEVEMENTS_PAGE_SIZE = 8;

type SearchParams = Promise<{ page?: string }>;

export default async function AchievementsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);

  const [profile, achievements] = await Promise.all([
    getPublicProfile(),
    listAchievements(),
  ]);
  const safeProfile: SchoolProfile = profile ?? initialSchoolProfile;

  const totalPages = Math.max(
    1,
    Math.ceil(achievements.length / ACHIEVEMENTS_PAGE_SIZE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const pageAchievements = achievements.slice(
    (safePage - 1) * ACHIEVEMENTS_PAGE_SIZE,
    safePage * ACHIEVEMENTS_PAGE_SIZE
  );

  const buildAchievementsPageHref = (p: number) =>
    p > 1 ? `/prestasi?page=${p}` : "/prestasi";

  return (
    <>
      {/* ── Headspace Warm Page Hero Banner ─────────── */}
      <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <Badge variant="secondary" className="mb-3">
            <span>Rekam Jejak Keberhasilan</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Prestasi &amp; Penghargaan Santri
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Capaian santri {safeProfile.name} di ajang olimpiade sains, musabaqah hifdzil Quran, dan robotika.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────── */}
      <section className="py-12 lg:py-14 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Grid or EmptyState */}
          {achievements.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="Tidak Ada Prestasi Ditemukan"
              description="Belum ada rekaman prestasi santri yang dipublikasikan."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {pageAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-white border border-border rounded-lg overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {ach.imageUrl ? (
                      <Image
                        src={ach.imageUrl}
                        alt={ach.title}
                        fill
                        sizes="(min-width:1024px) 290px, (min-width:768px) 45vw, 90vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Trophy className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-1.5">
                        {ach.category} • {ach.year}
                      </Badge>
                      <h3 className="text-sm font-bold leading-snug line-clamp-2">
                        {ach.title}
                      </h3>
                    </div>

                    <div className="pt-2.5 border-t border-border space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
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

              <PaginationNav
                currentPage={safePage}
                totalPages={totalPages}
                buildHref={buildAchievementsPageHref}
                ariaLabel="Navigasi halaman prestasi"
              />
            </>
          )}

        </div>
      </section>
    </>
  );
}
