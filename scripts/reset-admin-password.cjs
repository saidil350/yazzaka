// Cek status password users dan reset password admin jika perlu
const { neon } = require('@neondatabase/serverless');
const { scryptSync, randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

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
  
  const rows = await sql`
    SELECT id, email, role,
      CASE WHEN password_hash IS NULL THEN 'NULL'
           WHEN password_hash = '' THEN 'EMPTY'
           ELSE 'SET' END as pass_status
    FROM users
  `;
  
  console.log('\n=== STATUS PASSWORD USERS ===');
  console.log(JSON.stringify(rows, null, 2));
  
  // Set/reset password untuk semua super_admin yang belum punya password
  const newPassword = 'Admin@Yazzakka2024!';
  
  for (const row of rows) {
    if (row.pass_status === 'NULL' || row.pass_status === 'EMPTY') {
      const hash = hashPassword(newPassword);
      await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${row.id}`;
      console.log(`\n✅ Password di-set untuk: ${row.email}`);
    }
  }
  
  // Juga set password untuk super_admin yang sudah punya hash (reset ke password baru)
  const superAdmin = rows.find(r => r.role === 'super_admin');
  if (superAdmin) {
    const hash = hashPassword(newPassword);
    await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${superAdmin.id}`;
    console.log(`\n🔑 Password super_admin di-reset ke: ${newPassword}`);
    console.log(`   Email  : ${superAdmin.email}`);
    console.log(`   Password: ${newPassword}`);
  }
}

main().catch(console.error);
