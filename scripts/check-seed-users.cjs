// Script: Cek & seed user super_admin ke Neon DB
// Jalankan: node scripts/check-seed-users.cjs
const { neon } = require('@neondatabase/serverless');
const { scryptSync, randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

// Baca .env.local manual
const envPath = path.join(__dirname, '..', '.env.local');
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
  const sql = neon(process.env.DATABASE_URL);
  
  // Cek users yang ada
  const existing = await sql`SELECT id, name, email, role, created_at FROM users ORDER BY created_at ASC`;
  console.log('\n=== USERS DI DATABASE ===');
  console.log(JSON.stringify(existing, null, 2));
  console.log(`\nTotal: ${existing.length} pengguna`);
  
  if (existing.length === 0) {
    console.log('\n⚠️  Tidak ada pengguna. Membuat super_admin pertama...');
    const id = `usr-seed-${Date.now()}`;
    const passwordHash = hashPassword('Admin@Yazzakka2024!');
    const result = await sql`
      INSERT INTO users (id, name, email, role, password_hash)
      VALUES (${id}, 'Super Admin', 'admin@yazzakka.id', 'super_admin', ${passwordHash})
      RETURNING id, name, email, role, created_at
    `;
    console.log('\n✅ Pengguna seeder berhasil dibuat:');
    console.log(JSON.stringify(result[0], null, 2));
    console.log('\n📋 Kredensial login:');
    console.log('   Email   : admin@yazzakka.id');
    console.log('   Password: Admin@Yazzakka2024!');
  } else {
    console.log('\n✅ Database sudah memiliki pengguna. Tidak perlu seed.');
  }
}

main().catch(console.error);
