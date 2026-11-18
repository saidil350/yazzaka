"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

// Paginasi daftar admin client-side (slice lokal), gaya sama dengan /admin/berita.
// Me-render "Halaman X dari Y" + tombol Sebelumnya/Berikutnya; null bila hanya 1 halaman.
// State halaman disinkronkan ke query param ?page= agar deep-linkable:
// baca saat mount, tulis via history.replaceState saat halaman berubah.
export function ListPagination({
  page,
  totalPages,
  onChangePage,
  isLoading,
}: {
  page: number;
  totalPages: number;
  onChangePage: (next: (p: number) => number) => void;
  isLoading?: boolean;
}) {
  const syncedOnce = useRef(false);

  // Baca ?page= dari URL sekali saat mount (deep-link / refresh tetap di halaman sama)
  useEffect(() => {
    if (syncedOnce.current) return;
    syncedOnce.current = true;
    const fromUrl = parseInt(
      new URLSearchParams(window.location.search).get("page") ?? "1",
      10
    );
    if (Number.isFinite(fromUrl) && fromUrl > 1) {
      onChangePage(() => fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tulis halaman aktif ke URL saat berubah (tanpa navigasi router)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (page > 1) {
      url.searchParams.set("page", String(page));
    } else {
      url.searchParams.delete("page");
    }
    window.history.replaceState(null, "", url.toString());
  }, [page]);

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginasi daftar" className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground tabular-nums">
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onChangePage((p) => Math.max(1, p - 1))}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={() => onChangePage((p) => Math.min(totalPages, p + 1))}
        >
          Berikutnya
        </Button>
      </div>
    </nav>
  );
}
