import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Navigasi halaman server-rendered untuk daftar publik (pola sama dengan /berita).
// buildHref menerima nomor halaman dan mengembalikan URL lengkap (query dipertahankan pemanggil).
export function PaginationNav({
  currentPage,
  totalPages,
  buildHref,
  ariaLabel,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ariaLabel: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className="flex items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          aria-label={`Halaman ${p}`}
          className={[
            "inline-flex size-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
            p === currentPage
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:bg-muted",
          ].join(" ")}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-muted"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
