import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton fallback untuk <Suspense> di dalam halaman publik — pola yang sama
 * dengan /berita (bukan loading.tsx level rute: loading.tsx membuat notFound()
 * di /berita/[slug] & /program/[slug] ter-stream dengan status 200 soft-404).
 *
 * Aturan bentuk: menyamai dimensi seksi aslinya (grid-cols, rasio gambar,
 * padding wrapper) agar tidak ada layout shift saat konten menggantikan
 * fallback (CLS) — lihat panduan streaming Next.js.
 *
 * File ini aman dirender di server (tanpa "use client"), sama seperti
 * ui/empty-state.
 */

// ── Helper: baris judul seksi (badge + judul + subjudul) ─────────────────────
function SectionHeaderSkeleton() {
  return (
    <div className="max-w-2xl space-y-2">
      <Skeleton className="h-6 w-40 rounded-md" />
      <Skeleton className="h-8 w-4/5 max-w-md" />
      <Skeleton className="h-4 w-full max-w-sm" />
    </div>
  );
}

// ── Helper: navigasi halaman (PaginationNav) ────────────────────────────────
function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <Skeleton className="h-9 w-28 rounded-md" />
      <Skeleton className="h-9 w-10 rounded-md" />
      <Skeleton className="h-9 w-28 rounded-md" />
    </div>
  );
}

// ── Hero banner standar halaman (badge + judul + paragraf, tengah) ───────────
// Menyamai hero /agenda, /galeri, /prestasi, /program.
export function PageHeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
        <Skeleton className="h-6 w-44 mx-auto mb-3 rounded-md" />
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto mt-3" />
      </div>
    </section>
  );
}

// ── Seksi carousel "Berita Unggulan" beranda ────────────────────────────────
export function CarouselSectionSkeleton() {
  return (
    <section className="py-12 lg:py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeaderSkeleton />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* Satu slide: kartu max-w-2xl dengan gambar 16/10 */}
        <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-border bg-card">
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="p-5 flex flex-col gap-2.5">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ── Seksi "Berita & Publikasi Terbaru" beranda (3 kartu) ─────────────────────
export function NewsSectionSkeleton() {
  return (
    <section className="py-16 lg:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeaderSkeleton />
          <Skeleton className="h-9 w-48 rounded-md shrink-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-card">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Seksi "Lembaga Pendidikan & Pembinaan" beranda (6 kartu) ─────────────────
export function HomeProgramsSkeleton() {
  return (
    <section className="py-16 lg:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeaderSkeleton />
          <Skeleton className="h-9 w-48 rounded-md shrink-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-card">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-28 rounded-md" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Seksi prestasi beranda (grid 4 kolom, 4/3) ──────────────────────────────
export function HomeAchievementsSkeleton() {
  return (
    <section className="py-14 lg:py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-3 w-2/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Seksi testimoni beranda (3 kartu kutipan) ───────────────────────────────
export function HomeTestimonialsSkeleton() {
  return (
    <section className="py-14 lg:py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeaderSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
              <div className="pt-3.5 mt-3 border-t border-border flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Grid agenda /agenda (9 kartu 16/10 + paginasi) ──────────────────────────
export function EventGridSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border overflow-hidden">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-12" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <PaginationSkeleton />
    </>
  );
}

// ── Grid galeri /galeri (12 foto 4/3 + paginasi) ────────────────────────────
export function GalleryGridSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
        ))}
      </div>
      <PaginationSkeleton />
    </>
  );
}

// ── Grid prestasi /prestasi (8 kartu 4/3 + paginasi) ────────────────────────
export function AchievementGridSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-28 rounded-md" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-3 w-2/3 mt-2" />
            </div>
          </div>
        ))}
      </div>
      <PaginationSkeleton />
    </>
  );
}

// ── Grid tim /tentang-kami (8 kartu 4/3) ────────────────────────────────────
export function MemberGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="p-4 space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Seksi "Program Lainnya" di /program/[slug] (4 kartu kecil) ──────────────
export function OtherProgramsSkeleton() {
  return (
    <section className="py-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-2.5">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Seksi lampiran di /berita/[slug] ────────────────────────────────────────
export function AttachmentsSkeleton() {
  return (
    <section className="mt-10 rounded-lg border border-border bg-card p-5">
      <Skeleton className="h-4 w-36" />
      <div className="mt-3 space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
          >
            <Skeleton className="size-4" />
            <Skeleton className="h-4 flex-1 max-w-xs" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </section>
  );
}
