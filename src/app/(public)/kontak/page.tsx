import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";
import {
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "@/components/public/SocialIcons";
import { ContactForm } from "@/components/public/ContactForm";
import { getPublicProfile } from "@/lib/public-data";
import { getSeoSettings } from "@/lib/seo-settings";
import { initialSchoolProfile } from "@/lib/data/initialData";
import type { SchoolProfile, WebsiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Kontak & Sekretariat",
  description:
    "Hubungi Yayasan Bina Iman Akhlak Yazzakka — alamat sekretariat Sigli, telepon, WhatsApp, email, dan peta lokasi.",
  alternates: { canonical: "/kontak" },
};

export default async function ContactPage() {
  const [profile, seo] = await Promise.all([getPublicProfile(), getSeoSettings()]);
  const safeProfile: SchoolProfile = profile ?? initialSchoolProfile;
  const socialMedia = (seo.socialMedia ?? null) as WebsiteSettings["socialMedia"] | null;

  return (
    <>
      {/* ── Headspace Warm Page Hero Banner ─────────── */}
      <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <Badge variant="secondary" className="mb-3">
            <span>Layanan Informasi &amp; Sekretariat</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Hubungi Yayasan Yazzakka
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
            Kami siap melayani pertanyaan seputar kunjungan ke sekolah, kemitraan dakwah/pendidikan, dan konsultasi program.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────── */}
      <section className="py-12 lg:py-14 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

            {/* Left Column: Contact Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">

              <div className="bg-white rounded-lg p-6 border border-border shadow-xs space-y-5">
                <h2 className="text-lg font-bold">
                  Informasi Kontak Resmi
                </h2>

                <div className="space-y-3.5 text-xs sm:text-sm text-foreground">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Alamat Sekretariat &amp; Sekolah:</span>
                      <p className="mt-0.5 leading-relaxed text-muted-foreground">
                        {safeProfile.address}, {safeProfile.city}, {safeProfile.province}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Telepon Kantor:</span>
                      <p className="mt-0.5 text-muted-foreground">{safeProfile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">WhatsApp Admisi:</span>
                      <a
                        href={`https://wa.me/${safeProfile.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-bold hover:underline mt-0.5 block"
                      >
                        +{safeProfile.whatsapp}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Email Resmi:</span>
                      <p className="mt-0.5 text-muted-foreground">{safeProfile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Jam Pelayanan:</span>
                      <p className="mt-0.5 text-muted-foreground">Senin - Sabtu: 08:00 - 15:30 WIB</p>
                      <p className="text-xs text-muted-foreground">Ahad / Hari Libur Nasional: Tutup</p>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="pt-4 border-t border-border space-y-2">
                  <span className="text-xs font-medium text-muted-foreground block">
                    Media Sosial Resmi:
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={socialMedia?.instagram || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white border border-border text-foreground hover:text-pink-600 hover:border-pink-200 transition-colors shadow-xs"
                    >
                      <InstagramIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={socialMedia?.youtube || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white border border-border text-foreground hover:text-red-600 hover:border-red-200 transition-colors shadow-xs"
                    >
                      <YoutubeIcon className="h-4 w-4" />
                    </a>
                    <a
                      href={socialMedia?.facebook || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white border border-border text-foreground hover:text-blue-600 hover:border-blue-200 transition-colors shadow-xs"
                    >
                      <FacebookIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps Card */}
              <div className="bg-white rounded-lg overflow-hidden border border-border shadow-xs h-64">
                <iframe
                  src={safeProfile.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Peta Lokasi Pesantren Yazzaka"
                />
              </div>

            </div>

            {/* Right Column: Interactive Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-lg p-6 sm:p-8 border border-border shadow-xs space-y-5">
              <div>
                <span className="text-xs font-medium text-muted-foreground block mb-1">
                  Kirim Pesan
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  Sampaikan Pertanyaan &amp; Saran Anda
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Isi formulir di bawah ini, tim sekretariat kami akan merespons melalui email atau WhatsApp.
                </p>
              </div>

              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
