import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Donasi & Wakaf",
    template: "%s | Yazzakka Aceh",
  },
  description:
    "Salurkan donasi dan wakaf untuk Yayasan Bina Iman Akhlak Yazzakka melalui transfer bank resmi atau platform donasi online terpercaya.",
  alternates: { canonical: "/donasi" },
  openGraph: {
    title: "Donasi & Wakaf",
    description:
      "Salurkan donasi dan wakaf untuk Yayasan Bina Iman Akhlak Yazzakka melalui transfer bank resmi atau platform donasi online.",
    type: "website",
    url: "/donasi",
  },
};

export default function DonasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
