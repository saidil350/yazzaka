// Reset password akun super_admin CMS (users.password_hash + account.password
// + hapus sesi aktif). Kredensial tidak pernah di-hardcode di sini.
//
// Tanpa argumen : hanya menampilkan status password seluruh user (tanpa ubah).
// Dengan target  : wajib password via env CMS_SEED_PASSWORD atau --password.
//
// Contoh:
//   node scripts/reset-admin-password.cjs
//   node scripts/reset-admin-password.cjs --all-super-admins --env-file .env.staging.local
//   CMS_SEED_PASSWORD=... node scripts/reset-admin-password.cjs --email admin@x.id
//   node scripts/reset-admin-password.cjs --all-super-admins --show   # cetak password sekali
const { neon } = require('@neondatabase/serverless');
const { scryptSync, randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

// ── argumen ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
function argValue(name) {
  const i = args.indexOf(name);
  return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
}
const email = argValue('--email');
const allSuperAdmins = args.includes('--all-super-admins');
const show = args.includes('--show');
const envFileArg = argValue('--env-file');
const newPassword = process.env.CMS_SEED_PASSWORD || argValue('--password');

// ── env file (default .env.local, bisa dioverride utk production/staging) ──
const envFile = envFileArg || '.env.local';
const envPath = path.join(__dirname, '..', envFile);
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

function hashPassword(password) {
  const N = 16384, r = 8, p = 1;
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString('hex')}:${derived.toString('hex')}`;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(`✗ DATABASE_URL tidak ditemukan di ${envFile}.`);
    process.exit(1);
  }
  console.log(`Target DB: ${new URL(process.env.DATABASE_URL).hostname}`);

  const sql = neon(process.env.DATABASE_URL);

  const rows = await sql`
    SELECT id, email, role,
      CASE WHEN password_hash IS NULL THEN 'NULL'
           WHEN password_hash = '' THEN 'EMPTY'
           ELSE 'SET' END as pass_status
    FROM users
  `;

  console.log('\n=== STATUS PASSWORD USERS ===');
  console.log(JSON.stringify(rows, null, 2));

  // Tanpa target → hanya laporan, tidak mengubah apa pun.
  if (!email && !allSuperAdmins) {
    console.log('\n(i) Mode laporan. Untuk reset: --email <email> atau --all-super-admins,');
    console.log('    plus password via env CMS_SEED_PASSWORD atau --password.');
    return;
  }

  if (!newPassword || newPassword.length < 8) {
    console.error('✗ Password baru wajib diisi (min. 8 karakter): env CMS_SEED_PASSWORD atau --password.');
    process.exit(1);
  }

  const targets = allSuperAdmins
    ? rows.filter(r => r.role === 'super_admin')
    : rows.filter(r => r.email.toLowerCase() === String(email).toLowerCase());

  if (targets.length === 0) {
    console.error('✗ Tidak ada user target yang cocok.');
    process.exit(1);
  }

  const hash = hashPassword(newPassword);

  for (const row of targets) {
    // users.password_hash (kolom legacy) + account.password (credential
    // Better Auth) disetel senada, lalu sesi aktif dihapus agar re-login.
    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${row.id}`;
    await sql`UPDATE "account" SET "password" = ${hash}, "updatedAt" = now() WHERE "userId" = ${row.id} AND "providerId" = 'credential'`;
    await sql`DELETE FROM "session" WHERE "userId" = ${row.id}`;
    console.log(`\n🔑 Password di-reset: ${row.email}`);
  }

  if (show) {
    console.log(`\n📋 Password baru (jangan simpan di file): ${newPassword}`);
  } else {
    console.log(`\n✓ ${targets.length} akun di-reset. Password diambil dari CMS_SEED_PASSWORD (tidak dicetak).`);
  }
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
