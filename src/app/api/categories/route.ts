import { NextResponse } from "next/server";
import { createCategory, listCategories } from "@/lib/news/service";
import {
  parseOrThrow,
  requireSuperAdmin,
  requireUser,
  toErrorResponse,
} from "@/lib/news/api-helpers";
import { categoryPayloadSchema } from "@/lib/news/schemas";

/** GET /api/categories — publik (untuk filter halaman berita). */
export async function GET() {
  try {
    const categories = await listCategories();
    return NextResponse.json({ items: categories });
  } catch (error) {
    return toErrorResponse(error, "Gagal mengambil kategori");
  }
}

/** POST /api/categories — hanya super_admin. */
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    requireSuperAdmin(user);
    const body = await request.json();
    const { name } = parseOrThrow(categoryPayloadSchema, body);
    const category = await createCategory(name);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, "Gagal membuat kategori");
  }
}
