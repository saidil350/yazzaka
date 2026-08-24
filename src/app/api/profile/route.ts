import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapProfile } from "../school-data/route";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM school_profile LIMIT 1`;
    if (result.length === 0) return NextResponse.json(null);
    return NextResponse.json(mapProfile(result[0]));
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Gagal mengambil profil sekolah" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    
    // Convert from camelCase to snake_case for DB update
    const result = await sql`
      UPDATE school_profile
      SET 
        name = COALESCE(${body.name ?? null}, name),
        tagline = COALESCE(${body.tagline ?? null}, tagline),
        description = COALESCE(${body.description ?? null}, description),
        npsn = COALESCE(${body.npsn ?? null}, npsn),
        accreditation = COALESCE(${body.accreditation ?? null}, accreditation),
        established_year = COALESCE(${body.establishedYear ?? null}, established_year),
        student_count = COALESCE(${body.studentCount ?? null}, student_count),
        teacher_count = COALESCE(${body.teacherCount ?? null}, teacher_count),
        alumni_count = COALESCE(${body.alumniCount ?? null}, alumni_count),
        hafiz_count = COALESCE(${body.hafizCount ?? null}, hafiz_count),
        address = COALESCE(${body.address ?? null}, address),
        city = COALESCE(${body.city ?? null}, city),
        province = COALESCE(${body.province ?? null}, province),
        phone = COALESCE(${body.phone ?? null}, phone),
        email = COALESCE(${body.email ?? null}, email),
        whatsapp = COALESCE(${body.whatsapp ?? null}, whatsapp),
        maps_embed_url = COALESCE(${body.mapsEmbedUrl ?? null}, maps_embed_url),
        vision = COALESCE(${body.vision ?? null}, vision),
        updated_at = NOW()
      WHERE id = 'profile-yazzaka'
      RETURNING *
    `;

    // Handle JSON fields specifically if provided (to avoid object mapping issues)
    if (body.principal) {
      await sql`
        UPDATE school_profile SET 
          principal_name = COALESCE(${body.principal.name ?? null}, principal_name),
          principal_title = COALESCE(${body.principal.title ?? null}, principal_title),
          principal_photo_url = COALESCE(${body.principal.photoUrl ?? null}, principal_photo_url),
          principal_welcome_message = COALESCE(${body.principal.welcomeMessage ?? null}, principal_welcome_message),
          principal_signature_url = COALESCE(${body.principal.signatureUrl ?? null}, principal_signature_url)
        WHERE id = 'profile-yazzaka'
      `;
    }
    
    if (body.mission) await sql`UPDATE school_profile SET mission = ${JSON.stringify(body.mission)}::jsonb WHERE id = 'profile-yazzaka'`;
    if (body.values) await sql`UPDATE school_profile SET values = ${JSON.stringify(body.values)}::jsonb WHERE id = 'profile-yazzaka'`;
    if (body.branding) await sql`UPDATE school_profile SET branding = ${JSON.stringify(body.branding)}::jsonb WHERE id = 'profile-yazzaka'`;

    // Re-fetch to get complete updated row
    const finalResult = await sql`SELECT * FROM school_profile WHERE id = 'profile-yazzaka' LIMIT 1`;
    
    return NextResponse.json(mapProfile(finalResult[0]));
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil sekolah" }, { status: 500 });
  }
}
