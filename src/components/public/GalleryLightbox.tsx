"use client";

import React, { useState } from "react";
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

  return (
    <>
      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-border overflow-hidden shadow-xs group flex flex-col cursor-pointer"
            onClick={() => {
              if (item.fileType === "image") {
                setActiveLightbox(item.fileUrl);
              }
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {item.fileType === "image" ? (
                <Image
                  src={item.fileUrl}
                  alt={item.altText}
                  fill
                  sizes="(min-width:1024px) 380px, (min-width:640px) 45vw, 90vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-foreground p-6 text-center">
                  <FileText className="h-10 w-10 text-yazzaka-orange mb-2" />
                  <span className="text-xs font-bold">{item.fileName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white p-2">
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeLightbox}
              alt="Pratinjau foto"
              className="max-h-[85vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
