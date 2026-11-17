import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { generateId } from "@/lib/utils";

// Pagar anti-abuse form kontak publik (audit OWASP A04):
// - batas panjang per kolom (input di-trim; server tidak percaya client)
// - honeypot `website` (terisi = bot → sukses palsu tanpa menyimpan)
// - rate limit per-IP via DB: maks 5 pesan per 10 menit (lintas instansi
//   Vercel, tidak bisa di-reset dengan cold start seperti memory Map)
const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  subject: 150,
  message: 2000,
} as const;

const RATE_WINDOW_MINUTES = 10;
const RATE_MAX_PER_WINDOW = 5;

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: bot yang mengisi semua field termasuk yang tersembunyi
    // mendapat respons sukses agar tidak mencoba lagi — tanpa menyimpan.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "Pesan Anda telah berhasil disimpan dan diterima oleh sekretariat.",
        id: generateId("msg"),
      });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const subject =
      typeof body.subject === "string" && body.subject.trim()
        ? body.subject.trim()
        : "Pesan Web";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Nama, nomor telepon, dan pesan wajib diisi." },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }
    for (const [field, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
      const value = { name, email, phone, subject, message }[field];
      if (value.length > max) {
        return NextResponse.json(
          { error: `Kolom ${field} maksimal ${max} karakter.` },
          { status: 400 }
        );
      }
    }

    const ip = clientIp(request);
    const db = getDb();

    // Jangan telan kegagalan DB: form publik hanya boleh melapor sukses
    // bila pesan benar-benar tersimpan (getDb() throw → 500 di catch bawah).
    if (ip) {
      const recent = await db`
        SELECT count(*)::int AS n FROM contact_messages
        WHERE ip_address = ${ip}
          AND created_at > now() - (${RATE_WINDOW_MINUTES} * interval '1 minute')
      `;
      if (Number(recent[0]?.n ?? 0) >= RATE_MAX_PER_WINDOW) {
        return NextResponse.json(
          { error: "Terlalu banyak pesan dari perangkat ini. Silakan coba lagi nanti." },
          { status: 429 }
        );
      }
    }

    const id = generateId("msg");
    const submittedAt = new Date().toISOString();

    await db`
      INSERT INTO contact_messages (id, name, email, phone, subject, message, submitted_at, status, ip_address)
      VALUES (${id}, ${name}, ${email || null}, ${phone}, ${subject}, ${message}, ${submittedAt}, 'new', ${ip})
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
