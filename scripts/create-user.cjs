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
  const sql = neon(process.env.DATABASE_URL);
  
  const newUser = {
    name: 'Admin Yazzaka',
    email: 'admin.baru@yazzakka.sch.id',
    role: 'super_admin',
    password: 'Yazzakka@2026!'
  };

  const id = `usr-${Date.now()}-${randomBytes(3).toString('hex')}`;
  const passwordHash = hashPassword(newUser.password);

  // Hapus jika sudah pernah dibuat sebelumnya agar idempotent
  await sql`DELETE FROM users WHERE lower(email) = ${newUser.email.toLowerCase()}`;

  const result = await sql`
    INSERT INTO users (id, name, email, role, password_hash, created_at)
    VALUES (${id}, ${newUser.name}, ${newUser.email}, ${newUser.role}, ${passwordHash}, ${new Date().toISOString().split('T')[0]})
    RETURNING id, name, email, role, created_at
  `;

  console.log('SUCCESS:');
  console.log(JSON.stringify({ ...result[0], plainPassword: newUser.password }, null, 2));
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
