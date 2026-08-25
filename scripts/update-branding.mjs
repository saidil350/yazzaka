import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  "postgresql://neondb_owner:npg_DliS6bq9BNpd@ep-round-surf-az1urxre-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function run() {
  console.log("Updating school_profile in Neon Database...");
  
  const branding = {
    primaryColor: "#0F2B48",
    accentColor: "#FA6400",
    secondaryColor: "#F4F6F8",
    logoUrl: "/yazzakka.png",
    faviconUrl: "/yazzakka.png"
  };

  await sql`
    UPDATE school_profile 
    SET 
      name = 'Yayasan Yazzakka Aceh',
      branding = ${JSON.stringify(branding)}::jsonb,
      updated_at = NOW()
  `;

  const rows = await sql`SELECT id, name, branding FROM school_profile`;
  console.log("Updated rows:", rows);
  console.log("✓ Berhasil memperbarui data branding di database!");
}

run().catch((err) => {
  console.error("Error updating database:", err);
  process.exit(1);
});
