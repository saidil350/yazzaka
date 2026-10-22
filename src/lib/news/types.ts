/**
 * Tipe domain fitur berita: dokumen Tiptap, artikel, kategori, dan media.
 */

export type NewsStatus = "draft" | "pending_review" | "published" | "archived";

export const NEWS_STATUS_LABEL: Record<NewsStatus, string> = {
  draft: "Draf",
  pending_review: "Menunggu Tinjau",
  published: "Terbit",
  archived: "Arsip",
};

export type NewsTransitionAction =
  | "submit"
  | "publish"
  | "archive"
  | "revert_to_draft";

/** Node dokumen Tiptap yang tersimpan di articles.content_doc (JSONB). */
export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

export interface TiptapDoc {
  type: "doc";
  content: TiptapNode[];
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface NewsMedia {
  id: string;
  fileName: string;
  /** URL yang siap dipakai <img>/<a>: R2 public base atau /api/files/<key>. */
  fileUrl: string;
  storageKey: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  kind: "image" | "document" | "other";
  visibility: "public" | "private";
  altText: string | null;
  uploadedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  /** Ringkasan — null bila penulis tidak mengisi. */
  excerpt: string | null;
  /** Teks polos turunan content_doc (fallback rendering & pencarian).
   *  Tidak disertakan pada payload ringkas /api/school-data. */
  content?: string;
  /** Dokumen Tiptap; null/absen untuk artikel legacy sebelum fitur rich text. */
  contentDoc?: TiptapDoc | null;
  coverImage: string | null;
  coverMediaId?: string | null;
  categoryId?: string | null;
  /** Nama kategori ter-resolve (join categories, fallback kolom legacy). */
  category: string;
  tags: string[];
  /** Nama penulis ter-resolve (join users, fallback kolom legacy). */
  author: string;
  authorId?: string | null;
  authorRole: string | null;
  /** Tanggal tampil: published_at ?? published_date (legacy). */
  publishedDate: string;
  publishedAt?: string | null;
  readTime: string;
  status: NewsStatus;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleAttachment {
  id: string;
  media: NewsMedia;
}

export interface ArticleListResult {
  items: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const PAGE_SIZE_DEFAULT = 9;
export const PAGE_SIZE_MAX = 50;
