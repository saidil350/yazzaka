import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatDateIndonesian } from "@/lib/utils";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationNav } from "@/components/public/pagination-nav";
import { listPublishedEvents } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Agenda & Kegiatan",
  description:
    "Jadwal seminar parenting, wisuda tahfiz, haflah khotmil Quran, dan kegiatan kesiswaan Yazzakka.",
  alternates: { canonical: "/agenda" },
};

const EVENTS_PAGE_SIZE = 9;

type SearchParams = Promise<{ page?: string }>;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);

  const events = await listPublishedEvents();

  const totalPages = Math.max(1, Math.ceil(events.length / EVENTS_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageEvents = events.slice(
    (safePage - 1) * EVENTS_PAGE_SIZE,
    safePage * EVENTS_PAGE_SIZE
  );

  const buildEventsPageHref = (p: number) =>
    p > 1 ? `/agenda?page=${p}` : "/agenda";

  return (
    <>
      {/* ── Headspace Warm Page Hero Banner ─────────── */}
      <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <Badge variant="secondary" className="mb-3">
            <span>Kalender Akademik &amp; Kegiatan</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Agenda &amp; Kegiatan Sekolah
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Jadwal seminar parenting, wisuda tahfiz, haflah khotmil Quran, dan kegiatan kesiswaan.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────── */}
      <section className="py-12 lg:py-14 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Event List or EmptyState */}
          {events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Tidak Ada Agenda yang Ditemukan"
              description="Saat ini belum ada jadwal agenda kegiatan."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-lg border border-border overflow-hidden shadow-xs flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {evt.coverImage ? (
                        <Image
                          src={evt.coverImage}
                          alt={evt.title}
                          fill
                          sizes="(min-width:1024px) 380px, (min-width:768px) 45vw, 90vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Calendar className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-center shrink-0 pr-3 border-r border-border">
                          <span className="block text-xs text-muted-foreground">
                            {new Date(`${evt.date}T00:00:00Z`).toLocaleDateString("id-ID", { month: "short", timeZone: "UTC" })}
                          </span>
                          <span className="text-base font-bold text-foreground">
                            {new Date(`${evt.date}T00:00:00Z`).getUTCDate()}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">
                            {formatDateIndonesian(evt.date)}
                          </span>
                          <span className="text-xs font-bold text-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {evt.time}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-base font-bold leading-snug">
                        {evt.title}
                      </h2>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {evt.description}
                      </p>

                      <div className="pt-2 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-yazzaka-orange shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {evt.registrationUrl && (
                      evt.registrationUrl.startsWith("http") ? (
                        <a
                          href={evt.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button
                            variant="outline"
                            size="default"
                            className="w-full justify-between font-bold text-xs h-9"
                          >
                            <span>Tautan Terkait</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      ) : (
                        <Link href={evt.registrationUrl} className="block">
                          <Button
                            variant="outline"
                            size="default"
                            className="w-full justify-between font-bold text-xs h-9"
                          >
                            <span>Tautan Terkait</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ))}
              </div>

              <PaginationNav
                currentPage={safePage}
                totalPages={totalPages}
                buildHref={buildEventsPageHref}
                ariaLabel="Navigasi halaman agenda"
              />
            </>
          )}

        </div>
      </section>
    </>
  );
}
