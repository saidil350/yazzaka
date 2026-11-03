import type { NextConfig } from "next";

// Domain storage yang melayani foto konten: Neon Object Storage (produksi)
// dan R2 bila env publiknya terisi. URL relatif /api/files/<key> tidak perlu
// remotePatterns. Dibaca saat build — di Vercel env tersedia saat build.
const imageRemotePatterns: {
  protocol: "https";
  hostname: string;
  pathname: string;
}[] = [{ protocol: "https", hostname: "**.aws.neon.tech", pathname: "/**" }];

if (process.env.R2_PUBLIC_BASE_URL) {
  try {
    imageRemotePatterns.push({
      protocol: "https",
      hostname: new URL(process.env.R2_PUBLIC_BASE_URL).hostname,
      pathname: "/**",
    });
  } catch {
    // env tidak valid — lewati, optimasi tetap jalan untuk domain lain
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns,
  },
  async redirects() {
    return [
      {
        // Fitur pendaftaran santri (PPDB) dihapus 2026-10-25 — arahkan
        // tautan lama ke halaman kontak agar tidak 404.
        source: "/pendaftaran",
        destination: "/kontak",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Area privat tidak boleh terindeks mesin pencari maupun AI crawler.
        source: "/:path(admin|login|api)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
