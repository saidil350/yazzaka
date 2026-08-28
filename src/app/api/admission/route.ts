import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapAdmission } from "../school-data/route";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM admission_info LIMIT 1`;
    if (result.length === 0) return NextResponse.json(null);
    return NextResponse.json(mapAdmission(result[0]));
  } catch (error) {
    console.error("GET /api/admission error:", error);
    return NextResponse.json({ error: "Gagal mengambil info pendaftaran" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    
    const timelineJson = Array.isArray(body.timeline) ? JSON.stringify(body.timeline) : undefined;
    const reqsJson = Array.isArray(body.requirements) ? JSON.stringify(body.requirements) : undefined;
    const feesJson = Array.isArray(body.fees) ? JSON.stringify(body.fees) : undefined;
    const faqsJson = Array.isArray(body.faqs) ? JSON.stringify(body.faqs) : undefined;

    const result = await sql`
      UPDATE admission_info
      SET 
        period_name = COALESCE(${body.periodName ?? null}, period_name),
        academic_year = COALESCE(${body.academicYear ?? null}, academic_year),
        is_open = COALESCE(${body.isOpen !== undefined ? body.isOpen : null}, is_open),
        start_date = COALESCE(${body.startDate !== undefined ? body.startDate : null}, start_date),
        end_date = COALESCE(${body.endDate !== undefined ? body.endDate : null}, end_date),
        hide_form_when_closed = COALESCE(${body.hideFormWhenClosed !== undefined ? body.hideFormWhenClosed : null}, hide_form_when_closed),
        closed_message = COALESCE(${body.closedMessage !== undefined ? body.closedMessage : null}, closed_message),
        registration_url = COALESCE(${body.registrationUrl ?? null}, registration_url),
        consultation_whatsapp = COALESCE(${body.consultationWhatsapp ?? null}, consultation_whatsapp),
        timeline = COALESCE(${timelineJson ? sql`${timelineJson}::jsonb` : null}, timeline),
        requirements = COALESCE(${reqsJson ? sql`${reqsJson}::jsonb` : null}, requirements),
        fees = COALESCE(${feesJson ? sql`${feesJson}::jsonb` : null}, fees),
        faqs = COALESCE(${faqsJson ? sql`${faqsJson}::jsonb` : null}, faqs),
        updated_at = NOW()
      WHERE id = 'admission-yazzaka'
      RETURNING *
    `;

    return NextResponse.json(mapAdmission(result[0]));
  } catch (error) {
    console.error("PUT /api/admission error:", error);
    return NextResponse.json({ error: "Gagal memperbarui info pendaftaran" }, { status: 500 });
  }
}
