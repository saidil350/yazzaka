const { neon } = require('@neondatabase/serverless');
const { scryptSync, randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

// Baca .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

function hashPassword(password) {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString('hex')}:${derived.toString('hex')}`;
}

async function main() {
  // Password WAJIB lewat env CMS_SEED_PASSWORD atau argumen kedua —
  // tidak pernah di-hardcode di skrip ini dan tidak dicetak ke console.
  const password = process.env.CMS_SEED_PASSWORD || process.argv[2];

  if (!password || password.length < 8) {
    console.error(
      '✗ Password wajib diisi (min. 8 karakter). Gunakan:\n' +
      '    CMS_SEED_PASSWORD=<password> node scripts/create-user.cjs\n' +
      '  atau: node scripts/create-user.cjs <password>'
    );
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  const newUser = {
    name: 'Admin Yazzaka',
    email: 'admin.baru@yazzakka.sch.id',
    role: 'super_admin',
  };

  const id = `usr-${Date.now()}-${randomBytes(12).toString('hex')}`;
  const passwordHash = hashPassword(password);

  // Hapus jika sudah pernah dibuat sebelumnya agar idempotent
  // (termasuk baris turunan Better Auth agar tidak ada jejak lama).
  await sql`DELETE FROM "session" WHERE "userId" IN (SELECT id FROM users WHERE lower(email) = ${newUser.email.toLowerCase()})`;
  await sql`DELETE FROM "account" WHERE "userId" IN (SELECT id FROM users WHERE lower(email) = ${newUser.email.toLowerCase()})`;
  await sql`DELETE FROM users WHERE lower(email) = ${newUser.email.toLowerCase()}`;

  const result = await sql`
    INSERT INTO users (id, name, email, role, password_hash, created_at)
    VALUES (${id}, ${newUser.name}, ${newUser.email}, ${newUser.role}, ${passwordHash}, ${new Date().toISOString().split('T')[0]})
    RETURNING id, name, email, role, created_at
  `;

  // Credential Better Auth: hash disalin ke tabel account agar bisa login
  // (selaras dengan POST /api/users).
  await sql`
    INSERT INTO "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt")
    VALUES (${'acct-' + randomBytes(12).toString('hex')}, ${id}, 'credential', ${id}, ${passwordHash}, now(), now())
  `;

  console.log('SUCCESS:');
  console.log(JSON.stringify(result[0], null, 2));
  console.log(`✓ Pengguna dibuat dengan password dari CMS_SEED_PASSWORD (tidak dicetak).`);
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
