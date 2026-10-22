import { NextResponse } from "next/server";
import {
  deleteArticle,
  getArticleById,
  getAttachments,
  updateArticle,
} from "@/lib/news/service";
import {
  parseOrThrow,
  revalidateNews,
  requireUser,
  toErrorResponse,
} from "@/lib/news/api-helpers";
import { articlePayloadSchema } from "@/lib/news/schemas";

type RouteContext = { params: Promise<{ id: string }> };

/** GET /api/articles/[id] — detail lengkap (staff, semua status). */
export async function GET(request: Request, { params }: RouteContext) {
  try {
    await requireUser(request);
    const id = (await params).id;

    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }
    const attachments = await getAttachments(id);
    return NextResponse.json({ article, attachments });
  } catch (error) {
    return toErrorResponse(error, "Gagal mengambil berita");
  }
}

/** PUT /api/articles/[id] — simpan seluruh perubahan (author/super_admin). */
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    const id = (await params).id;
    const body = await request.json();
    const payload = parseOrThrow(articlePayloadSchema, body);

    const previous = await getArticleById(id);
    const article = await updateArticle(id, payload, user);

    revalidateNews(article.slug);
    if (previous && previous.slug !== article.slug) {
      revalidateNews(previous.slug);
    }
    return NextResponse.json(article);
  } catch (error) {
    return toErrorResponse(error, "Gagal memperbarui berita");
  }
}

/** DELETE /api/articles/[id] — super_admin bebas, editor hanya draft miliknya. */
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    const id = (await params).id;

    const existing = await getArticleById(id);
    await deleteArticle(id, user);
    if (existing) revalidateNews(existing.slug);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return toErrorResponse(error, "Gagal menghapus berita");
  }
}
