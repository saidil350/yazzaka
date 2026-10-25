"use client";

import React from "react";
import Link from "next/link";
import { useSchoolData } from "@/context/SchoolDataContext";
import Autoplay from "embla-carousel-autoplay";
import { Calendar, Newspaper, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn, formatDateIndonesian } from "@/lib/utils";

export function NewsCarouselSection() {
  const { articles } = useSchoolData();

  // Prioritaskan artikel berflag unggulan; bila kurang dari 2,
  // fallback ke daftar terbit terbaru (pengaman untuk fallback initialData).
  const published = articles.filter((a) => a.status === "published");
  const featured = published.filter((a) => a.featured);
  const pool = (featured.length >= 2 ? featured : published).slice(0, 6);

  // Kontrol carousel via API resmi — indikator slide (pagination) mengikuti snap aktif.
  // Tombol prev/next ada di header (di luar <Carousel>), sehingga memakai
  // api.scrollPrev/scrollNext langsung, bukan CarouselPrevious yang
  // bergantung pada context useCarousel.
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  // Auto slide: interval 7 detik, pause saat hover (lanjut otomatis saat
  // mouse pergi), interaksi manual hanya me-reset timer — dan dinonaktifkan
  // total bagi pengguna dengan prefers-reduced-motion.
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const plugins = React.useMemo(
    () =>
      reducedMotion
        ? []
        : [Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: true })],
    [reducedMotion]
  );

  // Sembunyikan seluruh seksi bila artikel tidak cukup (tanpa strip kosong).
  if (pool.length < 2) return null;

  return (
    <section
      id="berita-unggulan"
      aria-labelledby="berita-unggulan-heading"
      className="landing-section py-12 lg:py-16 border-b border-border scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="secondary" className="gap-2">
              <Newspaper className="h-3 w-3 text-yazzaka-teal-dark" />
              <span>Warta Pilihan</span>
            </Badge>
            <h2
              id="berita-unggulan-heading"
              className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight"
            >
              Berita Unggulan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Kabar dan dokumentasi terpilih dari lingkungan Pesantren Yazzaka.
            </p>
          </div>

          {/* Navigasi prev/next menempel di header, bukan overlay di atas slide */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Sebelumnya"
              onClick={() => api?.scrollPrev()}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Berikutnya"
              onClick={() => api?.scrollNext()}
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Karousel artikel — satu artikel per slide (slider) */}
        <Carousel opts={{ loop: true }} plugins={plugins} setApi={setApi} className="w-full">
          <CarouselContent>
            {pool.map((art) => (
              <CarouselItem key={art.id} className="basis-full">
                <div className="mx-auto max-w-2xl">
                  <Link
                    href={`/berita/${art.slug}`}
                    className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors interactive-lift">
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
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

                      <div className="p-5 flex flex-col gap-2.5">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                          <Badge variant="secondary">{art.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" aria-hidden="true" />
                            {formatDateIndonesian(art.publishedDate)}
                          </span>
                          {art.readTime ? <span>{art.readTime}</span> : null}
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-foreground line-clamp-2">
                          {art.title}
                        </h3>

                        {art.excerpt ? (
                          <p className="text-sm font-medium leading-relaxed text-muted-foreground line-clamp-2">
                            {art.excerpt}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Indikator slide (pagination dots) */}
        {count > 1 ? (
          <div className="flex justify-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ke slide ${index + 1}`}
                aria-current={index === current ? "true" : undefined}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === current
                    ? "bg-primary"
                    : "bg-border hover:bg-muted-foreground/40"
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        ) : null}

      </div>
    </section>
  );
}
