import { z } from "zod";
import type { TiptapDoc, TiptapNode } from "./types";

/**
 * Skema validasi (zod) untuk payload fitur berita.
 * Field opsional dinormalisasi menjadi null — bukan string kosong.
 */

const tiptapMarkSchema = z.object({
  type: z.string(),
  attrs: z.record(z.string(), z.unknown()).optional(),
});

const tiptapNodeSchema: z.ZodType<TiptapNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(tiptapNodeSchema).optional(),
    marks: z.array(tiptapMarkSchema).optional(),
    text: z.string().optional(),
  })
);

export const articleContentDocSchema = z.object({
  type: z.literal("doc"),
  content: z.array(tiptapNodeSchema),
});

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((v) => {
      const trimmed = v?.trim();
      return trimmed ? trimmed : null;
    });

export const articlePayloadSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(220)
    .regex(/^[a-z0-9-]*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung")
    .nullish()
    .transform((v) => v || null),
  excerpt: optionalText(500),
  contentDoc: articleContentDocSchema,
  categoryId: z.string().max(64).nullish().transform((v) => v || null),
  coverMediaId: z.string().max(64).nullish().transform((v) => v || null),
  attachmentIds: z.array(z.string().max(64)).max(20).default([]),
  tags: z
    .array(z.string().trim().min(1).max(50))
    .max(10)
    .default([]),
  featured: z.boolean().default(false),
  seoTitle: optionalText(200),
  seoDescription: optionalText(300),
  status: z.enum(["draft", "pending_review", "published", "archived"]).optional(),
});

export type ArticlePayload = z.infer<typeof articlePayloadSchema>;

export const transitionSchema = z.object({
  action: z.enum(["submit", "publish", "archive", "revert_to_draft"]),
});

export const categoryPayloadSchema = z.object({
  name: z.string().trim().min(2, "Nama kategori minimal 2 karakter").max(60),
});

export const slugCheckSchema = z.object({
  slug: z.string().trim().min(1).max(220),
  excludeId: z.string().max(64).optional(),
});

/** Kumpulkan teks polos dari dokumen Tiptap (untuk kolom content & SEO). */
export function docToPlainText(doc: TiptapDoc): string {
  const blocks: string[] = [];

  const walk = (node: TiptapNode): string => {
    if (node.type === "text") {
      return node.text ?? "";
    }
    if (node.type === "image") {
      return "[gambar]";
    }
    if (node.type === "hardBreak") {
      return "\n";
    }
    const inner: string = (node.content ?? []).map(walk).join("");
    if (
      node.type === "paragraph" ||
      node.type === "heading" ||
      node.type === "blockquote" ||
      node.type === "codeBlock"
    ) {
      if (inner.trim()) blocks.push(inner.trim());
      return "";
    }
    if (node.type === "listItem") {
      if (inner.trim()) blocks.push(`• ${inner.trim()}`);
      return "";
    }
    return inner;
  };

  for (const node of doc.content ?? []) {
    walk(node);
  }
  return blocks.join("\n\n");
}

/** Dokumen dianggap bermakna bila memuat teks nyata atau minimal satu gambar. */
export function docHasContent(doc: TiptapDoc): boolean {
  let meaningful = false;

  const walk = (node: TiptapNode): void => {
    if (meaningful) return;
    if (node.type === "text" && (node.text ?? "").trim().length > 0) {
      meaningful = true;
      return;
    }
    if (node.type === "image") {
      meaningful = true;
      return;
    }
    for (const child of node.content ?? []) walk(child);
  };

  for (const node of doc.content ?? []) walk(node);
  return meaningful;
}

/** Kumpulkan mediaId dari semua node gambar pada dokumen. */
export function collectImageMediaIds(doc: TiptapDoc): string[] {
  const ids = new Set<string>();

  const walk = (node: TiptapNode): void => {
    if (node.type === "image") {
      const mediaId = node.attrs?.mediaId;
      if (typeof mediaId === "string" && mediaId) ids.add(mediaId);
    }
    for (const child of node.content ?? []) walk(child);
  };

  for (const node of doc.content ?? []) walk(node);
  return Array.from(ids);
}
