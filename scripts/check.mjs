import { neon } from "@neondatabase/serverless";

const sql = neon('postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

async function check() {
  const [profile] = await sql`SELECT name FROM school_profile`;
  const [{ count: programCount }] = await sql`SELECT count(*) FROM programs`;
  const [{ count: facilityCount }] = await sql`SELECT count(*) FROM facilities`;
  const [{ count: articleCount }] = await sql`SELECT count(*) FROM articles`;
  
  console.log('--- BUKTI DATA DI DATABASE NEON ---');
  console.log('Nama Sekolah:', profile.name);
  console.log('Jumlah Program:', programCount);
  console.log('Jumlah Fasilitas:', facilityCount);
  console.log('Jumlah Artikel:', articleCount);
}
check();
