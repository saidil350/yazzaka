import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Nama, nomor telepon, dan pesan wajib diisi." },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = generateId("msg");
    const submittedAt = new Date().toISOString();

    // Jangan telan kegagalan DB: form publik hanya boleh melapor sukses
    // bila pesan benar-benar tersimpan (getDb() throw → 500 di catch bawah).
    await db`
      INSERT INTO contact_messages (id, name, email, phone, subject, message, submitted_at, status)
      VALUES (${id}, ${name}, ${email || null}, ${phone}, ${subject || "Pesan Web"}, ${message}, ${submittedAt}, 'new')
    `;

    return NextResponse.json({
      success: true,
      message: "Pesan Anda telah berhasil disimpan dan diterima oleh sekretariat.",
      id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses pesan kontak." },
      { status: 500 }
    );
  }
}
