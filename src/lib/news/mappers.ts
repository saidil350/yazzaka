import type {
  Article,
  NewsCategory,
  NewsMedia,
  NewsStatus,
  TiptapDoc,
} from "./types";
import { resolveMediaUrl } from "@/lib/storage/r2";

/**
 * Mapper baris DB (snake_case) → tipe domain (camelCase).
 * Dipakai bersama oleh service berita dan /api/school-data.
 */

function parseDoc(value: unknown): TiptapDoc | null {
  if (!value || typeof value !== "object") return null;
  const doc = value as { type?: string; content?: unknown };
  if (doc.type !== "doc" || !Array.isArray(doc.content)) return null;
  return doc as unknown as TiptapDoc;
}

function ensureArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === "string");
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

/**
 * Baris dari query JOIN articles + categories + users + media (cover).
 * Kolom join opsional: category_name, author_name, cover_storage_key,
 * cover_file_url, cover_visibility.
 */
export function mapArticleRow(r: Record<string, unknown>): Article {
  const coverKey = typeof r.cover_storage_key === "string" ? r.cover_storage_key : null;
  const coverVisibility = typeof r.cover_visibility === "string" ? r.cover_visibility : "private";

  let coverImage: string | null = null;
  if (coverKey) {
    coverImage = resolveMediaUrl(coverKey, coverVisibility);
  } else if (typeof r.cover_image === "string" && r.cover_image) {
    coverImage = r.cover_image;
  }

  const publishedAt = r.published_at ? iso(r.published_at) : null;
  const legacyDate = typeof r.published_date === "string" ? r.published_date : "";

  return {
    id: String(r.id ?? ""),
    slug: String(r.slug ?? ""),
    title: String(r.title ?? ""),
    excerpt: r.excerpt == null ? null : String(r.excerpt),
    content: typeof r.content === "string" ? r.content : "",
    contentDoc: parseDoc(r.content_doc),
    coverImage,
    coverMediaId: r.cover_media_id == null ? null : String(r.cover_media_id),
    categoryId: r.category_id == null ? null : String(r.category_id),
    category:
      (typeof r.category_name === "string" && r.category_name) ||
      (typeof r.category === "string" ? r.category : ""),
    tags: ensureArray(r.tags),
    author:
      (typeof r.author_name === "string" && r.author_name) ||
      (typeof r.author === "string" ? r.author : ""),
    authorId: r.author_id == null ? null : String(r.author_id),
    authorRole: r.author_role == null ? null : String(r.author_role),
    publishedDate: publishedAt ?? legacyDate,
    publishedAt,
    readTime: typeof r.read_time === "string" ? r.read_time : "",
    status: (typeof r.status === "string" ? r.status : "draft") as NewsStatus,
    featured: Boolean(r.featured),
    seoTitle: typeof r.seo_title === "string" ? r.seo_title : "",
    seoDescription: typeof r.seo_description === "string" ? r.seo_description : "",
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

export function mapCategoryRow(r: Record<string, unknown>): NewsCategory {
  return {
    id: String(r.id ?? ""),
    name: String(r.name ?? ""),
    slug: String(r.slug ?? ""),
    articleCount: Number(r.article_count ?? 0),
  };
}

export function mapNewsMediaRow(r: Record<string, unknown>): NewsMedia {
  const key = r.storage_key == null ? null : String(r.storage_key);
  const visibility = r.visibility === "public" ? "public" : "private";
  return {
    id: String(r.id ?? ""),
    fileName: String(r.file_name ?? ""),
    fileUrl: key
      ? resolveMediaUrl(key, visibility)
      : String(r.file_url ?? ""),
    storageKey: key,
    mimeType: r.mime_type == null ? null : String(r.mime_type),
    sizeBytes: r.size_bytes == null ? null : Number(r.size_bytes),
    kind:
      r.kind === "document" || r.kind === "image"
        ? (r.kind as "image" | "document")
        : "other",
    visibility,
    altText: r.alt_text == null ? null : String(r.alt_text),
    uploadedAt: iso(r.uploaded_at ?? r.created_at),
  };
}
