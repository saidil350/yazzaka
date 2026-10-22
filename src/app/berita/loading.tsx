import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton loading untuk halaman daftar berita. */
export default function BeritaLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-card py-10 lg:py-14">
          <div className="mx-auto max-w-3xl space-y-3 px-4 text-center sm:px-6">
            <Skeleton className="mx-auto h-6 w-44" />
            <Skeleton className="mx-auto h-9 w-3/4" />
            <Skeleton className="mx-auto h-4 w-2/3" />
          </div>
        </section>
        <section className="py-12">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between gap-4">
              <Skeleton className="h-9 w-72" />
              <Skeleton className="h-9 w-64" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg border border-border bg-card">
                  <Skeleton className="h-48 w-full rounded-none" />
                  <div className="space-y-2.5 p-5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-5 w-5/6" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
