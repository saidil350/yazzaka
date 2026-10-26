import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Newspaper, Search } from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listArticles } from "@/lib/news/service";
import { getSchoolProfile } from "@/lib/school-profile";
import { formatDateIndonesian } from "@/lib/utils";
import { PAGE_SIZE_DEFAULT } from "@/lib/news/types";

export const metadata: Metadata = {
  title: "Berita & Warta",
  description:
    "Dokumentasi kegiatan santri, wawasan pendidikan islami, capaian prestasi, dan informasi resmi pesantren.",
  alternates: { canonical: "/berita" },
  openGraph: {
    title: "Berita & Warta",
    description:
      "Dokumentasi kegiatan santri, wawasan pendidikan islami, capaian prestasi, dan informasi resmi pesantren.",
    type: "website",
  },
};

type SearchParams = Promise<{ q?: string; page?: string }>;

// Catatan arsitektur: skeleton daftar dipasang lewat <Suspense> DI DALAM halaman
// (bukan loading.tsx level rute) — loading.tsx rute membuat notFound() di
// /berita/[slug] ter-stream dengan status 200 (soft-404). Halaman ini tidak
// memanggil notFound(), jadi boundary Suspense aman untuk kontennya.
export default async function BeritaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);
  const searchQuery = q?.trim() ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <Suspense fallback={<HeroSkeleton />}>
          <BeritaHero />
        </Suspense>

        {/* Daftar berita */}
        <section className="border-b border-border bg-background py-12 lg:py-14">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            {/* Pencarian */}
            <form action="/berita" method="get" className="w-full md:ml-auto md:w-72">
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Cari artikel..."
                  aria-label="Cari artikel"
                  className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-xs font-medium outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-muted-foreground/40"
                />
              </div>
            </form>

            {/* Grid artikel */}
            <Suspense fallback={<ArticleGridSkeleton />}>
              <ArticleGrid searchQuery={searchQuery} currentPage={currentPage} />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

async function BeritaHero() {
  const profile = await getSchoolProfile();
  const schoolName = profile?.name || "Yazzaka";

  return (
    <section className="border-b border-border bg-card py-10 lg:py-14">
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Badge variant="secondary" className="gap-2 mb-3">
          <Newspaper className="size-3.5" aria-hidden="true" />
          <span>Warta &amp; Kabar Terkini</span>
        </Badge>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
          Warta &amp; Publikasi {schoolName}
        </h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
          Dokumentasi kegiatan santri, wawasan pendidikan islami, capaian
          prestasi, dan informasi resmi pesantren.
        </p>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="border-b border-border bg-card py-10 lg:py-14">
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Skeleton className="mx-auto mb-3 h-6 w-44" />
        <Skeleton className="mx-auto h-10 w-3/4" />
        <Skeleton className="mx-auto mt-3 h-4 w-2/3" />
      </div>
    </section>
  );
}

async function ArticleGrid({
  searchQuery,
  currentPage,
}: {
  searchQuery: string;
  currentPage: number;
}) {
  const result = await listArticles({
    status: ["published"],
    q: searchQuery || null,
    page: currentPage,
    pageSize: PAGE_SIZE_DEFAULT,
  });

  const buildPageHref = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();
    const merged = { q: searchQuery, ...overrides };
    if (merged.q) params.set("q", merged.q);
    if (overrides.page) params.set("page", overrides.page);
    const qs = params.toString();
    return qs ? `/berita?${qs}` : "/berita";
  };

  if (result.items.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="Tidak Ada Artikel Ditemukan"
        description={
          searchQuery
            ? `Tidak ditemukan warta dengan kata kunci "${searchQuery}".`
            : "Belum ada artikel yang dipublikasikan."
        }
        action={
          searchQuery
            ? { label: "Reset Pencarian", href: "/berita" }
            : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {result.items.map((art) => (
          <article
            key={art.id}
            className="group flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card"
          >
            <div>
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {art.coverImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center bg-primary/5"
                    aria-hidden="true"
                  >
                    <Newspaper className="size-10 text-primary/40" />
                  </div>
                )}
              </div>

              <div className="space-y-2.5 p-5">
                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" aria-hidden="true" />
                    {formatDateIndonesian(art.publishedDate)}
                  </span>
                  {art.readTime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" aria-hidden="true" />
                      {art.readTime}
                    </span>
                  ) : null}
                </div>

                <h2 className="line-clamp-2 leading-snug">
                  <Link
                    href={`/berita/${art.slug}`}
                    className="font-bold text-foreground"
                  >
                    {art.title}
                  </Link>
                </h2>

                {art.excerpt ? (
                  <p className="line-clamp-3 text-xs font-medium leading-relaxed text-muted-foreground">
                    {art.excerpt}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                href={`/berita/${art.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary"
                aria-label={`Baca selengkapnya: ${art.title}`}
              >
                Baca Selengkapnya
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Paginasi */}
      {result.totalPages > 1 ? (
        <nav
          aria-label="Navigasi halaman berita"
          className="flex items-center justify-center gap-2"
        >
          {currentPage > 1 ? (
            <Link
              href={buildPageHref({ page: String(currentPage - 1) })}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={buildPageHref({ page: String(p) })}
                aria-current={p === currentPage ? "page" : undefined}
                aria-label={`Halaman ${p}`}
                className={[
                  "inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                  p === currentPage
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {p}
              </Link>
            )
          )}
          {currentPage < result.totalPages ? (
            <Link
              href={buildPageHref({ page: String(currentPage + 1) })}
              className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

function ArticleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="space-y-2.5 p-5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
