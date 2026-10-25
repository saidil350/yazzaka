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

export interface StorageConfig {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  privateBucket: string | null;
  publicBaseUrl: string | null;
  forcePathStyle: boolean;
  provider: "r2" | "neon";
}

/**
 * Storage mendukung Cloudflare R2 dan Neon Object Storage.
 * Untuk Neon, kredensial wajib di-scope ke branch database yang sama.
 * Bucket publik dan privat dipisahkan agar visibility privat tidak dapat
 * dilewati dengan membuka URL objek secara langsung.
 */
export function getStorageConfig(): StorageConfig | null {
  const r2AccountId = process.env.R2_ACCOUNT_ID;
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const r2Bucket = process.env.R2_BUCKET;

  if (r2AccountId && r2AccessKeyId && r2SecretAccessKey && r2Bucket) {
    return {
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      region: "auto",
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
      bucket: r2Bucket,
      privateBucket: null,
      publicBaseUrl: process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "") || null,
      forcePathStyle: false,
      provider: "r2",
    };
  }

  const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/+$/, "");
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;
  const bucket =
    process.env.NEON_STORAGE_PUBLIC_BUCKET ||
    process.env.NEON_STORAGE_BUCKET;

  if (!endpoint || !accessKeyId || !secretAccessKey || !region || !bucket) {
    return null;
  }

  return {
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    privateBucket: process.env.NEON_STORAGE_PRIVATE_BUCKET || null,
    publicBaseUrl:
      process.env.NEON_STORAGE_PUBLIC_BASE?.replace(/\/+$/, "") ||
      `${endpoint}/${encodeURIComponent(bucket)}`,
    forcePathStyle: true,
    provider: "neon",
  };
}

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

function localPath(key: string): string | null {
  const root = path.resolve(localRoot());
  const full = path.resolve(root, key);
  if (full !== root && !full.startsWith(root + path.sep)) return null;
  return full;
}

function bucketFor(config: StorageConfig, key: string, visibility: string): string {
  if (config.provider === "r2") return config.bucket;

  // Key menentukan lokasi fisik meskipun status artikel berubah.
  // Key private/ selalu berada di bucket privat, termasuk setelah diterbitkan.
  if (key.startsWith("private/")) {
    if (!config.privateBucket) {
      throw new Error(
        "Bucket privat Neon belum dikonfigurasi; operasi media privat ditolak."
      );
    }
    return config.privateBucket;
  }

  // Key tanpa prefix ada di bucket public_read. Tolak metadata privat agar
  // media publik lama tidak secara tidak sengaja disajikan sebagai berkas privat.
  if (visibility !== "public") {
    throw new Error(
      "Berkas privat lama berada di bucket publik; akses ditolak sampai berkas dipindahkan."
    );
  }

  return config.bucket;
}

function getS3Client(config: StorageConfig): S3Client {
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

function encodeStorageKey(key: string): string {
  return key.split("/").map((part) => encodeURIComponent(part)).join("/");
}

export async function putObject(
  key: string,
  body: Uint8Array,
  contentType: string,
  visibility = "private"
): Promise<void> {
  const config = getStorageConfig();
  if (config) {
    const client = getS3Client(config);
    await client.send(
      new PutObjectCommand({
        Bucket: bucketFor(config, key, visibility),
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
  key: string,
  visibility = "private"
): Promise<{
  body: ReadableStream<Uint8Array>;
  contentType: string | null;
  contentLength: number | null;
}> {
  const config = getStorageConfig();
  if (config) {
    const client = getS3Client(config);
    const result = await client.send(
      new GetObjectCommand({
        Bucket: bucketFor(config, key, visibility),
        Key: key,
      })
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
    contentType: null,
    contentLength: buffer.byteLength,
  };
}

export async function deleteObject(
  key: string,
  visibility = "private"
): Promise<void> {
  const config = getStorageConfig();
  if (config) {
    const client = getS3Client(config);
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucketFor(config, key, visibility),
        Key: key,
      })
    );
    return;
  }
  if (!isLocalFallbackEnabled()) {
    throw new Error("Object storage belum dikonfigurasi");
  }
  const full = localPath(key);
  if (!full) throw new Error("Kunci penyimpanan tidak valid");
  await fs.rm(full, { force: true });
}

export function publicUrl(key: string): string | null {
  const config = getStorageConfig();
  if (!config?.publicBaseUrl) return null;
  return `${config.publicBaseUrl}/${encodeStorageKey(key)}`;
}

export function resolveMediaUrl(key: string, visibility: string): string {
  if (visibility === "public" && !key.startsWith("private/")) {
    const direct = publicUrl(key);
    if (direct) return direct;
  }
  return `/api/files/${encodeStorageKey(key)}`;
}

export function maxImageMB(): number {
  const parsed = Number(process.env.NEWS_MAX_IMAGE_MB);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

export function maxDocumentMB(): number {
  const parsed = Number(process.env.NEWS_MAX_DOC_MB);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

export function buildStorageKey(originalName: string, visibility = "private"): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const dot = originalName.lastIndexOf(".");
  const base = dot > 0 ? originalName.slice(0, dot) : originalName;
  const ext = dot > 0 ? originalName.slice(dot + 1).toLowerCase() : "";
  const safeBase = slugify(base).slice(0, 80) || "berkas";
  const uuid = randomUUID();
  const key = `news/${year}/${month}/${uuid}-${safeBase}${ext ? `.${ext}` : ""}`;
  return visibility === "public" ? key : `private/${key}`;
}
