import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function check() {
  const programs = await sql`SELECT id, slug, title, category FROM programs ORDER BY order_index ASC`;
  console.log("=== PROGRAMS ===");
  console.log(JSON.stringify(programs, null, 2));

  const articles = await sql`SELECT id, slug, title, category FROM articles ORDER BY published_date DESC`;
  console.log("=== ARTICLES ===");
  console.log(JSON.stringify(articles, null, 2));
}

check().catch(console.error);
