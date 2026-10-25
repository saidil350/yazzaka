"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { MediaItem } from "@/lib/types";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !fileUrl) {
      toast("Nama file dan URL media wajib diisi.", "error");
      return;
    }

    try {
      await addMedia({
        fileName,
        fileUrl,
        fileType,
        fileSize,
        category,
        altText: altText || fileName,
      });
      toast("File media berhasil ditambahkan ke library!", "success");
      setModalOpen(false);
    } catch {
      toast("Gagal menambahkan media. Data tidak tersimpan — coba lagi.", "error");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("URL media berhasil disalin ke clipboard!", "info");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus media "${name}"?`)) return;
    try {
      await deleteMedia(id);
      toast("Media berhasil dihapus.", "info");
    } catch {
      toast("Gagal menghapus media. Coba lagi.", "error");
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
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Media / Media Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Media Manager &amp; Arsip Berkas
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pusat penyimpanan gambar, brosur PDF, dan dokumen sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0">
          <Upload className="h-4 w-4" />
          <span>Upload / Tambah Media</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={selectedType} onValueChange={setSelectedType}>
        <TabsList>
          <TabsTrigger value="all">
            Semua Format ({media.length})
          </TabsTrigger>
          <TabsTrigger value="image">
            Foto &amp; Gambar ({media.filter((m) => m.fileType === "image").length})
          </TabsTrigger>
          <TabsTrigger value="document">
            Dokumen / PDF ({media.filter((m) => m.fileType === "document").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Media Grid or EmptyState */}
      {filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={ImageIcon}
            title="Belum Ada Berkas Media"
            description="Unggah foto kegiatan atau berkas PDF pertama Anda."
            action={{
              label: "Unggah Media Baru",
              onClick: () => setModalOpen(true),
              icon: Upload,
            }}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden flex flex-col justify-between"
            >
              <div className="h-44 relative overflow-hidden bg-muted flex items-center justify-center">
                {item.fileType === "image" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.fileUrl}
                    alt={item.altText}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <FileText className="h-10 w-10 text-primary" aria-hidden="true" />
                    <span className="text-[10px]">Dokumen PDF</span>
                  </div>
                )}

                <Badge variant="secondary" className="absolute top-2 left-2">
                  {item.category}
                </Badge>
              </div>

              <div className="p-4 space-y-2">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-xs text-foreground line-clamp-1">
                    {item.fileName}
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    {item.fileSize} • {item.uploadedAt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.fileUrl)}
                    aria-label={`Salin URL ${item.fileName}`}
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" aria-hidden="true" />
                    <span>Salin URL</span>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    onClick={() => handleDelete(item.id, item.fileName)}
                    aria-label={`Hapus ${item.fileName}`}
                    title={`Hapus ${item.fileName}`}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload / Add Media Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tambah File Media ke Library"
        maxWidth="xl"
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
              placeholder="https://contoh.com/berkas.jpg"
              helperText="Unggah gambar via drag & drop atau masukkan URL gambar."
            />
          ) : (
            <Input
              label="URL File (Link Dokumen)"
              required
              placeholder="https://example.com/file.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Format / Tipe File"
              value={fileType}
              onChange={(e) => setFileType(e.target.value as MediaItem["fileType"])}
            >
              <option value="image">Gambar / Foto (Image)</option>
              <option value="document">Dokumen / PDF</option>
            </Select>

            <Select
              label="Kategori Media"
              value={category}
              onChange={(e) => setCategory(e.target.value as MediaItem["category"])}
            >
              <option value="Galeri">Galeri</option>
              <option value="Fasilitas">Fasilitas</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Banner">Banner</option>
            </Select>
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
