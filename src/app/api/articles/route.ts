import { NextResponse } from "next/server";
import {
  createArticle,
  listArticles,
} from "@/lib/news/service";
import {
  parseOrThrow,
  revalidateNews,
  requireUser,
  toErrorResponse,
} from "@/lib/news/api-helpers";
import { articlePayloadSchema } from "@/lib/news/schemas";
import type { NewsStatus } from "@/lib/news/types";

const VALID_STATUS: NewsStatus[] = [
  "draft",
  "pending_review",
  "published",
  "archived",
];

/**
 * GET /api/articles?q=&category=&status=&page=&pageSize=&scope=
 * scope "public" (default): hanya artikel terbit, tanpa sesi.
 * scope "admin": seluruh status, wajib sesi staff.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const scope = url.searchParams.get("scope") === "admin" ? "admin" : "public";

    if (scope === "admin") {
      await requireUser(request);
    }

    const statusParam = url.searchParams.get("status");
    const status: NewsStatus[] | undefined = statusParam
      ? statusParam
          .split(",")
          .map((s) => s.trim())
          .filter((s): s is NewsStatus =>
            VALID_STATUS.includes(s as NewsStatus)
          )
      : scope === "public"
        ? ["published"]
        : undefined;

    const result = await listArticles({
      status,
      categorySlug: url.searchParams.get("category") || null,
      q: url.searchParams.get("q") || null,
      page: Number(url.searchParams.get("page") ?? "1") || 1,
      pageSize: Number(url.searchParams.get("pageSize") ?? "9") || 9,
    });

    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, "Gagal mengambil daftar berita");
  }
}

/** POST /api/articles — buat berita baru (editor & super_admin). */
export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const payload = parseOrThrow(articlePayloadSchema, body);

    const article = await createArticle(payload, user);
    if (article.status === "published") {
      revalidateNews(article.slug);
    }
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, "Gagal membuat berita");
  }
}
