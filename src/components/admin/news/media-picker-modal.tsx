"use client";

import React from "react";
import { ImagePlus, Loader2, Newspaper, UploadCloud } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { NewsMedia } from "@/lib/news/types";

/**
 * Pemilih berkas media untuk fitur berita: unggah baru (POST /api/uploads)
 * atau pilih dari library. Hanya gambar (kind=image) untuk picker ini.
 */
export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Pilih Gambar",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: NewsMedia) => void;
  title?: string;
}) {
  const [items, setItems] = React.useState<NewsMedia[] | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // items === null berarti library sedang dimuat.
  const isLoading = items === null;

  React.useEffect(() => {
    if (!isOpen) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/media?kind=image");
        if (!active) return;
        if (!res.ok) throw new Error("gagal memuat");
        const data = (await res.json()) as { items: NewsMedia[] };
        if (!active) return;
        setItems(data.items.filter((m) => m.kind === "image"));
      } catch {
        if (active) setError("Gagal memuat library gambar. Coba lagi.");
      }
    })();
    return () => {
      active = false;
    };
  }, [isOpen]);

  const handleClose = () => {
    setItems(null);
    setError(null);
    onClose();
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Unggahan gagal.");
      }
      onSelect(data as NewsMedia);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unggahan gagal.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description="Unggah gambar baru (JPG, PNG, WEBP, GIF, maks 5 MB) atau pilih dari library."
      maxWidth="3xl"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Batal
          </Button>
          <Button
            variant="accent"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            isLoading={isUploading}
          >
            <UploadCloud className="size-4" aria-hidden="true" />
            Unggah Gambar
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />

        {error ? (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span className="ml-2 text-sm">Memuat library…</span>
          </div>
        ) : items !== null && items.length === 0 ? (
          <EmptyState
            icon={ImagePlus}
            title="Library Masih Kosong"
            description="Belum ada gambar terunggah. Unggah gambar pertama Anda."
          />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Daftar gambar library">
            {items.map((media) => (
              <li key={media.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(media);
                    onClose();
                  }}
                  className="group w-full cursor-pointer overflow-hidden rounded-md border border-border bg-background text-left transition-colors"
                  aria-label={`Pilih gambar ${media.fileName}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={media.fileUrl}
                    alt={media.altText ?? media.fileName}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                  />
                  <span className="flex items-center gap-1.5 truncate px-2 py-1.5 text-xs text-muted-foreground">
                    <Newspaper className="size-3 shrink-0" aria-hidden="true" />
                    <span className="truncate">{media.fileName}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
