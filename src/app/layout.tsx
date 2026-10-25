import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { getSeoSettings, normalizeGoogleVerification } from "@/lib/seo-settings";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  getOrgFacts,
  getSiteUrl,
  JsonLd,
} from "@/lib/seo/structured-data";
import { getServerSections } from "@/lib/sections-server";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

// Font panel CMS — hanya direferensikan oleh .admin-scope di globals.css.
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Metadata dibaca dari DB (website_settings) saat build/revalidasi.
// ISR 60 detik: perubahan SEO di CMS tayang ke situs publik paling lambat ~1 menit.
export const revalidate = 60;

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
  // Seksi dari DB ikut dirender awal agar status visibilitas (mis. topbar)
  // sudah benar di HTML pertama — tidak menunggu fetch client.
  const initialSections = await getServerSections();

  // Structured data organisasi — sekali per halaman, sumber school_profile.
  const facts = await getOrgFacts();
  const orgJsonLd = buildOrganizationJsonLd(facts);
  const siteJsonLd = buildWebSiteJsonLd(facts);

  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${newsreader.variable} ${publicSans.variable} font-sans scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <JsonLd data={orgJsonLd} />
        <JsonLd data={siteJsonLd} />
        <Providers initialSections={initialSections}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
