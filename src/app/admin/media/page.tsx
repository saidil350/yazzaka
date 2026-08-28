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
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";

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
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Media / Media Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Media Manager &amp; Arsip Berkas
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pusat penyimpanan gambar, video profil, brosur PDF, dan dokumen sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
          <Upload className="h-4 w-4" />
          <span>Upload / Tambah Media</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedType === "all"
              ? "bg-[#FA6400] text-white shadow-xs shadow-[#FA6400]/30"
              : "bg-white text-stone-700 border border-[#E8E2D8] hover:bg-[#FAF6EE] hover:border-[#FA6400]"
          }`}
        >
          Semua Format ({media.length})
        </button>
        <button
          onClick={() => setSelectedType("image")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedType === "image"
              ? "bg-[#FA6400] text-white shadow-xs shadow-[#FA6400]/30"
              : "bg-white text-stone-700 border border-[#E8E2D8] hover:bg-[#FAF6EE] hover:border-[#FA6400]"
          }`}
        >
          Foto &amp; Gambar ({media.filter((m) => m.fileType === "image").length})
        </button>
        <button
          onClick={() => setSelectedType("video")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedType === "video"
              ? "bg-[#FA6400] text-white shadow-xs shadow-[#FA6400]/30"
              : "bg-white text-stone-700 border border-[#E8E2D8] hover:bg-[#FAF6EE] hover:border-[#FA6400]"
          }`}
        >
          Video ({media.filter((m) => m.fileType === "video").length})
        </button>
        <button
          onClick={() => setSelectedType("document")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            selectedType === "document"
              ? "bg-[#FA6400] text-white shadow-xs shadow-[#FA6400]/30"
              : "bg-white text-stone-700 border border-[#E8E2D8] hover:bg-[#FAF6EE] hover:border-[#FA6400]"
          }`}
        >
          Dokumen / PDF ({media.filter((m) => m.fileType === "document").length})
        </button>
      </div>

      {/* Media Grid or EmptyState */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E8E2D8] shadow-xs">
          <EmptyState
            icon={ImageIcon}
            title="Belum Ada Berkas Media"
            description="Unggah foto kegiatan, thumbnail video, atau berkas PDF pertama Anda."
            action={{
              label: "Unggah Media Baru",
              onClick: () => setModalOpen(true),
              icon: Upload,
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#FA6400]/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="h-44 relative overflow-hidden bg-[#FAF6EE] flex items-center justify-center">
                {item.fileType === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.fileUrl}
                    alt={item.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : item.fileType === "video" ? (
                  <div className="flex flex-col items-center gap-1 text-stone-500">
                    <Video className="h-10 w-10 text-[#FA6400]" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-stone-600">Video Link</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-stone-500">
                    <FileText className="h-10 w-10 text-[#FA6400]" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-stone-600">Dokumen PDF</span>
                  </div>
                )}

                <div className="absolute top-2 left-2 bg-[#FFF0E5] text-[#C2410C] border border-[#FED7AA] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs">
                  {item.category}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-[#1E2330] line-clamp-1">
                    {item.fileName}
                  </h4>
                  <p className="text-[10px] text-stone-400">
                    {item.fileSize} • {item.uploadedAt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D8]">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.fileUrl)}
                    aria-label={`Salin URL ${item.fileName}`}
                    className="text-xs font-bold text-[#FA6400] hover:text-[#C2410C] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" aria-hidden="true" />
                    <span>Salin URL</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.fileName)}
                    aria-label={`Hapus ${item.fileName}`}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

          {fileType === "image" ? (
            <ImageUpload
              label="Berkas Gambar / Foto"
              value={fileUrl}
              onChange={(val) => {
                setFileUrl(val);
                if (!fileName && val) {
                  setFileName(`media-${Date.now()}.png`);
                }
              }}
              placeholder="https://images.unsplash.com/... atau unggah berkas"
              helperText="Unggah gambar via drag & drop atau masukkan URL gambar."
            />
          ) : (
            <Input
              label="URL File (Link Dokumen / Video URL)"
              required
              placeholder="https://example.com/file.pdf atau link video"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Format / Tipe File
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as MediaItem["fileType"])}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                <option value="image">Gambar / Foto (Image)</option>
                <option value="video">Video URL (YouTube/Vimeo)</option>
                <option value="document">Dokumen / PDF</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Kategori Media
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaItem["category"])}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
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
