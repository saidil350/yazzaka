"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircle } from "lucide-react";

/** Error state halaman berita — tawarkan muat ulang. Header/Footer tetap
 * dari (public)/layout; boundary ini hanya menggantikan konten halaman. */
export default function BeritaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Halaman berita gagal dimuat:", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center py-16">
      <EmptyState
        icon={AlertCircle}
        title="Terjadi Kesalahan"
        description="Berita tidak dapat dimuat saat ini. Silakan coba lagi."
        action={{ label: "Muat Ulang", onClick: () => reset() }}
      />
    </main>
  );
}
