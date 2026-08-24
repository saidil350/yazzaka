import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapArticle } from "../school-data/route";
import { generateId } from "@/lib/utils";

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`SELECT * FROM articles ORDER BY published_date DESC`;
    return NextResponse.json(result.map(mapArticle));
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ error: "Gagal mengambil artikel" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sql = getDb();
    const id = generateId("art");
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const result = await sql`
      INSERT INTO articles (
        id, slug, title, excerpt, content, cover_image, category, tags, author, 
        author_role, published_date, read_time, status, featured, seo_title, seo_description
      ) VALUES (
        ${id}, ${slug}, ${body.title}, ${body.excerpt}, ${body.content}, ${body.coverImage}, 
        ${body.category}, ${JSON.stringify(body.tags ?? [])}::jsonb, ${body.author}, 
        ${body.authorRole}, ${body.publishedDate}, ${body.readTime}, ${body.status ?? 'published'}, 
        ${body.featured ?? false}, ${body.seoTitle}, ${body.seoDescription}
      )
      RETURNING *
    `;

    return NextResponse.json(mapArticle(result[0]), { status: 201 });
  } catch (error) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json({ error: "Gagal menambahkan artikel" }, { status: 500 });
  }
}
