import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { getPublicProfile } from "@/lib/public-data";
import { getServerSections } from "@/lib/sections-server";
import { getSeoSettings } from "@/lib/seo-settings";
import { initialSchoolProfile } from "@/lib/data/initialData";
import type { SchoolProfile } from "@/lib/types";

/**
 * Layout bersama seluruh halaman publik. Header/Footer dirender di sini
 * dengan data dari DB (React cache() — sekali per request) sehingga HTML
 * pertama sudah berisi konten asli; tidak ada lagi fetch client-side
 * /api/school-data di jalur publik.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, sections, seo] = await Promise.all([
    getPublicProfile(),
    getServerSections(),
    getSeoSettings(),
  ]);

  // DB gagal → profil fallback demo (situs tetap utuh, bukan 500).
  const safeProfile: SchoolProfile = profile ?? initialSchoolProfile;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header profile={safeProfile} sections={sections} />
      <main className="flex-1">{children}</main>
      <Footer profile={safeProfile} socialMedia={seo.socialMedia} />
    </div>
  );
}
