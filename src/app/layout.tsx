import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { getSeoSettings, normalizeGoogleVerification } from "@/lib/seo-settings";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  getOrgFacts,
  getSiteUrl,
  JsonLd,
} from "@/lib/seo/structured-data";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Metadata dibaca dari DB (website_settings) saat build/revalidasi.
// ISR 60 detik: perubahan SEO di CMS tayang ke situs publik paling lambat ~1 menit.
export const revalidate = 60;

// Situs light-only: deklarasikan scheme terang agar scrollbar/selection/input
// tidak dirender dengan scheme gelap OS, dan tema browser cocok dengan latar.
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const googleToken = normalizeGoogleVerification(seo.googleVerification);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.siteTitle,
      template: "%s | Yazzakka Aceh",
    },
    description: seo.metaDescription,
    alternates: { canonical: "/" },
    icons: {
      icon: [
        { url: "/logo-Favicon.png", type: "image/png" },
      ],
      shortcut: "/logo-Favicon.png",
      apple: "/logo-Favicon.png",
    },
    openGraph: {
      title: seo.siteTitle,
      description: seo.metaDescription,
      siteName: "Yayasan Bina Iman Akhlak Yazzakka",
      locale: "id_ID",
      type: "website",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    ...(googleToken ? { verification: { google: googleToken } } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data organisasi — sekali per halaman, sumber school_profile.
  const facts = await getOrgFacts();
  const orgJsonLd = buildOrganizationJsonLd(facts);
  const siteJsonLd = buildWebSiteJsonLd(facts);

  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${newsreader.variable} font-sans scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <JsonLd data={orgJsonLd} />
        <JsonLd data={siteJsonLd} />
        {/* Skip link: akses cepat ke konten utama untuk keyboard/screen reader */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:border focus:border-border focus:shadow-lg"
        >
          Lewati ke konten utama
        </a>
        {/* Jalur publik dirender server penuh (lihat (public)/layout);
            SchoolDataProvider hanya dipasang di admin & login. */}
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
