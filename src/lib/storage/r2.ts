import { randomUUID } from "node:crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { slugify } from "@/lib/utils";

/**
 * Integrasi Cloudflare R2 (S3-compatible) untuk berkas fitur berita.
 * Kredensial dibaca dari env — tanpa kredensial, upload ditolak dengan
 * pesan jelas (jangan pernah berpura-pura berhasil).
 */

export interface StorageConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string | null;
}

export function getStorageConfig(): StorageConfig | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "") || null;
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

export function isStorageConfigured(): boolean {
  return getStorageConfig() !== null;
}

function getS3Client(config: StorageConfig): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export async function putObject(
  key: string,
  body: Uint8Array,
  contentType: string
): Promise<void> {
  const config = getStorageConfig();
  if (!config) throw new Error("Object storage belum dikonfigurasi");
  const client = getS3Client(config);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

export async function getObject(
  key: string
): Promise<{ body: ReadableStream<Uint8Array>; contentType: string | null; contentLength: number | null }> {
  const config = getStorageConfig();
  if (!config) throw new Error("Object storage belum dikonfigurasi");
  const client = getS3Client(config);
  const result = await client.send(
    new GetObjectCommand({ Bucket: config.bucket, Key: key })
  );
  if (!result.Body) throw new Error("Objek tidak ditemukan di storage");
  return {
    body: result.Body.transformToWebStream(),
    contentType: result.ContentType ?? null,
    contentLength: result.ContentLength ?? null,
  };
}

export async function deleteObject(key: string): Promise<void> {
  const config = getStorageConfig();
  if (!config) throw new Error("Object storage belum dikonfigurasi");
  const client = getS3Client(config);
  await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
}

/** URL publik langsung dari R2 (hanya untuk berkas visibility public). */
export function publicUrl(key: string): string | null {
  const config = getStorageConfig();
  if (!config?.publicBaseUrl) return null;
  return `${config.publicBaseUrl}/${key}`;
}

/**
 * URL terbaik untuk menampilkan berkas.
 * - public + publicBaseUrl tersedia → langsung dari R2 (hemat hit server).
 * - selain itu → /api/files/<key> (streaming server, cek visibility).
 */
export function resolveMediaUrl(key: string, visibility: string): string {
  if (visibility === "public") {
    const direct = publicUrl(key);
    if (direct) return direct;
  }
  return `/api/files/${key}`;
}

/** Batas ukuran dapat dikonfigurasi lewat env (default 5 MB / 10 MB). */
export function maxImageMB(): number {
  const parsed = Number(process.env.NEWS_MAX_IMAGE_MB);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

export function maxDocumentMB(): number {
  const parsed = Number(process.env.NEWS_MAX_DOC_MB);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

/** Kunci objek unik: news/2026/10/<uuid>-<nama-bersih>.<ext> */
export function buildStorageKey(originalName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const dot = originalName.lastIndexOf(".");
  const base = dot > 0 ? originalName.slice(0, dot) : originalName;
  const ext = dot > 0 ? originalName.slice(dot + 1).toLowerCase() : "";
  const safeBase = slugify(base).slice(0, 80) || "berkas";
  const uuid = randomUUID();
  return `news/${year}/${month}/${uuid}-${safeBase}${ext ? `.${ext}` : ""}`;
}
