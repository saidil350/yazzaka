// Migrasi Better Auth: siapkan tabel sessions/accounts/verifications dan
// sesuaikan tabel users agar cocok dengan model Better Auth.
// Jalankan ke SETIAP branch Neon: npm run env:staging (atau env:production)
// lalu node scripts/migrate-better-auth.mjs
//
// Password user TIDAK diubah: hash scrypt lama di users.password_hash
// disalin ke accounts.password sebagai credential Better Auth.

import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

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

const connectionString =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL tidak ditemukan.");
  process.exit(1);
}

const sql = neon(connectionString);

function id(prefix) {
  return `${prefix}-${randomBytes(12).toString("hex")}`;
}

async function migrate() {
  // ── users: kolom tambahan untuk model Better Auth ────────────────────────
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT TRUE`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP`;
  // created_at lama bertipe TEXT (ISO string) — konversi ke TIMESTAMP agar
  // Better Auth (yang menulis objek Date) bekerja dengan benar.
  const col = await sql`
    SELECT data_type FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'created_at'
  `;
  if (col[0]?.data_type === "text" || col[0]?.data_type === "character varying") {
    await sql`ALTER TABLE users ALTER COLUMN created_at TYPE TIMESTAMP USING created_at::timestamptz`;
    console.log("✓ users.created_at dikonversi ke TIMESTAMP");
  }
  await sql`UPDATE users SET updated_at = COALESCE(updated_at, created_at, now())`;
  await sql`UPDATE users SET email = lower(email) WHERE email <> lower(email)`;
  console.log("✓ Kolom users siap (email_verified, updated_at)");

  // ── Tabel inti Better Auth (nama singular, kolom default camelCase) ──────
  // Kompatibilitas dengan versi skrip lama yang membuat tabel plural:
  await sql`ALTER TABLE IF EXISTS sessions RENAME TO session`;
  await sql`ALTER TABLE IF EXISTS accounts RENAME TO account`;
  await sql`DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'verifications')
       AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'verification')
    THEN ALTER TABLE verifications RENAME TO verification; END IF;
  END $$`;
  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMP NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS "account" (
      "id" TEXT PRIMARY KEY,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TIMESTAMP,
      "refreshTokenExpiresAt" TIMESTAMP,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS "verification" (
      "id" TEXT PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP DEFAULT now(),
      "updatedAt" TIMESTAMP DEFAULT now()
    )
  `;
  console.log("✓ Tabel sessions, accounts, verifications siap");

  // ── Salin hash scrypt lama ke accounts (provider credential) ─────────────
  const missing = await sql`
    SELECT u.id, u.password_hash, COALESCE(u.created_at, now()) AS created_at
    FROM users u
    WHERE u.password_hash IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM "account" a WHERE a."userId" = u.id AND a."providerId" = 'credential'
      )
  `;
  for (const u of missing) {
    await sql`
      INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
      VALUES (${id("acct")}, ${u.id}, 'credential', ${u.id}, ${u.password_hash}, ${u.created_at}, ${u.created_at})
    `;
  }
  console.log(`✓ ${missing.length} credential user disalin ke accounts`);

  console.log("\n🎉 Migrasi Better Auth selesai.");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });
