import { getOrgFacts } from "@/lib/seo/structured-data";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * /llms.txt — ringkasan situs bagi mesin generatif (GEO, llmstxt.org).
 * Fakta organisasi ditarik dari school_profile agar selalu sinkron dengan CMS.
 */
export async function GET() {
  const facts = await getOrgFacts();

  const body = `# ${facts.name}

> ${facts.description}

Yayasan pendidikan Islam yang berpusat di ${facts.streetAddress}, ${facts.addressLocality}, ${facts.addressRegion} ${facts.postalCode}, Indonesia. Berbadan hukum resmi dengan SK Kemenkumham RI No. AHU-0005614.AH.01.04. Tahun 2022 (SK Kemenkumham), didirikan tahun ${facts.foundedYear}, dipimpin Dr. Amri Fatmi, Lc., M.A. Menyelenggarakan unit TPA, TKIT, Sekolah Anak Shalih, PKBM, dan Darul Quran, serta menginisiasi pembangunan Pesantren Peradaban 6.0.

Kontak: telepon ${facts.phone}, email ${facts.email}, WhatsApp https://wa.me/${facts.whatsapp.replace(/\D/g, "")}.

## Halaman

- [Beranda](${siteUrl}/): profil singkat, program unggulan, berita terbaru, dan agenda kegiatan.
- [Tentang Kami](${siteUrl}/tentang-kami): profil lengkap yayasan, visi-misi, nilai, pimpinan, data legalitas, dan dewan asatidz.
- [Program](${siteUrl}/program): daftar unit pendidikan — TPA, TKIT, Sekolah Anak Shalih, PKBM, Darul Quran, dan wakaf Pesantren Peradaban 6.0.
- [Berita](${siteUrl}/berita): warta dan artikel kegiatan santri serta pengumuman resmi.
- [Agenda](${siteUrl}/agenda): jadwal kegiatan dan event mendatang.
- [Galeri](${siteUrl}/galeri): dokumentasi foto kegiatan.
- [Prestasi](${siteUrl}/prestasi): rekap capaian santri.
- [Hubungi Kami](${siteUrl}/kontak): alamat lengkap, peta lokasi, dan formulir pesan.

## Fakta Kunci

- Nama resmi: ${facts.name} (${facts.alternateName})
- Badan hukum: SK Kemenkumham RI No. AHU-0005614.AH.01.04. Tahun 2022
- Tahun berdiri: ${facts.foundedYear}
- Alamat: ${facts.streetAddress}, ${facts.addressLocality}, ${facts.addressRegion} ${facts.postalCode}, Indonesia
- Ketua/Pembina: Dr. Amri Fatmi, Lc., M.A.
- Unit pendidikan: TPA, TKIT, Sekolah Anak Shalih, PKBM, Darul Quran, Pesantren Peradaban 6.0 (pembangunan)
${facts.sameAs.length ? `- Media sosial: ${facts.sameAs.join(", ")}` : ""}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
