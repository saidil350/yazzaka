import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapMessage } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC`;
    return NextResponse.json(result.map(mapMessage));
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Gagal mengambil pesan kontak" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("msg");
    const submittedAt = new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const result = await sql`
      INSERT INTO contact_messages (
        id, name, email, phone, subject, message, submitted_at, status
      ) VALUES (
        ${id}, ${body.name}, ${body.email}, ${body.phone}, ${body.subject}, 
        ${body.message}, ${submittedAt}, ${body.status ?? 'new'}
      )
      RETURNING *
    `;

    return NextResponse.json(mapMessage(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Gagal menambahkan pesan" }, { status: 500 });
  }
}
