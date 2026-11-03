import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

/**
 * 404 global — sengaja berdiri sendiri TANPA Header/Footer: 404 harus tampil
 * bahkan saat DB gagal, dan not-found di luar route group (public) tidak
 * mewarisi layout publik yang membutuhkan data.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-20 px-4">
      <div className="max-w-md text-center space-y-4">
        <SearchX className="size-10 text-muted-foreground mx-auto" aria-hidden="true" />
        <h1 className="text-2xl font-semibold text-foreground">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="outline">Kembali ke Beranda</Button>
          </Link>
          <Link href="/kontak">
            <Button>Hubungi Kami</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
