import { cache } from "react";
import { getDb } from "@/lib/db/neon";
import { initialWebsiteSettings } from "@/lib/data/initialData";

export interface SeoSettings {
  siteTitle: string;
  metaDescription: string;
  ogImage: string;
  googleVerification?: string;
}

/**
 * Membaca pengaturan SEO dari DB untuk dipakai generateMetadata (server-side).
 * Di-cache per-request via React cache; gagal DB fallback ke nilai default
 * agar situs tetap punya metadata.
 */
export const getSeoSettings = cache(async (): Promise<SeoSettings> => {
  const fallback: SeoSettings = {
    siteTitle: initialWebsiteSettings.siteTitle,
    metaDescription: initialWebsiteSettings.metaDescription,
    ogImage: initialWebsiteSettings.ogImage,
    googleVerification: initialWebsiteSettings.googleVerification,
  };

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT site_title, meta_description, og_image, google_verification
      FROM website_settings LIMIT 1
    `;
    const r = rows[0];
    if (!r) return fallback;
    return {
      siteTitle: (r.site_title as string) || fallback.siteTitle,
      metaDescription: (r.meta_description as string) || fallback.metaDescription,
      ogImage: (r.og_image as string) || fallback.ogImage,
      googleVerification: (r.google_verification as string) || undefined,
    };
  } catch (error) {
    console.error("getSeoSettings error:", error);
    return fallback;
  }
});

/**
 * Normalisasi kode verifikasi Google: terima token polos, nilai dengan prefix
 * "google-site-verification=", atau tag <meta name="google-site-verification"
 * content="..."> yang ditempel utuh.
 */
export function normalizeGoogleVerification(value?: string | null): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  const fromTag = raw.match(/content=["']([^"']+)["']/i);
  const token = (fromTag ? fromTag[1] : raw)
    .replace(/^google-site-verification=/i, "")
    .trim();
  return token || undefined;
}
