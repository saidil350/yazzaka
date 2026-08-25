import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function run() {
  console.log("Updating page_sections in Neon Database...");
  
  // Set is_enabled to false for facilities
  await sql`
    UPDATE page_sections 
    SET is_enabled = false 
    WHERE key = 'facilities' OR id = 'sec-facilities' OR id = 'sec-6';
  `;

  // Remove news and events sections if exists
  await sql`
    DELETE FROM page_sections 
    WHERE key IN ('news', 'events') OR id IN ('sec-news', 'sec-events', 'sec-8', 'sec-9');
  `;

  const rows = await sql`SELECT id, key, title, is_enabled, order_index FROM page_sections ORDER BY order_index ASC`;
  console.log("Current page_sections in DB:", rows);
  console.log("✓ Berhasil memperbarui page_sections di database!");
}

run().catch((err) => {
  console.error("Error updating database:", err);
  process.exit(1);
});
