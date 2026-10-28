"use client";

import React, { useState, useRef } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Heart, Copy, Check, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DonasiPage() {
  const { profile } = useSchoolData();
  const donation = profile.foundation?.donation;
  const bankAccounts = donation?.bankAccounts ?? [];
  const platforms = donation?.platforms ?? [];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyAccount = async (accountNumber: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedIndex(idx);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Clipboard tak tersedia (context tidak aman) — nomor tetap terbaca di halaman.
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">

        {/* ── Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-background py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Salurkan Donasi
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Setiap donasi Anda mendukung operasional dan program pendidikan {profile.name}.
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
                      {bankAccounts.map((account, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 px-5 py-4"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                              {(account.bankName ?? "").trim() || `Rekening ${idx + 1}`}
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyAccount(account.accountNumber, idx)}
                            aria-label={`Salin nomor rekening ${(account.bankName ?? "").trim() || (idx + 1).toString()}`}
                          >
                            {copiedIndex === idx ? (
                              <Check className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Copy className="h-4 w-4" aria-hidden="true" />
                            )}
                            {copiedIndex === idx ? "Tersalin" : "Salin"}
                          </Button>
                        </div>
                      ))}
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
      </main>
      <Footer />
    </div>
  );
}
