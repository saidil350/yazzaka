import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function check() {
  const [profile] = await sql`SELECT * FROM school_profile LIMIT 1`;
  console.log("=== PROFILE ===");
  console.log(JSON.stringify(profile, null, 2));
}

check().catch(console.error);
