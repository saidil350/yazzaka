import { cache } from "react";
import { getDb } from "@/lib/db/neon";
import { initialSchoolProfile, initialWebsiteSettings } from "@/lib/data/initialData";

/**
 * Data faktual organisasi untuk JSON-LD (Organization + WebSite).
 * Sumber: school_profile + website_settings.social_media; fallback initialData
 * agar structured data tetap tampil walau DB sedang tidak terjangkau.
 */
export interface OrgFacts {
  name: string;
  alternateName: string;
  description: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  phone: string;
  email: string;
  whatsapp: string;
  foundedYear: string;
  sameAs: string[];
}

const FALLBACK_FACTS: OrgFacts = {
  name: initialSchoolProfile.name,
  alternateName: "Yazzakka Aceh",
  description: initialSchoolProfile.description,
  streetAddress: initialSchoolProfile.address,
  addressLocality: initialSchoolProfile.city,
  addressRegion: "Aceh",
  postalCode: "24112",
  phone: initialSchoolProfile.phone,
  email: initialSchoolProfile.email,
  whatsapp: initialSchoolProfile.whatsapp,
  foundedYear: String(initialSchoolProfile.establishedYear),
  sameAs: [
    initialWebsiteSettings.socialMedia.instagram,
    initialWebsiteSettings.socialMedia.youtube,
    initialWebsiteSettings.socialMedia.facebook,
  ].filter(Boolean),
};

/** Kolom "Aceh 24112" → region "Aceh" + postal "24112". */
function splitRegionProvince(raw: string): { region: string; postal: string } {
  const match = raw.match(/^(.*?)(?:\s+(\d{4,5}))?$/);
  return {
    region: (match?.[1] ?? raw).trim() || "Aceh",
    postal: match?.[2] ?? "",
  };
}

export const getOrgFacts = cache(async (): Promise<OrgFacts> => {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT p.name, p.description, p.address, p.city, p.province,
             p.phone, p.email, p.whatsapp, p.established_year,
             w.social_media
      FROM school_profile p
      LEFT JOIN website_settings w ON true
      LIMIT 1
    `;
    const r = rows[0];
    if (!r) return FALLBACK_FACTS;
    const { region, postal } = splitRegionProvince((r.province as string) || "");
    const social = (r.social_media ?? {}) as Record<string, string | undefined>;
    return {
      name: (r.name as string) || FALLBACK_FACTS.name,
      alternateName: FALLBACK_FACTS.alternateName,
      description: (r.description as string) || FALLBACK_FACTS.description,
      streetAddress: (r.address as string) || FALLBACK_FACTS.streetAddress,
      addressLocality: (r.city as string) || FALLBACK_FACTS.addressLocality,
      addressRegion: region,
      postalCode: postal || FALLBACK_FACTS.postalCode,
      phone: (r.phone as string) || FALLBACK_FACTS.phone,
      email: (r.email as string) || FALLBACK_FACTS.email,
      whatsapp: (r.whatsapp as string) || FALLBACK_FACTS.whatsapp,
      foundedYear: r.established_year
        ? String(r.established_year)
        : FALLBACK_FACTS.foundedYear,
      sameAs: [social.instagram, social.youtube, social.facebook].filter(
        Boolean
      ) as string[],
    };
  } catch {
    return FALLBACK_FACTS;
  }
});

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function buildOrganizationJsonLd(facts: OrgFacts): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "NGO"],
    "@id": `${getSiteUrl()}/#organization`,
    name: facts.name,
    alternateName: facts.alternateName,
    description: facts.description,
    url: getSiteUrl(),
    logo: `${getSiteUrl()}/yazzakka.webp`,
    foundingDate: facts.foundedYear,
    telephone: facts.phone,
    email: facts.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: facts.streetAddress,
      addressLocality: facts.addressLocality,
      addressRegion: facts.addressRegion,
      postalCode: facts.postalCode,
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: facts.phone,
      url: `https://wa.me/${facts.whatsapp.replace(/\D/g, "")}`,
      availableLanguage: ["id"],
    },
    sameAs: facts.sameAs,
  };
}

export function buildWebSiteJsonLd(facts: OrgFacts): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: facts.name,
    alternateName: facts.alternateName,
    url: getSiteUrl(),
    inLanguage: "id-ID",
    publisher: { "@id": `${getSiteUrl()}/#organization` },
  };
}

export interface ArticleJsonLdInput {
  title: string;
  description: string;
  image: string | null;
  publishedAt: string;
  updatedAt?: string | null;
  url: string;
  authorName: string;
}

export function buildArticleJsonLd(
  input: ArticleJsonLdInput
): Record<string, unknown> {
  const publisher = { "@id": `${getSiteUrl()}/#organization` };
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": input.url,
    headline: input.title,
    description: input.description,
    image: input.image ? [input.image] : undefined,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt || input.publishedAt,
    inLanguage: "id-ID",
    author: { "@type": "Organization", name: input.authorName, url: getSiteUrl() },
    publisher,
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.path}`,
    })),
  };
}

/**
 * Merender satu blok <script type="application/ld+json">.
 * Karakter < di-escape agar tag </script> dari konten tidak bisa keluar
 * dari atribut — konten tetap JSON yang valid.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
