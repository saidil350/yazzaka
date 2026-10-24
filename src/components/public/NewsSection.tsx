"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Calendar, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateIndonesian } from "@/lib/utils";

export function NewsSection() {
  const { articles } = useSchoolData();

  // /api/school-data sudah memfilter published & mengurutkan terbaru,
  // filter di sini hanya pengaman untuk fallback initialData.
  const latest = articles
    .filter((a) => a.status === "published")
    .slice(0, 3);

  const [lead, ...rest] = latest;

  return (
    <section id="berita" className="landing-section py-16 lg:py-20 border-b border-border scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="secondary" className="gap-2">
              <Newspaper className="h-3 w-3 text-yazzaka-teal-dark" />
              <span>Warta &amp; Kabar Terkini</span>
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Berita &amp; Publikasi Terbaru
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Dokumentasi kegiatan santri, pengumuman resmi, dan wawasan pendidikan islami.
            </p>
          </div>

          <Link href="/berita">
            <Button
              variant="outline"
              size="default"
              className="font-bold text-xs h-9 px-4 shrink-0 shadow-xs"
            >
              <span>Indeks Warta Lengkap</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Articles or EmptyState */}
        {latest.length === 0 || !lead ? (
          <EmptyState
            icon={Newspaper}
            title="Belum Ada Berita"
            description="Artikel dan pengumuman akan tampil di sini setelah dipublikasikan."
            action={{ label: "Buka Indeks Warta", href: "/berita" }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Lead article */}
            <Link
              href={`/berita/${lead.slug}`}
              className="lg:col-span-7 group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <article className="h-full flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors interactive-lift">
                <div className="relative aspect-[2/1] overflow-hidden bg-muted">
                  {lead.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={lead.coverImage}
                      alt={lead.title}
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

                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                    <Badge variant="secondary">{lead.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" aria-hidden="true" />
                      {formatDateIndonesian(lead.publishedDate)}
                    </span>
                    {lead.readTime ? <span>{lead.readTime}</span> : null}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-foreground line-clamp-2">
                    {lead.title}
                  </h3>

                  {lead.excerpt ? (
                    <p className="text-sm font-medium leading-relaxed text-muted-foreground line-clamp-2">
                      {lead.excerpt}
                    </p>
                  ) : null}

                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-primary">
                    Baca Selengkapnya
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </article>
            </Link>

            {/* Secondary articles */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {rest.map((art) => (
                <Link
                  key={art.id}
                  href={`/berita/${art.slug}`}
                  className="group block flex-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <article className="h-full flex overflow-hidden rounded-lg border border-border bg-card transition-colors interactive-lift">
                    <div className="relative w-2/5 shrink-0 overflow-hidden bg-muted">
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
                          <Newspaper className="size-8 text-primary/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-center gap-2 p-5">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Badge variant="secondary">{art.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" aria-hidden="true" />
                          {formatDateIndonesian(art.publishedDate)}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2">
                        {art.title}
                      </h3>

                      {art.excerpt ? (
                        <p className="text-xs font-medium leading-relaxed text-muted-foreground line-clamp-2">
                          {art.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
