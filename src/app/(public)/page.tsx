import { HeroSection } from "@/components/public/HeroSection";
import { NewsCarouselSection } from "@/components/public/NewsCarouselSection";
import { TrustStats } from "@/components/public/TrustStats";
import { EditorialAbout } from "@/components/public/EditorialAbout";
import { ProgramsSection } from "@/components/public/ProgramsSection";
import { WhyUsSection } from "@/components/public/WhyUsSection";
import { NewsSection } from "@/components/public/NewsSection";
import { AchievementsSection } from "@/components/public/AchievementsSection";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
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

// Beranda dirender penuh di server (ISR 60 dtk dari root layout): HTML
// pertama sudah berisi konten asli, tanpa EmptyState lalu pop-in fetch client.

async function getHomeData() {
  const [profile, sections, programs, achievements, testimonials, articlesResult] =
    await Promise.all([
      getPublicProfile(),
      getServerSections(),
      listPublishedPrograms(),
      listAchievements(),
      listTestimonials(),
      // 6 = maksimum yang dirender (carousel 6 slide + NewsSection ambil 3
      // dari sana) — sisanya hanya membesarkan payload RSC halaman.
      listArticles({ status: ["published"], q: null, page: 1, pageSize: 6 }),
    ]);
  return { profile, sections, programs, achievements, testimonials, articles: articlesResult.items };
}

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
  const { profile, sections, programs, achievements, testimonials, articles } =
    await getHomeData();

  // DB gagal → profil jatuh ke fallback demo (perilaku sama seperti context lama);
  // koleksi kosong → seksi masing-masing menampilkan EmptyState.
  const safeProfile: SchoolProfile = profile ?? initialSchoolProfile;
  const homeArticles: Article[] = articles;

  // hero di DB bersifat parsial (JSONB default '{}') — gabungkan dengan default
  // agar seksi tetap tampil utuh sebelum konten diisi dari CMS.
  const hero = { ...DEFAULT_HERO, ...safeProfile.hero };

  return (
    <>
      {isSectionEnabled(sections, "hero") && (
        <HeroSection hero={hero} schoolName={safeProfile.name} />
      )}
      {isSectionEnabled(sections, "news_carousel") && (
        <NewsCarouselSection articles={homeArticles} />
      )}
      {isSectionEnabled(sections, "stats") && <TrustStats profile={safeProfile} />}
      {isSectionEnabled(sections, "about") && <EditorialAbout profile={safeProfile} />}
      {isSectionEnabled(sections, "programs") && <ProgramsSection programs={programs} />}
      {isSectionEnabled(sections, "whyus") && <WhyUsSection profile={safeProfile} />}
      {isSectionEnabled(sections, "berita") && <NewsSection articles={homeArticles} />}
      {isSectionEnabled(sections, "achievements") && (
        <AchievementsSection achievements={achievements} profile={safeProfile} />
      )}
      {isSectionEnabled(sections, "testimonials") && (
        <TestimonialsSection testimonials={testimonials} profile={safeProfile} />
      )}
    </>
  );
}
