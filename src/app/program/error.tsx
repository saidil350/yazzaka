"use client";

import { useEffect } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircle } from "lucide-react";

/** Error state halaman program — tawarkan muat ulang. */
export default function ProgramError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Halaman program gagal dimuat:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center py-16">
        <EmptyState
          icon={AlertCircle}
          title="Terjadi Kesalahan"
          description="Halaman program tidak dapat dimuat saat ini. Silakan coba lagi."
          action={{ label: "Muat Ulang", onClick: () => reset() }}
        />
      </main>
      <Footer />
    </div>
  );
}
