import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Yayasan Yazzakka Aceh — Lembaga Pendidikan Islam Unggul & Berkarakter",
  description:
    "Institusi pendidikan Islam terpadu yang memadukan keunggulan kurikulum nasional, sains modern, penguasaan bahasa internasional (Arab & Inggris), serta tahfiz Al-Qur'an 30 juz.",
  keywords: ["Yayasan Yazzakka Aceh", "Pesantren Modern Yazzakka", "SMA Unggulan", "Tahfiz Al-Qur'an", "PPDB 2026", "Sekolah Terbaik Aceh"],
  icons: {
    icon: [
      { url: "/logo-Favicon.png", type: "image/png" },
    ],
    shortcut: "/logo-Favicon.png",
    apple: "/logo-Favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
