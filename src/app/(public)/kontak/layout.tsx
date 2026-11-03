import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Hubungi Kami",
    template: "%s | Yazzakka Aceh",
  },
  description:
    "Alamat, telepon, WhatsApp, dan peta lokasi Yayasan Bina Iman Akhlak Yazzakka di Jalan Selanga, Desa Blang Asan, Kota Sigli, Kabupaten Pidie, Aceh 24112.",
  alternates: { canonical: "/kontak" },
  openGraph: {
    title: "Hubungi Kami",
    description:
      "Alamat, telepon, WhatsApp, dan peta lokasi Yayasan Bina Iman Akhlak Yazzakka di Kota Sigli, Kabupaten Pidie, Aceh.",
    type: "website",
    url: "/kontak",
  },
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
