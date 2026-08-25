// Migration auth: tambah kolom password_hash pada tabel users + seed akun CMS.
// Jalankan dengan: node scripts/migrate-auth.mjs
//
// Password akun diambil dari env CMS_SEED_PASSWORD (opsional).
// Ganti password setelah login pertama di produksi!

import { neon } from "@neondatabase/serverless";
import { randomBytes, scryptSync } from "node:crypto";
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

export function hashPassword(password) {
  const salt = randomBytes(16);
  const N = 16384, r = 8, p = 1;
  const derived = scryptSync(password, salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

async function migrate() {
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT
  `;
  console.log("✓ Kolom password_hash siap");

  const password = process.env.CMS_SEED_PASSWORD || "Yazzakka#2026";
  const hash = hashPassword(password);

  const users = [
    { id: "cms-user-admin", name: "Super Admin Yazzaka", email: "admin@yazzakka.sch.id", role: "super_admin" },
    { id: "cms-user-editor", name: "Editor Konten Yazzaka", email: "editor@yazzakka.sch.id", role: "editor" },
    { id: "cms-user-ppdb", name: "Staf PPDB Yazzaka", email: "spmb@yazzakka.sch.id", role: "admission_staff" },
  ];

  for (const u of users) {
    // Cegah konflik id/email warisan dari seed lama: hapus baris lama untuk email ini
    await sql`DELETE FROM users WHERE lower(email) = ${u.email}`;

    const inserted = await sql`
      INSERT INTO users (id, name, email, role, password_hash, created_at)
      VALUES (${u.id}, ${u.name}, ${u.email}, ${u.role}, ${hash}, ${new Date().toISOString().split("T")[0]})
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    if (inserted.length === 0) {
      // id masih terpakai baris lain — pakai id alternatif deterministik
      const altId = `cms-${randomBytes(4).toString("hex")}`;
      await sql`
        INSERT INTO users (id, name, email, role, password_hash, created_at)
        VALUES (${altId}, ${u.name}, ${u.email}, ${u.role}, ${hash}, ${new Date().toISOString().split("T")[0]})
      `;
    }
    console.log(`✓ Akun disiapkan: ${u.email} (${u.role})`);
  }

  console.log(`\n🎉 Migrasi auth selesai. Password awal semua akun: ${password}`);
  if (!process.env.CMS_SEED_PASSWORD) {
    console.log("⚠️  Password default sedang dipakai. Set env CMS_SEED_PASSWORD dan jalankan ulang untuk mengganti!");
  }
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit(1);
  });
