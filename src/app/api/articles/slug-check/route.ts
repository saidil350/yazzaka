import { NextResponse } from "next/server";
import { checkSlugAvailable } from "@/lib/news/service";
import {
  parseOrThrow,
  requireUser,
  toErrorResponse,
} from "@/lib/news/api-helpers";
import { slugCheckSchema } from "@/lib/news/schemas";

/** GET /api/articles/slug-check?slug=...&excludeId=... — cek keunikan slug. */
export async function GET(request: Request) {
  try {
    await requireUser(request);
    const url = new URL(request.url);
    const { slug, excludeId } = parseOrThrow(slugCheckSchema, {
      slug: url.searchParams.get("slug") ?? "",
      excludeId: url.searchParams.get("excludeId") ?? undefined,
    });
    const result = await checkSlugAvailable(slug, excludeId);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, "Gagal memeriksa slug");
  }
}
