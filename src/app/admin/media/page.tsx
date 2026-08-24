"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { MediaItem } from "@/lib/types";
import {
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Copy,
  Trash2,
  ExternalLink,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function AdminMediaPage() {
  const { media, addMedia, deleteMedia } = useSchoolData();
  const { toast } = useToast();

  const [selectedType, setSelectedType] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState<MediaItem["fileType"]>("image");
  const [category, setCategory] = useState<MediaItem["category"]>("Galeri");
  const [fileSize, setFileSize] = useState("1.5 MB");
  const [altText, setAltText] = useState("");

  const handleOpenAdd = () => {
    setFileName("");
    setFileUrl("");
    setFileType("image");
    setCategory("Galeri");
    setFileSize("1.8 MB");
    setAltText("");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !fileUrl) {
      toast("Nama file dan URL media wajib diisi.", "error");
      return;
    }

    addMedia({
      fileName,
      fileUrl,
      fileType,
      fileSize,
      category,
      altText: altText || fileName,
    });

    toast("File media berhasil ditambahkan ke library!", "success");
    setModalOpen(false);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("URL media berhasil disalin ke clipboard!", "info");
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus media "${name}"?`)) {
      deleteMedia(id);
      toast("Media berhasil dihapus.", "info");
    }
  };

  const filtered = media.filter((m) => {
    if (selectedType === "all") return true;
    return m.fileType === selectedType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Media / Media Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
            Media Manager & Arsip Berkas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pusat penyimpanan gambar, video profil, brosur PDF, dan dokumen sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="accent" size="default" className="shrink-0 shadow-sm">
          <Upload className="h-4 w-4" />
          <span>Upload / Tambah Media</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            selectedType === "all"
              ? "bg-[var(--color-primary)] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Semua Format ({media.length})
        </button>
        <button
          onClick={() => setSelectedType("image")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            selectedType === "image"
              ? "bg-[var(--color-primary)] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Foto & Gambar ({media.filter((m) => m.fileType === "image").length})
        </button>
        <button
          onClick={() => setSelectedType("video")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            selectedType === "video"
              ? "bg-[var(--color-primary)] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Video ({media.filter((m) => m.fileType === "video").length})
        </button>
        <button
          onClick={() => setSelectedType("document")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            selectedType === "document"
              ? "bg-[var(--color-primary)] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          Dokumen / PDF ({media.filter((m) => m.fileType === "document").length})
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="h-44 relative overflow-hidden bg-slate-100 flex items-center justify-center">
              {item.fileType === "image" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.fileUrl}
                  alt={item.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : item.fileType === "video" ? (
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <Video className="h-10 w-10 text-amber-500" />
                  <span className="text-[10px] font-bold">Video Link</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <FileText className="h-10 w-10 text-[var(--color-primary)]" />
                  <span className="text-[10px] font-bold">Dokumen PDF</span>
                </div>
              )}

              <div className="absolute top-2 left-2 bg-slate-900/80 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                {item.category}
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                  {item.fileName}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {item.fileSize} • {item.uploadedAt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.fileUrl)}
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Salin URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.fileName)}
                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload / Add Media Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah File Media ke Library"
        maxWidth="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              Simpan ke Media Library
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama File Media"
            required
            placeholder="Contoh: lab-komputer-modern.jpg"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <Input
            label="URL File (Link Gambar / Dokumen / Video)"
            required
            placeholder="https://images.unsplash.com/..."
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Format / Tipe File
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as MediaItem["fileType"])}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white"
              >
                <option value="image">Gambar / Foto (Image)</option>
                <option value="video">Video URL (YouTube/Vimeo)</option>
                <option value="document">Dokumen / PDF</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Kategori Media
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaItem["category"])}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white"
              >
                <option value="Galeri">Galeri</option>
                <option value="Fasilitas">Fasilitas</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Dokumen PPDB">Dokumen PPDB</option>
                <option value="Banner">Banner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ukuran File (Perkiraan)"
              placeholder="Contoh: 2.1 MB"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
            />
            <Input
              label="Alt Text / Keterangan Visual"
              placeholder="Deskripsi untuk aksesibilitas..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
