"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, Link as LinkIcon, X, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

export interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  label = "Foto Sampul / Gambar",
  value = "",
  onChange,
  placeholder = "https://images.unsplash.com/... atau unggah gambar",
  required = false,
  helperText,
  className = "",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = useCallback(
    (file: File) => {
      setErrorMsg(null);
      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        setErrorMsg("Hanya file gambar (JPG, PNG, WEBP, GIF, SVG) yang diperbolehkan.");
        return;
      }

      // Validasi ukuran file (misal 5MB)
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMsg(`Ukuran file maksimal adalah ${maxSizeMB} MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.onerror = () => {
        setErrorMsg("Gagal membaca file gambar.");
      };
      reader.readAsDataURL(file);
    },
    [maxSizeMB, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileProcess(file);
    }
  };

  const handleClear = () => {
    onChange("");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-sm font-medium text-foreground flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
          </label>
        )}

        <div className="inline-flex p-0.5 rounded-md bg-muted border border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === "upload"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>Upload / Drag &amp; Drop</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2.5 py-1 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
              mode === "url"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>Tautan URL</span>
          </button>
        </div>
      </div>

      {/* Preview if image exists */}
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-border bg-card p-2 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="h-20 w-28 object-cover rounded-md border border-border bg-white shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=60";
            }}
          />
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-success mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Gambar Siap Digunakan</span>
            </div>
            <p className="text-xs text-muted-foreground truncate font-mono bg-muted px-2 py-1 rounded-md border border-border">
              {value.startsWith("data:") ? `Data Gambar Lokal (${value.substring(0, 30)}...)` : value}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="h-8 w-8 rounded-md bg-card border border-border text-muted-foreground hover:text-destructive hover:bg-muted flex items-center justify-center transition-colors shadow-xs cursor-pointer mr-2 shrink-0"
            title="Hapus Gambar"
            aria-label="Hapus gambar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Empty / Input State */
        <div>
          {mode === "upload" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-ring bg-muted"
                  : "border-input bg-muted/40 hover:bg-muted"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                    isDragging
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground border border-border"
                  }`}
                >
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Tarik &amp; lepas gambar ke sini, atau <span className="text-primary underline">pilih berkas</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mendukung JPG, PNG, WEBP, GIF (Maksimal {maxSizeMB} MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => {
                    setErrorMsg(null);
                    onChange(e.target.value);
                  }}
                  placeholder={placeholder}
                  className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-card text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 shadow-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Tempelkan URL tautan gambar publik (Unsplash, CDN, atau cloud hosting).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Feedback */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium mt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !errorMsg && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
