import Link from "next/link";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

/** 404 global — halaman tidak ditemukan, bergaya situs publik. */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex flex-1 items-center justify-center py-20 px-4">
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
      </main>
      <Footer />
    </div>
  );
}
