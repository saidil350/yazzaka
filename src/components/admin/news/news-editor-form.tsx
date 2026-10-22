"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  FileText,
  Loader2,
  Paperclip,
  Send,
  UploadCloud,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import { TiptapEditor } from "./tiptap-editor";
import { MediaPickerModal } from "./media-picker-modal";
import { CategoryManagerModal } from "./category-manager-modal";
import { docHasContent } from "@/lib/news/schemas";
import type { Article, NewsCategory, NewsMedia, NewsStatus } from "@/lib/news/types";
import { NEWS_STATUS_LABEL } from "@/lib/news/types";

/**
 * Form pembuatan & penyuntingan berita. Field opsional (ringkasan,
 * kategori, sampul, lampiran) dikirim sebagai null/[] bila kosong —
 * artikel tetap valid tanpa semuanya.
 */

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function NewsEditorForm({
  mode,
  article,
  initialAttachments = [],
}: {
  mode: "create" | "edit";
  article?: Article;
  initialAttachments?: NewsMedia[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { role } = useAuth();
  const isSuperAdmin = role === "super_admin";

  const [title, setTitle] = React.useState(article?.title ?? "");
  // Slug manual: null = otomatis dari judul. Mode edit mempertahankan slug existing.
  const [manualSlug, setManualSlug] = React.useState<string | null>(
    mode === "edit" ? article?.slug ?? null : null
  );
  const [slugInfo, setSlugInfo] = React.useState<string | null>(null);
  const [excerpt, setExcerpt] = React.useState(article?.excerpt ?? "");
  const [categoryId, setCategoryId] = React.useState(article?.categoryId ?? "");
  const [cover, setCover] = React.useState<NewsMedia | null>(() => {
    if (mode === "edit" && article?.coverImage) {
      return {
        id: article.coverMediaId ?? "",
        fileName: "Sampul saat ini",
        fileUrl: article.coverImage,
        storageKey: null,
        mimeType: null,
        sizeBytes: null,
        kind: "image" as const,
        visibility: "public" as const,
        altText: article.title,
        uploadedAt: "",
      };
    }
    return null;
  });
  const [coverPickerOpen, setCoverPickerOpen] = React.useState(false);
  const [attachments, setAttachments] = React.useState<NewsMedia[]>(initialAttachments);
  const [contentDoc, setContentDoc] = React.useState(article?.contentDoc ?? null);
  const [seoTitle, setSeoTitle] = React.useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = React.useState(article?.seoDescription ?? "");
  const [featured, setFeatured] = React.useState(article?.featured ?? false);

  const [categories, setCategories] = React.useState<NewsCategory[]>([]);
  const [categoriesTick, setCategoriesTick] = React.useState(0);
  const [categoryManagerOpen, setCategoryManagerOpen] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const attachmentInputRef = React.useRef<HTMLInputElement>(null);

  // Slug otomatis dari judul sampai diedit manual.
  const autoSlug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/--+/g, "-");
  const slug = manualSlug ?? autoSlug;

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/categories");
        if (!active || !res.ok) return;
        const data = (await res.json()) as { items: NewsCategory[] };
        if (!active) return;
        setCategories(data.items);
      } catch {
        // kategori tetap kosong — select menampilkan opsi kosong
      }
    })();
    return () => {
      active = false;
    };
  }, [categoriesTick]);

  const checkSlug = async (value: string) => {
    if (!value) return;
    try {
      const params = new URLSearchParams({ slug: value });
      if (article?.id) params.set("excludeId", article.id);
      const res = await fetch(`/api/articles/slug-check?${params.toString()}`);
      if (!res.ok) return;
      const data = (await res.json()) as { available: boolean };
      setSlugInfo(data.available ? null : "Slug sudah dipakai — akan diberi akhiran unik saat disimpan.");
    } catch {
      setSlugInfo(null);
    }
  };

  // Peringatan perubahan belum tersimpan.
  React.useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const markDirty = () => setDirty(true);

  const uploadAttachment = async (file: File) => {
    setIsUploadingAttachment(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Unggahan gagal.");
      setAttachments((prev) => [...prev, data as NewsMedia]);
      markDirty();
      toast(`Lampiran "${file.name}" terunggah.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Unggahan lampiran gagal.", "error");
    } finally {
      setIsUploadingAttachment(false);
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    }
  };

  const buildPayload = (status?: NewsStatus) => ({
    title: title.trim(),
    slug: slug || null,
    excerpt: excerpt.trim() ? excerpt.trim() : null,
    contentDoc: contentDoc ?? { type: "doc" as const, content: [] },
    categoryId: categoryId || null,
    coverMediaId: cover?.id || null,
    attachmentIds: attachments.map((a) => a.id),
    tags: [] as string[],
    featured,
    seoTitle: seoTitle.trim() ? seoTitle.trim() : null,
    seoDescription: seoDescription.trim() ? seoDescription.trim() : null,
    status,
  });

  const validate = (): string | null => {
    if (title.trim().length < 3) return "Judul minimal 3 karakter.";
    if (!contentDoc || !docHasContent(contentDoc)) {
      return "Isi artikel masih kosong — tuliskan setidaknya satu paragraf.";
    }
    return null;
  };

  const save = async (status?: NewsStatus) => {
    const problem = validate();
    if (problem) {
      toast(problem, "error");
      return;
    }

    setIsSaving(true);
    try {
      const isCreate = mode === "create";
      const res = await fetch(
        isCreate ? "/api/articles" : `/api/articles/${article?.id}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(status)),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan berita.");

      toast(
        status === "published"
          ? "Berita berhasil diterbitkan."
          : status === "pending_review"
            ? "Berita dikirim untuk ditinjau."
            : "Berita berhasil disimpan.",
        "success"
      );
      setDirty(false);
      router.push("/admin/berita");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal menyimpan berita.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data utama */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-4 sm:p-6">
        <Input
          label="Judul Berita"
          required
          placeholder="cth: Kegiatan Pesantren Ramadan 2026"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            markDirty();
          }}
        />

        <div className="space-y-1.5">
          <Input
            label="Slug URL"
            placeholder="judul-berita"
            value={slug}
            onChange={(e) => {
              setManualSlug(e.target.value);
              markDirty();
            }}
            onBlur={() => void checkSlug(slug)}
            helperText={slugInfo ?? `URL artikel: /berita/${slug || "judul-berita"}`}
          />
        </div>

        <Textarea
          label="Ringkasan (opsional)"
          rows={3}
          placeholder="Ringkasan singkat yang tampil di daftar berita dan hasil pencarian."
          value={excerpt ?? ""}
          onChange={(e) => {
            setExcerpt(e.target.value);
            markDirty();
          }}
        />

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              label="Kategori (opsional)"
              value={categoryId ?? ""}
              onChange={(e) => {
                setCategoryId(e.target.value);
                markDirty();
              }}
            >
              <option value="">— Tanpa kategori —</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          {isSuperAdmin ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCategoryManagerOpen(true)}
            >
              Kelola Kategori
            </Button>
          ) : null}
        </div>
      </section>

      {/* Gambar sampul */}
      <section className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Gambar Sampul (opsional)</Label>
        </div>
        {cover ? (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.fileUrl}
              alt={cover.altText ?? "Sampul berita"}
              className="aspect-video w-full max-w-md rounded-md border border-border object-cover"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCoverPickerOpen(true)}
              >
                Ganti Gambar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  setCover(null);
                  markDirty();
                }}
              >
                Hapus
              </Button>
            </div>
          </div>
        ) : (
          <Button type="button" variant="outline" onClick={() => setCoverPickerOpen(true)}>
            <UploadCloud className="size-4" aria-hidden="true" />
            Pilih / Unggah Gambar
          </Button>
        )}
        <MediaPickerModal
          isOpen={coverPickerOpen}
          onClose={() => setCoverPickerOpen(false)}
          title="Gambar Sampul"
          onSelect={(media) => {
            setCover(media);
            markDirty();
          }}
        />
      </section>

      {/* Isi artikel */}
      <section className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6">
        <Label className="text-sm font-medium">Isi Artikel</Label>
        <TiptapEditor
          content={contentDoc}
          onChange={(doc) => {
            setContentDoc(doc);
            markDirty();
          }}
        />
      </section>

      {/* Lampiran */}
      <section className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-sm font-medium">Dokumen Lampiran (opsional)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => attachmentInputRef.current?.click()}
            disabled={isUploadingAttachment}
            isLoading={isUploadingAttachment}
          >
            <Paperclip className="size-4" aria-hidden="true" />
            Tambah Lampiran
          </Button>
        </div>
        <input
          ref={attachmentInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          aria-label="Unggah lampiran PDF atau DOCX"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void uploadAttachment(file);
          }}
        />
        <p className="text-xs text-muted-foreground">
          PDF atau DOCX, maksimal 10 MB per berkas. Lampiran dapat diunduh
          pengunjung setelah berita terbit.
        </p>
        {attachments.length > 0 ? (
          <ul className="space-y-2">
            {attachments.map((file) => (
              <li
                key={file.id}
                className="flex items-center gap-3 rounded-md border border-border bg-background p-3 text-sm"
              >
                <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate font-medium">{file.fileName}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatBytes(file.sizeBytes)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Hapus lampiran ${file.fileName}`}
                  title="Hapus lampiran"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    setAttachments((prev) => prev.filter((a) => a.id !== file.id));
                    markDirty();
                  }}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {/* SEO & opsi */}
      <section className="space-y-4 rounded-lg border border-border bg-card p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">SEO &amp; Opsi</h2>
        <Input
          label="Judul SEO (opsional)"
          placeholder="Judul khusus untuk hasil pencarian Google"
          value={seoTitle}
          onChange={(e) => {
            setSeoTitle(e.target.value);
            markDirty();
          }}
        />
        <Textarea
          label="Deskripsi SEO (opsional)"
          rows={2}
          placeholder="Deskripsi meta untuk mesin pencari (maks. 300 karakter)."
          value={seoDescription}
          onChange={(e) => {
            setSeoDescription(e.target.value);
            markDirty();
          }}
        />
        {isSuperAdmin ? (
          <div className="flex items-center gap-3">
            <Switch
              id="berita-unggulan"
              checked={featured}
              onCheckedChange={(checked) => {
                setFeatured(checked);
                markDirty();
              }}
            />
            <Label htmlFor="berita-unggulan" className="text-sm font-medium">
              Berita unggulan
            </Label>
          </div>
        ) : null}
      </section>

      {/* Aksi */}
      <section className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-4 sm:p-6">
        {mode === "edit" && article ? (
          <Badge variant={article.status === "published" ? "default" : "secondary"}>
            {NEWS_STATUS_LABEL[article.status]}
          </Badge>
        ) : null}

        {mode === "edit" && article ? (
          <a
            href={`/admin/berita/${article.id}/pratinjau`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Eye className="size-4" aria-hidden="true" />
            Pratinjau
          </a>
        ) : null}

        <div className="flex flex-1 flex-wrap justify-end gap-2">
          {isSaving ? (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Menyimpan…
            </span>
          ) : null}

          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => void save("draft")}
          >
            Simpan Draf
          </Button>

          {isSuperAdmin ? (
            <Button
              type="button"
              variant="default"
              disabled={isSaving}
              onClick={() => void save("published")}
            >
              {mode === "edit" && article?.status === "published"
                ? "Simpan & Perbarui Terbitan"
                : "Terbitkan"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="accent"
              disabled={isSaving}
              onClick={() => void save("pending_review")}
            >
              <Send className="size-4" aria-hidden="true" />
              Kirim untuk Ditinjau
            </Button>
          )}
        </div>
      </section>

      <CategoryManagerModal
        isOpen={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        categories={categories}
        onChanged={() => setCategoriesTick((tick) => tick + 1)}
      />
    </div>
  );
}
