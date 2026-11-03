import type { Metadata } from "next";
import { Heart, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { CopyAccountButton } from "@/components/public/CopyAccountButton";
import { getPublicProfile } from "@/lib/public-data";
import { DEFAULT_FOUNDATION } from "@/lib/data/initialData";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Donasi",
  description:
    "Salurkan donasi untuk operasional dan program pendidikan Yayasan Bina Iman Akhlak Yazzakka — transfer bank atau platform donasi online.",
  alternates: { canonical: "/donasi" },
};

export default async function DonasiPage() {
  const profile = await getPublicProfile();
  const donation = profile?.foundation?.donation ?? DEFAULT_FOUNDATION.donation;
  const bankAccounts = donation?.bankAccounts ?? [];
  const platforms = donation?.platforms ?? [];

  return (
    <>
      {/* ── Page Hero Banner ─────────── */}
      <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
            Salurkan Donasi
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
            Setiap donasi Anda mendukung operasional dan program pendidikan {profile?.name ?? "Yayasan Yazzakka"}.
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────── */}
      <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {bankAccounts.length === 0 && platforms.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Informasi Donasi Belum Tersedia"
              description="Kanal donasi resmi yayasan akan diperbarui melalui panel admin."
            />
          ) : (
            <div className="max-w-3xl mx-auto space-y-10">

              {/* Transfer Bank */}
              {bankAccounts.length > 0 && (
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Transfer Bank
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Salin nomor rekening dan lakukan transfer dari bank mana pun.
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E8E2D8] bg-white divide-y divide-[#E8E2D8]">
                    {bankAccounts.map((account, idx) => {
                      const bankLabel =
                        (account.bankName ?? "").trim() || `Rekening ${idx + 1}`;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 px-5 py-4"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {bankLabel}
                            </p>
                            <p className="font-mono text-base text-foreground break-all mt-0.5">
                              {account.accountNumber}
                            </p>
                            {(account.accountHolder ?? "").trim() !== "" && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                a.n. {account.accountHolder}
                              </p>
                            )}
                          </div>
                          <CopyAccountButton
                            accountNumber={account.accountNumber}
                            index={idx}
                            label={bankLabel}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Donasi Online */}
              {platforms.length > 0 && (
                <section className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Donasi Online
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Salurkan donasi melalui platform berikut — terbuka di tab baru.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {platforms.map((platform, idx) => (
                      <a
                        key={idx}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-auto justify-between py-3"
                        )}
                      >
                        <span className="truncate">
                          {(platform.label ?? "").trim() || platform.url}
                        </span>
                        <ExternalLink
                          className="h-4 w-4 text-muted-foreground shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
