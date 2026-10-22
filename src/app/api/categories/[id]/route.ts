import { NextResponse } from "next/server";
import { deleteCategory, updateCategory } from "@/lib/news/service";
import {
  parseOrThrow,
  requireSuperAdmin,
  requireUser,
  toErrorResponse,
} from "@/lib/news/api-helpers";
import { categoryPayloadSchema } from "@/lib/news/schemas";

type RouteContext = { params: Promise<{ id: string }> };

/** PUT /api/categories/[id] — hanya super_admin. */
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    requireSuperAdmin(user);
    const id = (await params).id;
    const body = await request.json();
    const { name } = parseOrThrow(categoryPayloadSchema, body);
    const category = await updateCategory(id, name);
    return NextResponse.json(category);
  } catch (error) {
    return toErrorResponse(error, "Gagal memperbarui kategori");
  }
}

/** DELETE /api/categories/[id] — ditolak bila masih dipakai artikel. */
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    requireSuperAdmin(user);
    const id = (await params).id;
    await deleteCategory(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return toErrorResponse(error, "Gagal menghapus kategori");
  }
}
