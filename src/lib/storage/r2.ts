import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { slugify } from "@/lib/utils";

/**
 * Lapisan penyimpanan berkas dengan dua backend:
 * - Cloudflare R2 (S3-compatible) bila kredensial R2_* lengkap — backend
 *   produksi agar berkas bertahan lintas deploy.
 * - Disk lokal <repo>/storage/uploads bila env UPLOAD_LOCAL_FALLBACK=1 dan
 *   R2 belum dikonfigurasi — untuk pengembangan lokal.
 * Tanpa keduanya, unggahan ditolak dengan pesan jelas (jangan pernah
 * berpura-pura berhasil).
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

/** Fallback disk lokal hanya aktif lewat env eksplisit (pengembangan lokal). */
export function isLocalFallbackEnabled(): boolean {
  const flag = process.env.UPLOAD_LOCAL_FALLBACK;
  return flag === "1" || flag === "true";
}

export function isStorageConfigured(): boolean {
  return getStorageConfig() !== null || isLocalFallbackEnabled();
}

function localRoot(): string {
  return path.join(process.cwd(), "storage", "uploads");
}

/** Resolusi kunci ke path disk, menolak kunci yang keluar dari root. */
function localPath(key: string): string | null {
  const root = path.resolve(localRoot());
  const full = path.resolve(root, key);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
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
  if (config) {
    const client = getS3Client(config);
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
    return;
  }
  if (!isLocalFallbackEnabled()) {
    throw new Error("Object storage belum dikonfigurasi");
  }
  const full = localPath(key);
  if (!full) throw new Error("Kunci penyimpanan tidak valid");
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, body);
}

export async function getObject(
  key: string
): Promise<{ body: ReadableStream<Uint8Array>; contentType: string | null; contentLength: number | null }> {
  const config = getStorageConfig();
  if (config) {
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
  if (!isLocalFallbackEnabled()) {
    throw new Error("Object storage belum dikonfigurasi");
  }
  const full = localPath(key);
  if (!full) throw new Error("Kunci penyimpanan tidak valid");
  const buffer = await fs.readFile(full);
  return {
    body: new Blob([buffer]).stream() as ReadableStream<Uint8Array>,
    // Content-Type diambil dari kolom mime_type media_items oleh pemanggil.
    contentType: null,
    contentLength: buffer.byteLength,
  };
}

export async function deleteObject(key: string): Promise<void> {
  const config = getStorageConfig();
  if (config) {
    const client = getS3Client(config);
    await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
    return;
  }
  if (!isLocalFallbackEnabled()) {
    throw new Error("Object storage belum dikonfigurasi");
  }
  const full = localPath(key);
  if (!full) throw new Error("Kunci penyimpanan tidak valid");
  await fs.rm(full, { force: true });
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
