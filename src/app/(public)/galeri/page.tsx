import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { GalleryLightbox } from "@/components/public/GalleryLightbox";
import { PaginationNav } from "@/components/public/pagination-nav";
import { getPublicProfile, listGalleryMedia } from "@/lib/public-data";
import { initialSchoolProfile } from "@/lib/data/initialData";
import type { SchoolProfile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description:
    "Dokumentasi kegiatan santri, suasana pembelajaran, dan lingkungan Yayasan Bina Iman Akhlak Yazzakka.",
  alternates: { canonical: "/galeri" },
};

const GALLERY_PAGE_SIZE = 12;

type SearchParams = Promise<{ page?: string }>;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);

  const [profile, media] = await Promise.all([
    getPublicProfile(),
    listGalleryMedia(),
  ]);
  const safeProfile: SchoolProfile = profile ?? initialSchoolProfile;

  const totalPages = Math.max(1, Math.ceil(media.length / GALLERY_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageMedia = media.slice(
    (safePage - 1) * GALLERY_PAGE_SIZE,
    safePage * GALLERY_PAGE_SIZE
  );

  const buildGalleryPageHref = (p: number) =>
    p > 1 ? `/galeri?page=${p}` : "/galeri";

  return (
    <>
      {/* ── Headspace Warm Page Hero Banner ─────────── */}
      <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <Badge variant="secondary" className="mb-3">
            <span>Dokumentasi Foto</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Galeri Kegiatan {safeProfile.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Foto kegiatan santri, suasana belajar di kelas, dan lingkungan sekolah.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────── */}
      <section className="py-12 lg:py-14 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {media.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Tidak Ada Media Ditemukan"
              description="Belum ada berkas media galeri yang dipublikasikan."
            />
          ) : (
            <>
              <GalleryLightbox items={pageMedia} />
              <PaginationNav
                currentPage={safePage}
                totalPages={totalPages}
                buildHref={buildGalleryPageHref}
                ariaLabel="Navigasi halaman galeri"
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
