import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { GalleryLightbox } from "@/components/public/GalleryLightbox";
import { getPublicProfile, listGalleryMedia } from "@/lib/public-data";
import { initialSchoolProfile } from "@/lib/data/initialData";
import type { SchoolProfile } from "@/lib/types";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description:
    "Dokumentasi kegiatan santri, suasana pembelajaran, dan lingkungan Yayasan Bina Iman Akhlak Yazzakka.",
  alternates: { canonical: "/galeri" },
};

export default async function GalleryPage() {
  const [profile, media] = await Promise.all([
    getPublicProfile(),
    listGalleryMedia(),
  ]);
  const safeProfile: SchoolProfile = profile ?? initialSchoolProfile;

  return (
    <>
      {/* ── Headspace Warm Page Hero Banner ─────────── */}
      <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <Badge variant="secondary" className="mb-3">
            <span>Dokumentasi Visual &amp; Multimedia</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Galeri Kegiatan {safeProfile.name}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Merekam dinamika keseharian santri, suasana pembelajaran di kelas, keasrian lingkungan sekolah, dan kebersamaan ukhuwah.
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
            <GalleryLightbox items={media} />
          )}
        </div>
      </section>
    </>
  );
}
