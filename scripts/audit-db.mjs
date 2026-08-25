import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(DATABASE_URL);

async function runAudit() {
  console.log("=== AUDIT DATABASE NEON ===");
  
  const results = await Promise.all([
    sql`SELECT count(*) as c FROM school_profile`,
    sql`SELECT count(*) as c FROM programs`,
    sql`SELECT count(*) as c FROM facilities`,
    sql`SELECT count(*) as c FROM achievements`,
    sql`SELECT count(*) as c FROM articles`,
    sql`SELECT count(*) as c FROM events`,
    sql`SELECT count(*) as c FROM testimonials`,
    sql`SELECT count(*) as c FROM admission_info`,
    sql`SELECT count(*) as c FROM contact_messages`,
    sql`SELECT count(*) as c FROM website_settings`,
    sql`SELECT count(*) as c FROM organization_members`,
    sql`SELECT count(*) as c FROM users`,
    sql`SELECT count(*) as c FROM page_sections`,
    sql`SELECT count(*) as c FROM media_items`,
  ]);

  const names = [
    "school_profile", "programs", "facilities", "achievements",
    "articles", "events", "testimonials", "admission_info",
    "contact_messages", "website_settings", "organization_members",
    "users", "page_sections", "media_items"
  ];

  names.forEach((name, i) => {
    console.log(`- ${name.padEnd(22)} : ${results[i][0].c} data baris`);
  });
}

runAudit().catch(console.error);
