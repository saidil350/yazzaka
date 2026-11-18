"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import Image from "next/image";
import type { MediaItem } from "@/lib/types";

/**
 * Island client untuk grid galeri + lightbox (satu-satunya bagian interaktif
 * halaman /galeri). Data diterima via props dari halaman server — tanpa fetch.
 * Foto lightbox sengaja tetap <img> ukuran bebas (object-contain), bukan
 * next/image fill, karena dimensi aslinya tak diketahui saat render.
 */
export function GalleryLightbox({ items }: { items: MediaItem[] }) {
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const openLightbox = (url: string, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveLightbox(url);
  };

  const closeLightbox = useCallback(() => {
    setActiveLightbox(null);
    lastTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!activeLightbox) return;

    closeRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightbox, closeLightbox]);

  return (
    <>
      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isImage = item.fileType === "image";
          return (
            <button
              key={item.id}
              type="button"
              disabled={!isImage}
              aria-label={isImage ? `Buka foto ${item.altText}` : item.fileName}
              className="bg-white rounded-lg border border-border overflow-hidden shadow-xs group flex flex-col text-left w-full cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={(e) => {
                if (isImage) openLightbox(item.fileUrl, e.currentTarget);
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {isImage ? (
                  <Image
                    src={item.fileUrl}
                    alt={item.altText}
                    fill
                    sizes="(min-width:1024px) 380px, (min-width:640px) 45vw, 90vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 motion-reduce:transform-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-foreground p-6 text-center">
                    <FileText className="h-10 w-10 text-yazzaka-orange mb-2" aria-hidden="true" />
                    <span className="text-xs font-bold">{item.fileName}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau foto"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overscroll-contain"
          onClick={() => closeLightbox()}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white p-2">
            <button
              ref={closeRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              aria-label="Tutup"
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeLightbox}
              alt="Pratinjau foto"
              className="max-h-[85vh] w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
