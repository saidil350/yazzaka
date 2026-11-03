import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Program Pendidikan",
    template: "%s | Yazzakka Aceh",
  },
  description:
    "Unit pendidikan Yayasan Yazzakka Aceh: TPA, TKIT, Sekolah Anak Shalih (SAS), PKBM, Darul Quran, serta program wakaf pembangunan Pesantren Peradaban 6.0 di Sigli, Aceh.",
  alternates: { canonical: "/program" },
  openGraph: {
    title: "Program Pendidikan",
    description:
      "Unit pendidikan Yayasan Yazzakka Aceh: TPA, TKIT, Sekolah Anak Shalih, PKBM, Darul Quran, dan Pesantren Peradaban 6.0.",
    type: "website",
    url: "/program",
  },
};

export default function ProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
