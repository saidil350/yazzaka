import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Heart,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getProgramBySlug,
  getProgramPageProfile,
  listOtherPublishedPrograms,
} from "@/lib/programs";
import { buildBreadcrumbJsonLd, JsonLd } from "@/lib/seo/structured-data";

type Params = Promise<{ slug: string }>;

// ISR on-demand: slug tidak di-pra-render saat build (array kosong — build tidak
// butuh koneksi DB), melainkan dirender lalu di-cache pada request pertama dan
// dipakai ulang sampai revalidasi (revalidate 60 dtk diwarisi dari root layout).
// notFound() tetap menghasilkan 404 HTTP asli karena render on-demand bersifat
// blocking sebelum streaming — JANGAN tambahkan loading.tsx untuk rute ini
// karena membuat 404 ter-stream dengan status 200 (soft-404).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: "Program tidak ditemukan" };
  }

  // Sufiks brand ditangani title.template di root layout — jangan dobel.
  const title = program.title;
  const description = program.shortDesc || `Program pendidikan ${program.title}.`;

  return {
    title,
    description,
    alternates: { canonical: `/program/${program.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/program/${program.slug}`,
      images: program.imageUrl ? [{ url: program.imageUrl, alt: program.title }] : undefined,
    },
  };
}

export default async function ProgramDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [program, profile] = await Promise.all([
    getProgramBySlug(slug),
    getProgramPageProfile(),
  ]);

  // Draft / slug tak dikenal → 404 HTTP asli.
  if (!program) {
    notFound();
  }

  const otherPrograms = await listOtherPublishedPrograms(program.slug, 4);

  const isWakaf = program.slug === "pesantren-peradaban-60";

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Beranda", path: "/" },
    { name: "Program", path: "/program" },
    { name: program.title, path: `/program/${program.slug}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link
              href="/program"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:underline mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Direktori Unit Pendidikan</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary">
                {program.category}
              </Badge>
              <Badge variant="outline">
                {profile.name}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {program.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
              {program.shortDesc}
            </p>
          </div>
        </section>

        {/* ── Content Details ─────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Left Main (8 cols; full width saat tanpa sidebar wakaf) */}
              <div className={`${isWakaf ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>

                <div className="rounded-lg overflow-hidden border border-border bg-white p-2 shadow-xs">
                  <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                    {program.imageUrl ? (
                      <Image
                        src={program.imageUrl}
                        alt={program.title}
                        fill
                        priority
                        sizes="(min-width:1024px) 800px, 90vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm text-foreground leading-relaxed">
                  <h2 className="text-xl sm:text-2xl font-extrabold">
                    {isWakaf ? "Latar Belakang & Visi Pesantren Peradaban 6.0" : "Deskripsi & Metodologi Pembinaan"}
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                    {program.fullDesc}
                  </p>
                </div>

                {/* Features list */}
                <div className="bg-white p-6 rounded-lg border border-border space-y-3 shadow-xs">
                  <h3 className="text-base font-bold">
                    {isWakaf ? "Pilar Strategis Pembangunan:" : "Target Capaian & Keunggulan Khusus:"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(program.features ?? []).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-foreground font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-yazzaka-teal-dark shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Competencies */}
                {program.targetCompetencies && program.targetCompetencies.length > 0 && (
                  <div className="bg-white border border-border p-6 rounded-lg space-y-3 shadow-xs">
                    <h3 className="text-base font-bold">
                      {isWakaf ? "Dampak Peradaban & Kemaslahatan Umat:" : "Kompetensi Kelulusan Santri:"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {program.targetCompetencies.map((comp, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-foreground font-semibold">
                          <CheckCircle2 className="h-4 w-4 text-yazzaka-teal-dark shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Callout for Wakaf */}
                {isWakaf && (
                  <div className="bg-yazzaka-orange-soft p-6 rounded-lg border border-border space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 fill-yazzaka-orange text-yazzaka-orange" />
                      <h3 className="text-base font-bold">
                        Salurkan Wakaf Jariyah Pembangunan
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pembangunan Pesantren Peradaban 6.0 di Cot Rheng, Pidie, membuka pintu amal jariyah bagi kaum muslimin. Setiap rupiah wakaf yang Anda salurkan akan mengalirkan pahala tak terputus bagi lahirnya kader ulama dan pemimpin peradaban Islam.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <a
                        href={`https://wa.me/${profile.whatsapp}?text=Assalamu'alaikum%20Admin%20Yazzakka,%20saya%20ingin%20berkonsultasi%20mengenai%20Wakaf%20Pesantren%20Peradaban%206.0`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: "accent" })}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Konfirmasi Wakaf via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Sidebar (4 cols) — hanya untuk program wakaf */}
              {isWakaf && (
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white p-6 rounded-lg border border-border space-y-4 shadow-xs">
                    <span className="text-xs font-medium text-muted-foreground block">
                      Layanan Wakaf &amp; Kemitraan
                    </span>
                    <h3 className="text-base font-bold">
                      Dukung Pembangunan Pesantren
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Konsultasikan akad wakaf tunai, pembebasan lahan, atau program kemitraan dakwah bersama pimpinan yayasan.
                    </p>

                    <div className="space-y-2 pt-2">
                      <Link href="/kontak" className="block">
                        <Button className="w-full justify-center font-bold text-xs h-10 shadow-xs">
                          <span>Hubungi Sekretariat Wakaf</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </Link>

                      <a
                        href={`https://wa.me/${profile.whatsapp}?text=Assalamu'alaikum,%20saya%20ingin%20bertanya%20mengenai%20${encodeURIComponent(program.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="outline" className="w-full justify-center text-xs h-9 font-bold">
                          <MessageCircle className="h-3.5 w-3.5 text-yazzaka-teal-dark mr-1.5" />
                          <span>Chat WhatsApp Sekretariat</span>
                        </Button>
                      </a>
                    </div>

                    <div className="pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{profile.address}, Sigli</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-yazzaka-teal-dark shrink-0" />
                        <span>SK Kemenkumham: {profile.npsn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ── Other Programs & Units ──────────────────── */}
        {otherPrograms.length > 0 && (
          <section className="py-12 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold">
                    Unit Pendidikan &amp; Program Lainnya
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Jelajahi jenjang pendidikan dan program pembinaan lainnya di {profile.name}
                  </p>
                </div>
                <Link
                  href="/program"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:underline"
                >
                  <span>Lihat Semua Unit</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {otherPrograms.map((p) => (
                  <Link
                    key={p.id}
                    href={`/program/${p.slug}`}
                    className="bg-white border border-border rounded-lg p-4 space-y-2.5 flex flex-col justify-between group shadow-xs"
                  >
                    <div className="space-y-2">
                      <Badge variant="secondary">
                        {p.category}
                      </Badge>
                      <h3 className="text-xs font-bold line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {p.shortDesc}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-muted-foreground inline-flex items-center gap-1 pt-2">
                      <span>Pelajari</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
    </>
  );
}
