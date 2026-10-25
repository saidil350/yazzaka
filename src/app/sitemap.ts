import type { MetadataRoute } from "next";
import { getDb } from "@/lib/db/neon";

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Sitemap gabungan: rute statis + seluruh artikel terbit + program publik.
 * DB tak terjangkau → kembalikan rute statis saja (sitemap tetap valid).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/tentang-kami`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/program`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/berita`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/agenda`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/galeri`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/prestasi`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/kontak`, changeFrequency: "yearly", priority: 0.7 },
  ];

  try {
    const sql = getDb();
    const [articles, programs] = await Promise.all([
      sql`
        SELECT slug, published_at, updated_at, created_at
        FROM articles
        WHERE status = 'published'
        ORDER BY published_at DESC NULLS LAST
      `,
      sql`
        SELECT slug, updated_at
        FROM programs
        WHERE status = 'published' OR status IS NULL
        ORDER BY order_index ASC
      `,
    ]);

    const articleRows = articles as {
      slug: string;
      published_at?: string | null;
      updated_at?: string | null;
      created_at?: string | null;
    }[];
    const programRows = programs as { slug: string; updated_at?: string | null }[];

    const articleRoutes: MetadataRoute.Sitemap = articleRows.map((r) => ({
      url: `${siteUrl}/berita/${r.slug}`,
      lastModified: new Date(r.updated_at || r.published_at || r.created_at || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const programRoutes: MetadataRoute.Sitemap = programRows.map((r) => ({
      url: `${siteUrl}/program/${r.slug}`,
      lastModified: r.updated_at ? new Date(r.updated_at) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...programRoutes, ...articleRoutes];
  } catch (error) {
    console.error("sitemap error:", error);
    return staticRoutes;
  }
}
