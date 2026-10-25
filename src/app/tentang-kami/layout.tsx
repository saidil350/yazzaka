import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Tentang Kami",
    template: "%s | Yazzakka Aceh",
  },
  description:
    "Profil Yayasan Bina Iman Akhlak Yazzakka — lembaga pendidikan Islam berbadan hukum resmi SK Kemenkumham RI yang berpusat di Kota Sigli, Kabupaten Pidie, Aceh, menaungi TPA, TKIT, Sekolah Anak Shalih, PKBM, dan Darul Quran.",
  alternates: { canonical: "/tentang-kami" },
  openGraph: {
    title: "Tentang Kami",
    description:
      "Profil Yayasan Bina Iman Akhlak Yazzakka — lembaga pendidikan Islam berbadan hukum resmi di Kota Sigli, Kabupaten Pidie, Aceh.",
    type: "website",
    url: "/tentang-kami",
  },
};

export default function TentangKamiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
