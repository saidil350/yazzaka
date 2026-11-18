import { cache, Suspense } from "react";
import { HeroSection } from "@/components/public/HeroSection";
import { NewsCarouselSection } from "@/components/public/NewsCarouselSection";
import { TrustStats } from "@/components/public/TrustStats";
import { EditorialAbout } from "@/components/public/EditorialAbout";
import { ProgramsSection } from "@/components/public/ProgramsSection";
import { WhyUsSection } from "@/components/public/WhyUsSection";
import { NewsSection } from "@/components/public/NewsSection";
import { AchievementsSection } from "@/components/public/AchievementsSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import {
  CarouselSectionSkeleton,
  NewsSectionSkeleton,
  HomeProgramsSkeleton,
  HomeAchievementsSkeleton,
  HomeTestimonialsSkeleton,
} from "@/components/public/page-skeletons";
import { listArticles } from "@/lib/news/service";
import {
  getPublicProfile,
  listAchievements,
  listPublishedPrograms,
  listTestimonials,
} from "@/lib/public-data";
import { getServerSections } from "@/lib/sections-server";
import { DEFAULT_HERO, initialSchoolProfile } from "@/lib/data/initialData";
import type { Article } from "@/lib/news/types";
import type { SchoolProfile } from "@/lib/types";

// Beranda dirender di server (ISR 60 dtk dari root layout): HTML pertama sudah
// berisi konten asli, tanpa EmptyState lalu pop-in fetch client.
//
// Streaming: profil + sections (React cache — di-dedupe dengan bacaan yang
// sama di (public)/layout) dirender langsung sebagai shell; daftar program,
// prestasi, testimoni, dan artikel mengalir lewat <Suspense> per seksi dengan
// fallback skeleton berbentuk seksi. TIDAK ada loading.tsx di rute ini —
// konvensi skeleton publik repo adalah Suspense in-page (lihat /berita).

// 6 = maksimum yang dirender (carousel 6 slide + NewsSection ambil 3 dari
// sana) — sisanya hanya membesarkan payload RSC halaman. Dibungkus React
// cache() agar dipakai bersama oleh carousel & NewsSection tanpa query dobel;
// listArticles melempar error saat DB gagal — di-degrade ke [] supaya
// beranda tetap utuh (EmptyState) alih-alih 500.
const getHomeArticles = cache(async (): Promise<Article[]> => {
  try {
    const result = await listArticles({
      status: ["published"],
      q: null,
      page: 1,
      pageSize: 6,
    });
    return result.items;
  } catch {
    return [];
  }
});

// Memeriksa status enabled seksi beranda sesuai konfigurasi CMS
// (key tidak ditemukan di DB → dianggap aktif, perilaku lama dipertahankan).
const isSectionEnabled = (
  sections: Awaited<ReturnType<typeof getServerSections>>,
  key: string
) => {
  const sec = sections.find((s) => s.key === key);
  return sec ? sec.isEnabled : true;
};

export default async function HomePage() {
  const [profile, sections] = await Promise.all([
    getPublicProfile(),
    getServerSections(),
  ]);

  // DB gagal → profil jatuh ke fallback demo (perilaku sama seperti context lama);
  // koleksi kosong → seksi masing-masing menampilkan EmptyState.
  const safeProfile: SchoolProfile = profile ?? initialSchoolProfile;

  // hero di DB bersifat parsial (JSONB default '{}') — gabungkan dengan default
  // agar seksi tetap tampil utuh sebelum konten diisi dari CMS.
  const hero = { ...DEFAULT_HERO, ...safeProfile.hero };

  return (
    <>
      {isSectionEnabled(sections, "hero") && (
        <HeroSection hero={hero} schoolName={safeProfile.name} />
      )}
      {isSectionEnabled(sections, "news_carousel") && (
        <Suspense fallback={<CarouselSectionSkeleton />}>
          <HomeNewsCarousel />
        </Suspense>
      )}
      {isSectionEnabled(sections, "stats") && <TrustStats profile={safeProfile} />}
      {isSectionEnabled(sections, "about") && <EditorialAbout profile={safeProfile} />}
      {isSectionEnabled(sections, "programs") && (
        <Suspense fallback={<HomeProgramsSkeleton />}>
          <HomePrograms />
        </Suspense>
      )}
      {isSectionEnabled(sections, "whyus") && <WhyUsSection profile={safeProfile} />}
      {isSectionEnabled(sections, "berita") && (
        <Suspense fallback={<NewsSectionSkeleton />}>
          <HomeNews />
        </Suspense>
      )}
      {isSectionEnabled(sections, "achievements") && (
        <Suspense fallback={<HomeAchievementsSkeleton />}>
          <HomeAchievements profile={safeProfile} />
        </Suspense>
      )}
      {isSectionEnabled(sections, "testimonials") && (
        <Suspense fallback={<HomeTestimonialsSkeleton />}>
          <HomeTestimonials profile={safeProfile} />
        </Suspense>
      )}
    </>
  );
}

async function HomeNewsCarousel() {
  const articles = await getHomeArticles();
  return <NewsCarouselSection articles={articles} />;
}

async function HomePrograms() {
  const programs = await listPublishedPrograms();
  return <ProgramsSection programs={programs} />;
}

async function HomeNews() {
  const articles = await getHomeArticles();
  return <NewsSection articles={articles} />;
}

async function HomeAchievements({ profile }: { profile: SchoolProfile }) {
  const achievements = await listAchievements();
  return <AchievementsSection achievements={achievements} profile={profile} />;
}

async function HomeTestimonials({ profile }: { profile: SchoolProfile }) {
  const testimonials = await listTestimonials();
  return <TestimonialsSection testimonials={testimonials} profile={profile} />;
}
