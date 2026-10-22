import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Clock, Newspaper, Search } from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { listArticles, listCategories } from "@/lib/news/service";
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

type SearchParams = Promise<{ q?: string; kategori?: string; page?: string }>;

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, kategori, page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);
  const searchQuery = q?.trim() ?? "";
  const activeCategory = kategori?.trim() ?? "";

  const [profile, categories, result] = await Promise.all([
    getSchoolProfile(),
    listCategories(),
    listArticles({
      status: ["published"],
      categorySlug: activeCategory || null,
      q: searchQuery || null,
      page: currentPage,
      pageSize: PAGE_SIZE_DEFAULT,
    }),
  ]);

  const schoolName = profile?.name || "Yazzaka";
  const visibleCategories = categories.filter((c) => c.articleCount > 0);

  const buildPageHref = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();
    const merged = { q: searchQuery, kategori: activeCategory, ...overrides };
    if (merged.q) params.set("q", merged.q);
    if (merged.kategori) params.set("kategori", merged.kategori);
    if (overrides.page) params.set("page", overrides.page);
    const qs = params.toString();
    return qs ? `/berita?${qs}` : "/berita";
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
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

        {/* Daftar berita */}
        <section className="border-b border-border bg-background py-12 lg:py-14">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            {/* Filter kategori + pencarian */}
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex w-full flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card p-1 md:w-auto">
                <Link
                  href={buildPageHref({ kategori: null, page: null })}
                  aria-current={!activeCategory ? "page" : undefined}
                  className={[
                    "cursor-pointer rounded-md px-3.5 py-1 text-xs font-semibold transition-colors",
                    !activeCategory
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-background hover:text-foreground",
                  ].join(" ")}
                >
                  Semua
                </Link>
                {visibleCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={buildPageHref({ kategori: cat.slug, page: null })}
                    aria-current={activeCategory === cat.slug ? "page" : undefined}
                    className={[
                      "cursor-pointer rounded-md px-3.5 py-1 text-xs font-semibold transition-colors",
                      activeCategory === cat.slug
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-background hover:text-foreground",
                    ].join(" ")}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <form action="/berita" method="get" className="w-full md:w-72">
                {activeCategory ? (
                  <input type="hidden" name="kategori" value={activeCategory} />
                ) : null}
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
                    className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-xs font-medium outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>
              </form>
            </div>

            {/* Grid artikel */}
            {result.items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {result.items.map((art) => (
                    <article
                      key={art.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40"
                    >
                      <div>
                        <div className="relative h-48 overflow-hidden bg-muted">
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
                          {art.category ? (
                            <div className="absolute left-3 top-3 rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                              {art.category}
                            </div>
                          ) : null}
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
                              className="font-bold text-foreground transition-colors group-hover:text-primary"
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
            ) : (
              <EmptyState
                icon={Newspaper}
                title="Tidak Ada Artikel Ditemukan"
                description={
                  searchQuery
                    ? `Tidak ditemukan warta dengan kata kunci "${searchQuery}".`
                    : "Belum ada artikel yang dipublikasikan dalam kategori ini."
                }
                action={
                  searchQuery || activeCategory
                    ? { label: "Reset Pencarian", href: "/berita" }
                    : undefined
                }
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
