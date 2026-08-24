import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapSettings } from "../school-data/route";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM website_settings LIMIT 1`;
    if (result.length === 0) return NextResponse.json(null);
    return NextResponse.json(mapSettings(result[0]));
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Gagal mengambil pengaturan website" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    
    const socialJson = body.socialMedia ? JSON.stringify(body.socialMedia) : undefined;
    const navJson = body.navigation ? JSON.stringify(body.navigation) : undefined;

    const result = await sql`
      UPDATE website_settings
      SET 
        site_title = COALESCE(${body.siteTitle ?? null}, site_title),
        meta_description = COALESCE(${body.metaDescription ?? null}, meta_description),
        keywords = COALESCE(${body.keywords ?? null}, keywords),
        og_image = COALESCE(${body.ogImage ?? null}, og_image),
        google_verification = COALESCE(${body.googleVerification ?? null}, google_verification),
        social_media = COALESCE(${socialJson ? sql`${socialJson}::jsonb` : null}, social_media),
        navigation = COALESCE(${navJson ? sql`${navJson}::jsonb` : null}, navigation),
        updated_at = NOW()
      WHERE id = 'settings-yazzaka'
      RETURNING *
    `;

    return NextResponse.json(mapSettings(result[0]));
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Gagal memperbarui pengaturan website" }, { status: 500 });
  }
}
