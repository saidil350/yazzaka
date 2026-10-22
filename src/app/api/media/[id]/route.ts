import { NextResponse } from "next/server";
import { deleteNewsMedia } from "@/lib/news/service";
import { requireUser, toErrorResponse } from "@/lib/news/api-helpers";

/**
 * DELETE /api/media/[id] — hapus berkas dari library.
 * Ditolak (409) bila masih dipakai artikel (sampul, inline, atau lampiran).
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser(request);
    const id = (await params).id;
    await deleteNewsMedia(id, user);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return toErrorResponse(error, "Gagal menghapus media");
  }
}
