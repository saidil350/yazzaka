import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
