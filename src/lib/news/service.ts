import { cache } from "react";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { getDb } from "@/lib/db/neon";
import { generateId, slugify } from "@/lib/utils";
import { mapArticleRow, mapCategoryRow, mapNewsMediaRow } from "./mappers";
import {
  collectImageMediaIds,
  docHasContent,
  docToPlainText,
} from "./schemas";
import { ApiError, isSuperAdmin, type SessionUser } from "./api-helpers";
import type {
  Article,
  ArticleListResult,
  NewsCategory,
  NewsMedia,
  NewsStatus,
  NewsTransitionAction,
  TiptapDoc,
} from "./types";

/**
 * Data-access layer fitur berita — Neon serverless driver (raw SQL
 * berparameter via sql.query), konsisten dengan konvensi repo.
 * Pemeriksaan izin dilakukan DI SINI agar konsisten, bukan hanya di route.
 */

type SqlRow = Record<string, unknown>;
type NeonSql = NeonQueryFunction<false, false>;

const ARTICLE_JOIN_SELECT = `
  SELECT a.*,
         c.name AS category_name,
         u.name AS author_name,
         m.storage_key AS cover_storage_key,
         m.visibility AS cover_visibility
  FROM articles a
  LEFT JOIN categories c ON c.id = a.category_id
  LEFT JOIN users u ON u.id = a.author_id
  LEFT JOIN media_items m ON m.id = a.cover_media_id
`;

// ── util ───────────────────────────────────────────────────────────────

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} menit`;
}

async function uniqueArticleSlug(
  sql: NeonSql,
  base: string,
  excludeId?: string
): Promise<string> {
  const candidate = slugify(base).slice(0, 200) || "berita";
  for (let i = 0; i < 50; i++) {
    const test = i === 0 ? candidate : `${candidate}-${i + 1}`;
    const rows = (await sql.query(`SELECT id FROM articles WHERE slug = $1 LIMIT 1`, [
      test,
    ])) as SqlRow[];
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) {
      return test;
    }
  }
  return `${candidate}-${Date.now().toString(36)}`;
}

async function getCategoryByIdOrThrow(
  sql: NeonSql,
  categoryId: string | null
): Promise<string> {
  if (!categoryId) return "";
  const rows = (await sql.query(
    `SELECT name FROM categories WHERE id = $1 LIMIT 1`,
    [categoryId]
  )) as SqlRow[];
  if (rows.length === 0) throw new ApiError(400, "Kategori tidak ditemukan.");
  return String(rows[0].name);
}

async function getMediaById(
  sql: NeonSql,
  mediaId: string
): Promise<NewsMedia | null> {
  const rows = (await sql.query(`SELECT * FROM media_items WHERE id = $1 LIMIT 1`, [
    mediaId,
  ])) as SqlRow[];
  return rows.length ? mapNewsMediaRow(rows[0]) : null;
}

/**
 * Setel ulang lampiran artikel (replace set) dalam satu transaksi:
 * hapus semua relasi lama lalu sisipkan yang baru.
 */
async function replaceAttachments(
  sql: NeonSql,
  articleId: string,
  mediaIds: string[]
): Promise<void> {
  const unique = Array.from(new Set(mediaIds));
  const operations = [
    sql.query(`DELETE FROM article_attachments WHERE article_id = $1`, [articleId]),
    ...unique.map((mediaId) =>
      sql.query(
        `INSERT INTO article_attachments (id, article_id, media_id)
         VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [generateId("att"), articleId, mediaId]
      )
    ),
  ];
  await sql.transaction(operations);
}

/**
 * Selaraskan visibility media dengan status artikel: artikel terbit →
 * sampul, gambar inline, dan lampiran menjadi publik; selain itu privat.
 */
async function syncMediaVisibility(
  sql: NeonSql,
  articleId: string,
  status: NewsStatus
): Promise<void> {
  const rows = (await sql.query(
    `SELECT cover_media_id, content_doc FROM articles WHERE id = $1 LIMIT 1`,
    [articleId]
  )) as SqlRow[];
  if (rows.length === 0) return;

  const ids = new Set<string>();
  if (rows[0].cover_media_id) ids.add(String(rows[0].cover_media_id));
  const doc = rows[0].content_doc as TiptapDoc | null;
  if (doc && doc.type === "doc") {
    for (const id of collectImageMediaIds(doc)) ids.add(id);
  }
  const attRows = (await sql.query(
    `SELECT media_id FROM article_attachments WHERE article_id = $1`,
    [articleId]
  )) as SqlRow[];
  for (const row of attRows) ids.add(String(row.media_id));

  if (ids.size === 0) return;
  const idList = Array.from(ids);
  const placeholders = idList.map((_, i) => `$${i + 2}`).join(",");
  await sql.query(
    `UPDATE media_items SET visibility = $1 WHERE id IN (${placeholders})`,
    [status === "published" ? "public" : "private", ...idList]
  );
}

// ── artikel: baca ──────────────────────────────────────────────────────

export interface ListArticlesOptions {
  status?: NewsStatus[];
  categorySlug?: string | null;
  q?: string | null;
  page?: number;
  pageSize?: number;
}

export async function listArticles(
  options: ListArticlesOptions
): Promise<ArticleListResult> {
  const sql = getDb();
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 9));

  const conds: string[] = [];
  const params: unknown[] = [];

  if (options.status && options.status.length > 0) {
    const start = params.length + 1;
    params.push(...options.status);
    conds.push(`a.status IN (${options.status.map((_, i) => `$${start + i}`).join(",")})`);
  }
  if (options.categorySlug) {
    params.push(options.categorySlug);
    conds.push(`c.slug = $${params.length}`);
  }
  if (options.q) {
    params.push(`%${options.q}%`);
    const idx = params.length;
    conds.push(`(a.title ILIKE $${idx} OR a.excerpt ILIKE $${idx})`);
  }

  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";

  const countRows = (await sql.query(
    `SELECT count(*)::int AS total
     FROM articles a
     LEFT JOIN categories c ON c.id = a.category_id
     ${where}`,
    params
  )) as SqlRow[];
  const total = Number(countRows[0]?.total ?? 0);

  const rows = (await sql.query(
    `${ARTICLE_JOIN_SELECT}
     ${where}
     ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, pageSize, (page - 1) * pageSize]
  )) as SqlRow[];

  return {
    items: rows.map(mapArticleRow),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Dedupe within satu request (dipanggil page + generateMetadata). */
export const getArticleBySlug = cache(async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const sql = getDb();
  const rows = (await sql.query(
    `${ARTICLE_JOIN_SELECT} WHERE a.slug = $1 LIMIT 1`,
    [slug]
  )) as SqlRow[];
  return rows.length ? mapArticleRow(rows[0]) : null;
});

export const getArticleById = cache(async function getArticleById(
  id: string
): Promise<Article | null> {
  const sql = getDb();
  const rows = (await sql.query(
    `${ARTICLE_JOIN_SELECT} WHERE a.id = $1 LIMIT 1`,
    [id]
  )) as SqlRow[];
  return rows.length ? mapArticleRow(rows[0]) : null;
});

export async function getAttachments(articleId: string): Promise<NewsMedia[]> {
  const sql = getDb();
  const rows = (await sql.query(
    `SELECT m.*
     FROM article_attachments aa
     JOIN media_items m ON m.id = aa.media_id
     WHERE aa.article_id = $1
     ORDER BY aa.created_at ASC`,
    [articleId]
  )) as SqlRow[];
  return rows.map(mapNewsMediaRow);
}

// ── artikel: tulis ─────────────────────────────────────────────────────

interface ArticleWritePayload {
  title: string;
  slug: string | null;
  excerpt: string | null;
  contentDoc: TiptapDoc;
  categoryId: string | null;
  coverMediaId: string | null;
  attachmentIds: string[];
  tags: string[];
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  status?: NewsStatus;
}

/** Status efektif saat create — editor tidak boleh langsung terbit/arsip. */
function resolveCreateStatus(user: SessionUser, requested?: NewsStatus): NewsStatus {
  if (isSuperAdmin(user)) return requested ?? "draft";
  if (requested === "pending_review") return "pending_review";
  return "draft";
}

async function resolveCoverImage(
  sql: NeonSql,
  coverMediaId: string | null
): Promise<string | null> {
  if (!coverMediaId) return null;
  const media = await getMediaById(sql, coverMediaId);
  if (!media) throw new ApiError(400, "Gambar sampul tidak ditemukan.");
  if (media.kind !== "image") {
    throw new ApiError(400, "Gambar sampul harus berupa berkas gambar.");
  }
  return media.fileUrl;
}

async function validateAttachments(
  sql: NeonSql,
  attachmentIds: string[]
): Promise<void> {
  for (const mediaId of attachmentIds) {
    const media = await getMediaById(sql, mediaId);
    if (!media) throw new ApiError(400, "Lampiran tidak ditemukan.");
    if (media.kind !== "document") {
      throw new ApiError(400, "Lampiran harus berupa dokumen (PDF/DOCX).");
    }
  }
}

export async function createArticle(
  payload: ArticleWritePayload,
  user: SessionUser
): Promise<Article> {
  if (!docHasContent(payload.contentDoc)) {
    throw new ApiError(400, "Isi artikel harus memuat konten yang bermakna.");
  }
  const sql = getDb();
  await validateAttachments(sql, payload.attachmentIds);

  const id = generateId("art");
  const slug = await uniqueArticleSlug(sql, payload.slug || payload.title);
  const categoryName = await getCategoryByIdOrThrow(sql, payload.categoryId);
  const coverImage = await resolveCoverImage(sql, payload.coverMediaId);
  const content = docToPlainText(payload.contentDoc);
  const status = resolveCreateStatus(user, payload.status);
  const publishedAt = status === "published" ? new Date() : null;
  const featured = isSuperAdmin(user) ? payload.featured : false;

  await sql.query(
    `INSERT INTO articles (
       id, slug, title, excerpt, content, content_doc,
       cover_image, cover_media_id,
       category, category_id, tags,
       author, author_id, author_role,
       published_date, published_at, read_time,
       status, featured, seo_title, seo_description,
       created_at, updated_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6::jsonb,
       $7, $8,
       $9, $10, $11::jsonb,
       $12, $13, $14,
       $15, $16::timestamptz, $17,
       $18, $19, $20, $21,
       NOW(), NOW()
     )`,
    [
      id,
      slug,
      payload.title,
      payload.excerpt,
      content,
      JSON.stringify(payload.contentDoc),
      coverImage,
      payload.coverMediaId,
      categoryName,
      payload.categoryId,
      JSON.stringify(payload.tags),
      user.name,
      user.id,
      user.role,
      publishedAt ? publishedAt.toISOString().slice(0, 10) : "",
      publishedAt ? publishedAt.toISOString() : null,
      estimateReadTime(content),
      status,
      featured,
      payload.seoTitle,
      payload.seoDescription,
    ]
  );

  if (payload.attachmentIds.length > 0) {
    await replaceAttachments(sql, id, payload.attachmentIds);
  }
  await syncMediaVisibility(sql, id, status);

  const created = await getArticleByIdCachedFresh(id);
  if (!created) throw new ApiError(500, "Gagal memuat artikel yang baru dibuat.");
  return created;
}

/** Bypass React.cache setelah operasi tulis pada request yang sama. */
async function getArticleByIdCachedFresh(id: string): Promise<Article | null> {
  const sql = getDb();
  const rows = (await sql.query(
    `${ARTICLE_JOIN_SELECT} WHERE a.id = $1 LIMIT 1`,
    [id]
  )) as SqlRow[];
  return rows.length ? mapArticleRow(rows[0]) : null;
}

export async function updateArticle(
  id: string,
  payload: ArticleWritePayload,
  user: SessionUser
): Promise<Article> {
  const sql = getDb();
  const existing = await getArticleByIdCachedFresh(id);
  if (!existing) throw new ApiError(404, "Artikel tidak ditemukan.");

  if (!isSuperAdmin(user) && existing.authorId !== user.id) {
    throw new ApiError(403, "Anda hanya dapat mengedit berita milik Anda sendiri.");
  }
  if (!docHasContent(payload.contentDoc)) {
    throw new ApiError(400, "Isi artikel harus memuat konten yang bermakna.");
  }
  await validateAttachments(sql, payload.attachmentIds);

  // Editor menyimpan artikel yang sudah terbit/arsip → masuk kembali ke
  // peninjauan. Editor tidak dapat mengatur status lain.
  let nextStatus: NewsStatus;
  if (isSuperAdmin(user)) {
    nextStatus = payload.status ?? existing.status;
  } else if (existing.status === "published" || existing.status === "archived") {
    nextStatus = "pending_review";
  } else if (
    payload.status === "draft" ||
    payload.status === "pending_review"
  ) {
    nextStatus = payload.status;
  } else {
    nextStatus = existing.status;
  }

  const publishedAt =
    nextStatus === "published"
      ? existing.publishedAt ?? new Date().toISOString()
      : existing.publishedAt ?? null;

  const slug =
    payload.slug && payload.slug !== existing.slug
      ? await uniqueArticleSlug(sql, payload.slug, id)
      : existing.slug;
  const categoryName = await getCategoryByIdOrThrow(sql, payload.categoryId);
  const coverImage = await resolveCoverImage(sql, payload.coverMediaId);
  const content = docToPlainText(payload.contentDoc);
  const featured = isSuperAdmin(user) ? payload.featured : existing.featured;

  await sql.query(
    `UPDATE articles SET
       title = $2,
       slug = $3,
       excerpt = $4,
       content = $5,
       content_doc = $6::jsonb,
       cover_image = $7,
       cover_media_id = $8,
       category = $9,
       category_id = $10,
       tags = $11::jsonb,
       author = $12,
       author_id = $13,
       author_role = $14,
       published_date = $15,
       published_at = $16::timestamptz,
       read_time = $17,
       status = $18,
       featured = $19,
       seo_title = $20,
       seo_description = $21,
       updated_at = NOW()
     WHERE id = $1`,
    [
      id,
      payload.title,
      slug,
      payload.excerpt,
      content,
      JSON.stringify(payload.contentDoc),
      coverImage,
      payload.coverMediaId,
      categoryName,
      payload.categoryId,
      JSON.stringify(payload.tags),
      existing.author || user.name,
      existing.authorId ?? user.id,
      existing.authorRole ?? user.role,
      publishedAt ? publishedAt.slice(0, 10) : "",
      publishedAt,
      estimateReadTime(content),
      nextStatus,
      featured,
      payload.seoTitle,
      payload.seoDescription,
    ]
  );

  await replaceAttachments(sql, id, payload.attachmentIds);
  await syncMediaVisibility(sql, id, nextStatus);

  const updated = await getArticleByIdCachedFresh(id);
  if (!updated) throw new ApiError(500, "Gagal memuat artikel setelah disimpan.");
  return updated;
}

const TRANSITION_RULES: Record<
  NewsTransitionAction,
  { from: NewsStatus[]; adminOnly: boolean; to: NewsStatus }
> = {
  submit: { from: ["draft"], adminOnly: false, to: "pending_review" },
  publish: { from: ["draft", "pending_review", "archived"], adminOnly: true, to: "published" },
  archive: { from: ["draft", "pending_review", "published"], adminOnly: true, to: "archived" },
  revert_to_draft: {
    from: ["pending_review", "published", "archived"],
    adminOnly: false,
    to: "draft",
  },
};

export async function transitionArticle(
  id: string,
  action: NewsTransitionAction,
  user: SessionUser
): Promise<Article> {
  const sql = getDb();
  const existing = await getArticleByIdCachedFresh(id);
  if (!existing) throw new ApiError(404, "Artikel tidak ditemukan.");

  const rule = TRANSITION_RULES[action];
  if (!rule.from.includes(existing.status)) {
    throw new ApiError(
      400,
      `Aksi "${action}" tidak berlaku untuk artikel berstatus ${existing.status}.`
    );
  }
  if (rule.adminOnly) {
    if (!isSuperAdmin(user)) {
      throw new ApiError(403, "Hanya super admin yang dapat melakukan aksi ini.");
    }
  } else if (!isSuperAdmin(user) && existing.authorId !== user.id) {
    throw new ApiError(403, "Anda hanya dapat mengubah status berita milik Anda.");
  }

  const publishedAt =
    rule.to === "published"
      ? existing.publishedAt ?? new Date().toISOString()
      : existing.publishedAt ?? null;

  await sql.query(
    `UPDATE articles SET
       status = $2,
       published_at = $3::timestamptz,
       published_date = $4,
       updated_at = NOW()
     WHERE id = $1`,
    [id, rule.to, publishedAt, publishedAt ? publishedAt.slice(0, 10) : ""]
  );

  await syncMediaVisibility(sql, id, rule.to);

  const updated = await getArticleByIdCachedFresh(id);
  if (!updated) throw new ApiError(500, "Gagal memuat artikel setelah perubahan status.");
  return updated;
}

export async function deleteArticle(id: string, user: SessionUser): Promise<void> {
  const sql = getDb();
  const existing = await getArticleByIdCachedFresh(id);
  if (!existing) throw new ApiError(404, "Artikel tidak ditemukan.");

  if (!isSuperAdmin(user)) {
    if (existing.authorId !== user.id) {
      throw new ApiError(403, "Anda hanya dapat menghapus berita milik Anda sendiri.");
    }
    if (existing.status !== "draft") {
      throw new ApiError(403, "Editor hanya dapat menghapus berita berstatus draf.");
    }
  }

  await sql.query(`DELETE FROM articles WHERE id = $1`, [id]);
}

export async function checkSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<{ available: boolean }> {
  const sql = getDb();
  const candidate = slugify(slug);
  const rows = (await sql.query(`SELECT id FROM articles WHERE slug = $1 LIMIT 1`, [
    candidate,
  ])) as SqlRow[];
  const available = rows.length === 0 || (excludeId != null && rows[0].id === excludeId);
  return { available };
}

// ── kategori ───────────────────────────────────────────────────────────

export async function listCategories(): Promise<NewsCategory[]> {
  const sql = getDb();
  const rows = (await sql.query(
    `SELECT c.*,
            (SELECT count(*)::int FROM articles a
             WHERE a.category_id = c.id AND a.status = 'published') AS article_count
     FROM categories c
     ORDER BY c.name ASC`
  )) as SqlRow[];
  return rows.map(mapCategoryRow);
}

async function uniqueCategorySlug(
  sql: NeonSql,
  base: string,
  excludeId?: string
): Promise<string> {
  const candidate = slugify(base) || "kategori";
  for (let i = 0; i < 50; i++) {
    const test = i === 0 ? candidate : `${candidate}-${i + 1}`;
    const rows = (await sql.query(`SELECT id FROM categories WHERE slug = $1 LIMIT 1`, [
      test,
    ])) as SqlRow[];
    if (rows.length === 0 || (excludeId && rows[0].id === excludeId)) return test;
  }
  return `${candidate}-${Date.now().toString(36)}`;
}

export async function createCategory(name: string): Promise<NewsCategory> {
  const sql = getDb();
  const slug = await uniqueCategorySlug(sql, name);
  const rows = (await sql.query(
    `INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3) RETURNING *`,
    [generateId("cat"), name, slug]
  )) as SqlRow[];
  return mapCategoryRow({ ...rows[0], article_count: 0 });
}

export async function updateCategory(id: string, name: string): Promise<NewsCategory> {
  const sql = getDb();
  const rows = (await sql.query(`SELECT id FROM categories WHERE id = $1 LIMIT 1`, [id])) as SqlRow[];
  if (rows.length === 0) throw new ApiError(404, "Kategori tidak ditemukan.");
  const slug = await uniqueCategorySlug(sql, name, id);
  const updated = (await sql.query(
    `UPDATE categories SET name = $2, slug = $3 WHERE id = $1 RETURNING *`,
    [id, name, slug]
  )) as SqlRow[];
  return mapCategoryRow(updated[0]);
}

export async function deleteCategory(id: string): Promise<void> {
  const sql = getDb();
  const used = (await sql.query(
    `SELECT count(*)::int AS n FROM articles WHERE category_id = $1`,
    [id]
  )) as SqlRow[];
  if (Number(used[0]?.n ?? 0) > 0) {
    throw new ApiError(409, "Kategori masih dipakai artikel dan tidak dapat dihapus.");
  }
  const result = (await sql.query(
    `DELETE FROM categories WHERE id = $1 RETURNING id`,
    [id]
  )) as SqlRow[];
  if (result.length === 0) throw new ApiError(404, "Kategori tidak ditemukan.");
}

// ── media library ──────────────────────────────────────────────────────

export async function listNewsMedia(kind?: "image" | "document"): Promise<NewsMedia[]> {
  const sql = getDb();
  const rows = kind
    ? ((await sql.query(
        `SELECT * FROM media_items WHERE kind = $1 ORDER BY created_at DESC LIMIT 200`,
        [kind]
      )) as SqlRow[])
    : ((await sql.query(
        `SELECT * FROM media_items ORDER BY created_at DESC LIMIT 200`
      )) as SqlRow[]);
  return rows.map(mapNewsMediaRow);
}

export interface MediaUsage {
  cover: number;
  attachments: number;
  inline: number;
}

export async function getMediaUsage(mediaId: string): Promise<MediaUsage> {
  const sql = getDb();
  const cover = (await sql.query(
    `SELECT count(*)::int AS n FROM articles WHERE cover_media_id = $1`,
    [mediaId]
  )) as SqlRow[];
  const attachments = (await sql.query(
    `SELECT count(*)::int AS n FROM article_attachments WHERE media_id = $1`,
    [mediaId]
  )) as SqlRow[];
  const inline = (await sql.query(
    `SELECT count(*)::int AS n FROM articles
     WHERE content_doc IS NOT NULL AND content_doc::text LIKE $2`,
    [mediaId, `%${mediaId}%`]
  )) as SqlRow[];
  return {
    cover: Number(cover[0]?.n ?? 0),
    attachments: Number(attachments[0]?.n ?? 0),
    inline: Number(inline[0]?.n ?? 0),
  };
}

export async function deleteNewsMedia(mediaId: string, user: SessionUser): Promise<void> {
  const sql = getDb();
  const media = await getMediaById(sql, mediaId);
  if (!media) throw new ApiError(404, "Berkas tidak ditemukan.");

  if (!isSuperAdmin(user) && media.storageKey) {
    const owner = (await sql.query(
      `SELECT uploaded_by FROM media_items WHERE id = $1 LIMIT 1`,
      [mediaId]
    )) as SqlRow[];
    if (String(owner[0]?.uploaded_by ?? "") !== user.id) {
      throw new ApiError(403, "Anda hanya dapat menghapus berkas yang Anda unggah.");
    }
  }

  const usage = await getMediaUsage(mediaId);
  if (usage.cover + usage.attachments + usage.inline > 0) {
    throw new ApiError(
      409,
      "Berkas masih digunakan oleh artikel. Hapus dulu referensinya dari artikel terkait."
    );
  }

  if (media.storageKey) {
    const { deleteObject } = await import("@/lib/storage/r2");
    try {
      await deleteObject(media.storageKey);
    } catch (error) {
      console.error("Gagal menghapus objek dari storage:", error);
    }
  }
  await sql.query(`DELETE FROM media_items WHERE id = $1`, [mediaId]);
}
