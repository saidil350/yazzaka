import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Agenda Kegiatan",
    template: "%s | Yazzakka Aceh",
  },
  description:
    "Jadwal agenda dan kegiatan terkini Yayasan Yazzakka Aceh — kajian, pengajian, dan event pendidikan Islam di Sigli, Kabupaten Pidie, Aceh.",
  alternates: { canonical: "/agenda" },
  openGraph: {
    title: "Agenda Kegiatan",
    description:
      "Jadwal agenda dan kegiatan terkini Yayasan Yazzakka Aceh di Sigli, Kabupaten Pidie, Aceh.",
    type: "website",
    url: "/agenda",
  },
};

export default function AgendaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
