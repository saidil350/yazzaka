import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Heart,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAdmissionOpen,
  getProgramBySlug,
  getProgramPageProfile,
  listOtherPublishedPrograms,
} from "@/lib/programs";

type Params = Promise<{ slug: string }>;

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

  const title = `${program.title} — Yazzakka`;
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
  const [program, profile, admissionOpen] = await Promise.all([
    getProgramBySlug(slug),
    getProgramPageProfile(),
    getAdmissionOpen(),
  ]);

  // Draft / slug tak dikenal → 404 HTTP asli.
  if (!program) {
    notFound();
  }

  const otherPrograms = await listOtherPublishedPrograms(program.slug, 4);

  const isWakaf = program.slug === "pesantren-peradaban-60";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link
              href="/program"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FA6400] hover:underline mb-3"
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

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              {program.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed font-medium">
              {program.shortDesc}
            </p>
          </div>
        </section>

        {/* ── Content Details ─────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Left Main (8 cols) */}
              <div className="lg:col-span-8 space-y-6">

                <div className="rounded-3xl overflow-hidden border-2 border-[#E8E2D8] bg-white p-2 shadow-xs">
                  <div className="aspect-video relative overflow-hidden rounded-2xl bg-stone-200">
                    {program.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={program.imageUrl}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm text-stone-700 leading-relaxed font-medium">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2330]">
                    {isWakaf ? "Latar Belakang & Visi Pesantren Peradaban 6.0" : "Deskripsi & Metodologi Pembinaan"}
                  </h2>
                  <p className="whitespace-pre-line leading-relaxed text-stone-600">
                    {program.fullDesc}
                  </p>
                </div>

                {/* Features list */}
                <div className="bg-white p-6 rounded-3xl border-2 border-[#E8E2D8] space-y-3 shadow-xs">
                  <h3 className="text-base font-bold text-[#1E2330]">
                    {isWakaf ? "Pilar Strategis Pembangunan:" : "Target Capaian & Keunggulan Khusus:"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(program.features ?? []).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 font-semibold">
                        <CheckCircle2 className="h-4 w-4 text-yazzaka-teal-dark shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Competencies */}
                {program.targetCompetencies && program.targetCompetencies.length > 0 && (
                  <div className="bg-white border-[#E8E2D8] border-2 p-6 rounded-3xl space-y-3 shadow-xs">
                    <h3 className="text-base font-bold text-yazzaka-teal-dark">
                      {isWakaf ? "Dampak Peradaban & Kemaslahatan Umat:" : "Kompetensi Kelulusan Santri:"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {program.targetCompetencies.map((comp, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-800 font-semibold">
                          <Sparkles className="h-4 w-4 text-yazzaka-teal-dark shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Callout for Wakaf */}
                {isWakaf && (
                  <div className="bg-[#FFF9F2] p-6 rounded-3xl border-2 border-[#FED7AA] space-y-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 fill-[#FA6400] text-[#FA6400]" />
                      <h3 className="text-base font-bold text-[#1E2330]">
                        Salurkan Wakaf Jariyah Pembangunan
                      </h3>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      Pembangunan Pesantren Peradaban 6.0 di Cot Rheng, Pidie, membuka pintu amal jariyah bagi kaum muslimin. Setiap rupiah wakaf yang Anda salurkan akan mengalirkan pahala tak terputus bagi lahirnya kader ulama dan pemimpin peradaban Islam.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <a
                        href={`https://wa.me/${profile.whatsapp}?text=Assalamu'alaikum%20Admin%20Yazzakka,%20saya%20ingin%20berkonsultasi%20mengenai%20Wakaf%20Pesantren%20Peradaban%206.0`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FA6400] text-white font-bold text-xs hover:bg-[#E05A00] transition-colors shadow-xs"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Konfirmasi Wakaf via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-6 rounded-3xl border-2 border-[#E8E2D8] space-y-4 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FA6400] block">
                    {isWakaf ? "Layanan Wakaf & Kemitraan" : "Layanan Admisi & Pendaftaran"}
                  </span>
                  <h3 className="text-base font-bold text-[#1E2330]">
                    {isWakaf ? "Dukung Pembangunan Pesantren" : "Tertarik Bergabung dengan Unit Ini?"}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    {isWakaf
                      ? "Konsultasikan akad wakaf tunai, pembebasan lahan, atau program kemitraan dakwah bersama pimpinan yayasan."
                      : "Daftarkan putra/putri Anda sekarang atau hubungi panitia PPDB untuk konsultasi kurikulum dan jadwal visitasi."}
                  </p>

                  <div className="space-y-2 pt-2">
                    <Link href={isWakaf ? "/kontak" : "/pendaftaran"} className="block">
                      <Button className="w-full justify-center font-bold text-xs h-10 shadow-xs">
                        <span>
                          {isWakaf
                            ? "Hubungi Sekretariat Wakaf"
                            : admissionOpen
                            ? "Daftar Santri Baru"
                            : "Informasi PPDB (Ditutup)"}
                        </span>
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
                        <span>Chat WhatsApp Admisi</span>
                      </Button>
                    </a>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D8] space-y-1.5 text-[11px] text-stone-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span>{profile.address}, Sigli</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-yazzaka-teal-dark shrink-0" />
                      <span>SK Kemenkumham: {profile.npsn}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Other Programs & Units ──────────────────── */}
        {otherPrograms.length > 0 && (
          <section className="py-12 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2330]">
                    Unit Pendidikan &amp; Program Lainnya
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    Jelajahi jenjang pendidikan dan program pembinaan lainnya di {profile.name}
                  </p>
                </div>
                <Link
                  href="/program"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#FA6400] hover:underline"
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
                    className="bg-white border-2 border-[#E8E2D8] rounded-2xl p-4 space-y-2.5 flex flex-col justify-between group shadow-xs transition-all"
                  >
                    <div className="space-y-2">
                      <Badge variant="secondary">
                        {p.category}
                      </Badge>
                      <h3 className="text-xs font-bold text-[#1E2330] line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-[11px] text-stone-500 line-clamp-2 font-medium">
                        {p.shortDesc}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-[#FA6400] inline-flex items-center gap-1 pt-2">
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
      <Footer />
    </div>
  );
}
