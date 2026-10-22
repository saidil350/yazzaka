import { NextResponse } from "next/server";
import { transitionArticle } from "@/lib/news/service";
import {
  parseOrThrow,
  revalidateNews,
  requireUser,
  toErrorResponse,
} from "@/lib/news/api-helpers";
import { transitionSchema } from "@/lib/news/schemas";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/articles/[id]/transition
 * body: { action: "submit" | "publish" | "archive" | "revert_to_draft" }
 * submit / revert_to_draft: penulis atau super_admin;
 * publish / archive: hanya super_admin (divalidasi di service).
 */
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const user = await requireUser(request);
    const id = (await params).id;
    const body = await request.json();
    const { action } = parseOrThrow(transitionSchema, body);

    const article = await transitionArticle(id, action, user);
    revalidateNews(article.slug);
    return NextResponse.json(article);
  } catch (error) {
    return toErrorResponse(error, "Gagal mengubah status berita");
  }
}
