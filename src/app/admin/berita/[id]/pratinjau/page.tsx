import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RenderDoc } from "@/components/news/render-doc";
import { getArticleById, getAttachments } from "@/lib/news/service";
import { formatDateIndonesian } from "@/lib/utils";
import { NEWS_STATUS_LABEL } from "@/lib/news/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * Pratinjau artikel sebelum/di luar publikasi — hanya untuk staff
 * (sesi diproteksi proxy /admin). Status apa pun dapat dilihat.
 */
export default async function AdminBeritaPreviewPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const attachments = await getAttachments(id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-3">
          <Badge variant={article.status === "published" ? "default" : "secondary"}>
            <Eye className="size-3" aria-hidden="true" />
            Pratinjau — {NEWS_STATUS_LABEL[article.status]}
          </Badge>
          {article.status !== "published" ? (
            <span className="text-xs text-muted-foreground">
              Belum tampil di halaman publik.
            </span>
          ) : null}
        </div>
        <Link
          href={`/admin/berita/${article.id}/edit`}
          className="inline-flex h-8 items-center gap-2 rounded-md border border-input bg-card px-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke Editor
        </Link>
      </div>

      <article className="rounded-lg border border-border bg-card p-5 sm:p-8">
        <header className="space-y-3">
          {article.category ? (
            <span className="inline-block rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              {article.category}
            </span>
          ) : null}
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
            {article.publishedDate ? (
              <span>{formatDateIndonesian(article.publishedDate)}</span>
            ) : null}
            {article.author ? <span>{article.author}</span> : null}
            {article.readTime ? <span>{article.readTime}</span> : null}
          </div>
        </header>

        {article.excerpt ? (
          <blockquote className="mt-6 border-l-2 border-primary/40 pl-4 text-base leading-relaxed text-muted-foreground">
            {article.excerpt}
          </blockquote>
        ) : null}

        {article.coverImage ? (
          <figure className="mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="aspect-video w-full rounded-md border border-border object-cover"
            />
          </figure>
        ) : null}

        <div className="space-y-4 pt-6 text-sm text-foreground">
          {article.contentDoc ? (
            <RenderDoc doc={article.contentDoc} />
          ) : article.content ? (
            <div className="whitespace-pre-line">{article.content}</div>
          ) : (
            <p className="text-muted-foreground">Isi artikel masih kosong.</p>
          )}
        </div>

        {attachments.length > 0 ? (
          <section className="mt-8 rounded-md border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Lampiran</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {attachments.map((file) => (
                <li key={file.id} className="flex items-center gap-2">
                  <span className="truncate">{file.fileName}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </div>
  );
}
