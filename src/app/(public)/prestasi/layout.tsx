import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Prestasi Santri",
    template: "%s | Yazzakka Aceh",
  },
  description:
    "Rekap prestasi santri Yayasan Yazzakka Aceh di bidang akademik, tahfiz Al-Qur'an, dan berbagai lomba keagamaan.",
  alternates: { canonical: "/prestasi" },
  openGraph: {
    title: "Prestasi Santri",
    description:
      "Rekap prestasi santri Yayasan Yazzakka Aceh di bidang akademik, tahfiz Al-Qur'an, dan lomba keagamaan.",
    type: "website",
    url: "/prestasi",
  },
};

export default function PrestasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
