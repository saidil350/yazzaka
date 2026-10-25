#!/usr/bin/env node
/**
 * upload-local-storage-to-r2.mjs
 * ------------------------------
 * Mengunggah seluruh berkas di <repo>/storage/uploads (backend fallback
 * lokal) ke Cloudflare R2 dengan key yang sama persis, sehingga file_url
 * /api/files/... yang tersimpan di database tetap valid saat runtime
 * memakai backend R2 (production/preview Vercel).
 *
 * Prasyarat (env, bisa lewat .env.local):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
 *   R2_PUBLIC_BASE_URL (opsional)
 *
 * Idempoten: menjalankan ulang menimpa objek dengan key yang sama.
 * Tidak mencetak kredensial — hanya nama bucket dan ringkasan.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

function loadEnvLocal() {
  try {
    const content = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env.local opsional
  }
}

loadEnvLocal();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;

if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
  console.error(
    "✗ Kredensial R2 belum lengkap. Isi R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET di .env.local (atau env shell)."
  );
  process.exit(1);
}
console.log(`Target R2 bucket: ${bucket} (account ...${accountId.slice(-6)})`);

const root = path.join(process.cwd(), "storage", "uploads");
function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

let files;
try {
  files = walk(root);
} catch {
  console.error(`✗ Folder ${root} tidak ditemukan — tidak ada berkas lokal untuk diunggah.`);
  process.exit(1);
}
if (files.length === 0) {
  console.log("• Tidak ada berkas lokal untuk diunggah.");
  process.exit(0);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

let uploaded = 0;
for (const file of files) {
  const key = path.relative(root, file).split(path.sep).join("/");
  const body = new Uint8Array(readFileSync(file));
  const ext = path.extname(file).toLowerCase();
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: MIME[ext] ?? "application/octet-stream",
    })
  );
  uploaded += 1;
}
console.log(`✓ ${uploaded} berkas terunggah ke R2.`);

// Verifikasi: jumlah objek di R2 dengan prefix root harus >= jumlah berkas lokal.
let listed = 0;
let token;
do {
  const res = await s3.send(
    new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1000, ContinuationToken: token })
  );
  listed += res.Contents?.length ?? 0;
  token = res.IsTruncated ? res.NextContinuationToken : undefined;
} while (token);
console.log(`✓ Verifikasi: ${listed} objek total di bucket (termasuk objek lain bila ada).`);
if (listed < uploaded) {
  console.error("✗ Jumlah objek R2 lebih kecil dari berkas terunggah — periksa manual.");
  process.exit(1);
}
console.log("✓ Selesai.");
