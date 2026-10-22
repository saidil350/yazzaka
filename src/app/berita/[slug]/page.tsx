import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  User,
} from "lucide-react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { RenderDoc } from "@/components/news/render-doc";
import { getArticleBySlug, getAttachments } from "@/lib/news/service";
import { getSchoolProfile } from "@/lib/school-profile";
import { formatDateIndonesian } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const [article, profile] = await Promise.all([
    getArticleBySlug(slug),
    getSchoolProfile(),
  ]);

  if (!article || article.status !== "published") {
    return { title: "Berita tidak ditemukan" };
  }

  const schoolName = profile?.name || "Yazzaka";
  const title = article.seoTitle || article.title;
  const description =
    article.seoDescription ||
    article.excerpt ||
    (article.content ? article.content.slice(0, 160) : `Berita terbaru dari ${schoolName}.`);

  return {
    title,
    description,
    alternates: { canonical: `/berita/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      url: `/berita/${article.slug}`,
      images: article.coverImage ? [{ url: article.coverImage, alt: article.title }] : undefined,
    },
    twitter: {
      card: article.coverImage ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function BeritaDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  const attachments = await getAttachments(article.id);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Berita
          </Link>

          <header className="space-y-4 pt-6">
            {article.category ? (
              <span className="inline-block rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                {article.category}
              </span>
            ) : null}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" aria-hidden="true" />
                {formatDateIndonesian(article.publishedDate)}
              </span>
              {article.author ? (
                <span className="flex items-center gap-1">
                  <User className="size-3" aria-hidden="true" />
                  {article.author}
                </span>
              ) : null}
              {article.readTime ? (
                <span className="flex items-center gap-1">
                  <Clock className="size-3" aria-hidden="true" />
                  {article.readTime}
                </span>
              ) : null}
            </div>
          </header>

          {article.excerpt ? (
            <blockquote className="mt-6 border-l-2 border-primary/40 pl-4 text-base leading-relaxed text-muted-foreground">
              {article.excerpt}
            </blockquote>
          ) : null}

          {article.coverImage ? (
            <figure className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImage}
                alt={article.title}
                className="aspect-video w-full rounded-lg border border-border object-cover"
              />
            </figure>
          ) : null}

          <div className="space-y-4 pt-8 text-sm text-foreground">
            {article.contentDoc ? (
              <RenderDoc doc={article.contentDoc} />
            ) : article.content ? (
              <div className="whitespace-pre-line">{article.content}</div>
            ) : null}
          </div>

          {attachments.length > 0 ? (
            <section className="mt-10 rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground">
                Lampiran Dokumen
              </h2>
              <ul className="mt-3 space-y-2">
                {attachments.map((file) => (
                  <li key={file.id}>
                    <a
                      href={file.fileUrl}
                      className="flex items-center gap-3 rounded-md border border-border bg-background p-3 text-sm transition-colors hover:bg-muted"
                      {...(/^https?:/i.test(file.fileUrl)
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                        {file.fileName}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {file.sizeBytes
                          ? `${(file.sizeBytes / (1024 * 1024)).toFixed(1)} MB`
                          : ""}
                      </span>
                      <Download className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </main>
      <Footer />
    </div>
  );
}
