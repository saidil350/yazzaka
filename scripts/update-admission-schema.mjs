import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function run() {
  console.log("Migrating admission_info table...");
  
  await sql`
    ALTER TABLE admission_info 
    ADD COLUMN IF NOT EXISTS start_date TEXT DEFAULT '2026-09-01',
    ADD COLUMN IF NOT EXISTS end_date TEXT DEFAULT '2026-11-30',
    ADD COLUMN IF NOT EXISTS hide_form_when_closed BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS closed_message TEXT DEFAULT 'Pendaftaran santri baru untuk periode ini sedang ditutup. Untuk informasi jadwal gelombang berikutnya atau konsultasi langsung, silakan hubungi sekretariat PPDB kami melalui WhatsApp.';
  `;
  
  const [data] = await sql`SELECT id, period_name, is_open, start_date, end_date, hide_form_when_closed FROM admission_info LIMIT 1`;
  console.log("Updated admission_info row:", data);
}

run().catch(console.error);
