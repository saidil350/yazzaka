import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/neon";
import { mapArticle } from "../../school-data/route";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const sql = getDb();

    const tagsJson = Array.isArray(body.tags) ? JSON.stringify(body.tags) : undefined;

    const result = await sql`
      UPDATE articles
      SET 
        title = COALESCE(${body.title ?? null}, title),
        excerpt = COALESCE(${body.excerpt ?? null}, excerpt),
        content = COALESCE(${body.content ?? null}, content),
        cover_image = COALESCE(${body.coverImage ?? null}, cover_image),
        category = COALESCE(${body.category ?? null}, category),
        tags = COALESCE(${tagsJson ? sql`${tagsJson}::jsonb` : null}, tags),
        author = COALESCE(${body.author ?? null}, author),
        author_role = COALESCE(${body.authorRole ?? null}, author_role),
        published_date = COALESCE(${body.publishedDate ?? null}, published_date),
        read_time = COALESCE(${body.readTime ?? null}, read_time),
        status = COALESCE(${body.status ?? null}, status),
        featured = COALESCE(${body.featured ?? null}, featured),
        seo_title = COALESCE(${body.seoTitle ?? null}, seo_title),
        seo_description = COALESCE(${body.seoDescription ?? null}, seo_description),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(mapArticle(result[0]));
  } catch (error) {
    console.error(`PUT /api/articles/[id] error:`, error);
    return NextResponse.json({ error: "Gagal memperbarui artikel" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const sql = getDb();
    
    const result = await sql`DELETE FROM articles WHERE id = ${id} RETURNING id`;
    
    if (result.length === 0) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error(`DELETE /api/articles/[id] error:`, error);
    return NextResponse.json({ error: "Gagal menghapus artikel" }, { status: 500 });
  }
}
