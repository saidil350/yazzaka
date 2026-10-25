import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Kebijakan crawler. Seluruh halaman publik terbuka; area privat
 * (admin, API, login) ditutup. Crawler mesin generatif (GEO) diberi
 * izin eksplisit agar konten yayasan bisa dikutip ChatGPT, Perplexity,
 * Claude, dan AI Overviews.
 */
export default function robots(): MetadataRoute.Robots {
  const aiAgents = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "Claude-SearchBot",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "Amazonbot",
    "Meta-ExternalAgent",
    "CCBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/login"],
      },
      {
        userAgent: aiAgents,
        allow: "/",
        disallow: ["/admin", "/api", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
