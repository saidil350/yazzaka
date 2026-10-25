import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Galeri Kegiatan",
    template: "%s | Yazzakka Aceh",
  },
  description:
    "Dokumentasi foto kegiatan santri dan unit pendidikan Yayasan Yazzakka Aceh: pembelajaran, tahfiz Al-Qur'an, kegiatan sosial, dan event keagamaan.",
  alternates: { canonical: "/galeri" },
  openGraph: {
    title: "Galeri Kegiatan",
    description:
      "Dokumentasi foto kegiatan santri dan unit pendidikan Yayasan Yazzakka Aceh.",
    type: "website",
    url: "/galeri",
  },
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
