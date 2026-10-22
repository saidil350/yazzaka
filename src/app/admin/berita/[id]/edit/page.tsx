"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { NewsEditorForm } from "@/components/admin/news/news-editor-form";
import type { Article, NewsMedia } from "@/lib/news/types";

export default function AdminBeritaEditPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [article, setArticle] = React.useState<Article | null>(null);
  const [attachments, setAttachments] = React.useState<NewsMedia[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("gagal memuat");
        const data = (await res.json()) as {
          article: Article;
          attachments: NewsMedia[];
        };
        setArticle(data.article);
        setAttachments(data.attachments);
      } catch {
        toast("Gagal memuat berita.", "error");
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, toast]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Kembali ke Daftar Berita
        </Link>
        <h1 className="pt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Edit Berita
        </h1>
        {article ? (
          <p className="mt-1 truncate text-sm text-muted-foreground" title={article.title}>
            {article.title}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="space-y-3 p-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-32 w-full" />
            </Card>
          ))}
        </div>
      ) : notFound || !article ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Berita tidak ditemukan atau telah dihapus.
        </Card>
      ) : (
        <NewsEditorForm
          key={article.id}
          mode="edit"
          article={article}
          initialAttachments={attachments}
        />
      )}
    </div>
  );
}
