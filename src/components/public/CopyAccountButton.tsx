"use client";

import React, { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyAccountButtonProps {
  accountNumber: string;
  index: number;
  /** Nama bank/rekening untuk aria-label. */
  label: string;
}

/**
 * Island kecil halaman /donasi — satu-satunya interaktivitas di sana
 * (salin nomor rekening ke clipboard). Sisanya halaman dirender server.
 */
export function CopyAccountButton({ accountNumber, index, label }: CopyAccountButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard tak tersedia (context tidak aman) — nomor tetap terbaca di halaman.
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleCopy()}
      aria-label={`Salin nomor rekening ${label}`}
    >
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {copied ? "Tersalin" : "Salin"}
    </Button>
  );
}
