"use client";

import { Button } from "@/components/ui/button";

// Paginasi daftar admin client-side (slice lokal), gaya sama dengan /admin/berita.
// Me-render "Halaman X dari Y" + tombol Sebelumnya/Berikutnya; null bila hanya 1 halaman.
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
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
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
    </div>
  );
}
