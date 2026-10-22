"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NewsEditorForm } from "@/components/admin/news/news-editor-form";

export default function AdminBeritaBaruPage() {
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
          Tulis Berita Baru
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Isi judul dan artikel, lalu simpan sebagai draf, kirim untuk
          ditinjau, atau terbitkan (super admin).
        </p>
      </div>

      <NewsEditorForm mode="create" />
    </div>
  );
}
