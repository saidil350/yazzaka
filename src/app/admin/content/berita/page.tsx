"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Article } from "@/lib/types";
import { formatDateIndonesian, slugify } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Sparkles,
  FileText,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { ImageUpload } from "@/components/ui/image-upload";

export default function AdminNewsPage() {
  const { articles, addArticle, updateArticle, deleteArticle } = useSchoolData();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Article["category"]>("Berita Sekolah");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("Redaksi Yazzakka");
  const [status, setStatus] = useState<"published" | "draft">("published");

  const categories: Article["category"][] = [
    "Berita Sekolah",
    "Wawasan & Opini",
    "Prestasi",
    "Kegiatan Santri",
    "Pengumuman",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Berita Sekolah");
    setExcerpt("");
    setContent("");
    setCoverImage("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80");
    setTags("Edukasi, Santri, Yazzakka");
    setAuthor("Redaksi Yazzakka");
    setStatus("published");
    setModalOpen(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingId(art.id);
    setTitle(art.title);
    setCategory(art.category);
    setExcerpt(art.excerpt);
    setContent(art.content);
    setCoverImage(art.coverImage);
    setTags(art.tags.join(", "));
    setAuthor(art.author);
    setStatus(art.status);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast("Judul dan isi artikel wajib diisi.", "error");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId) {
      updateArticle(editingId, {
        title,
        slug: slugify(title),
        category,
        excerpt,
        content,
        coverImage,
        tags: tagArray,
        author,
        status,
        readTime: "3 menit",
        seoTitle: title,
        seoDescription: excerpt,
      });
      toast("Artikel berhasil diperbarui!", "success");
    } else {
      addArticle({
        title,
        slug: slugify(title),
        category,
        excerpt,
        content,
        coverImage,
        tags: tagArray,
        author,
        authorRole: "Humas & Publikasi",
        publishedDate: new Date().toISOString().split("T")[0],
        readTime: "3 menit",
        status,
        featured: false,
        seoTitle: title,
        seoDescription: excerpt,
      });
      toast("Artikel baru berhasil diterbitkan!", "success");
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, artTitle: string) => {
    if (confirm(`Hapus artikel "${artTitle}"?`)) {
      deleteArticle(id);
      toast("Artikel telah dihapus.", "info");
    }
  };

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Content / Berita &amp; Artikel
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Manajemen Berita &amp; Publikasi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Tulis, sunting, jadwalkan, atau arsipkan artikel wawasan dan liputan kegiatan sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
          <span>Tulis Berita Baru</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Input
        leftIcon={<Search className="h-4 w-4" />}
        placeholder="Cari judul artikel..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Cari judul artikel"
      />

      {/* Articles Table / List */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Newspaper}
              title="Belum Ada Artikel Berita"
              description={
                searchQuery
                  ? `Tidak ada artikel yang cocok dengan pencarian "${searchQuery}".`
                  : "Mulai buat artikel, berita liputan sekolah/yayasan, atau opini edukatif pertama Anda."
              }
              action={{
                label: "Tulis Berita Baru",
                onClick: handleOpenAdd,
                icon: Plus,
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="text-left">
              <TableHeader>
                <tr>
                  <TableHead className="p-4 sm:px-6">Cover &amp; Judul</TableHead>
                  <TableHead className="p-4 sm:px-6">Kategori</TableHead>
                  <TableHead className="p-4 sm:px-6">Penulis &amp; Tanggal</TableHead>
                  <TableHead className="p-4 sm:px-6">Status</TableHead>
                  <TableHead className="p-4 sm:px-6 text-right">Aksi</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {filtered.map((art) => (
                  <TableRow key={art.id}>
                    <TableCell className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="h-12 w-16 object-cover rounded-md shrink-0 border border-border bg-muted"
                        />
                        <div>
                          <h4 className="font-medium text-sm text-foreground line-clamp-1 leading-snug">
                            {art.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {art.excerpt}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6">
                      <Badge variant="secondary">{art.category}</Badge>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-xs space-y-0.5">
                      <span className="font-medium text-foreground block">{art.author}</span>
                      <span className="text-muted-foreground">{formatDateIndonesian(art.publishedDate)}</span>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6">
                      <Badge variant={art.status === "published" ? "default" : "secondary"}>
                        {art.status === "published" ? "Terbit" : "Draf"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleOpenEdit(art)}
                        title="Edit Artikel"
                        aria-label="Edit Artikel"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(art.id, art.title)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus Artikel"
                        aria-label="Hapus Artikel"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
        maxWidth="4xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button variant="accent" onClick={handleSubmit}>
              {editingId ? "Simpan Perubahan" : "Terbitkan Artikel"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Judul Artikel"
            required
            placeholder="Contoh: Santri Yazzakka Raih Medali Emas OSN 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Kategori Berita"
              value={category}
              onChange={(e) => setCategory(e.target.value as Article["category"])}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select
              label="Status Publikasi"
              value={status}
              onChange={(e) => setStatus(e.target.value as "published" | "draft")}
            >
              <option value="published">Terbitkan Langsung (Published)</option>
              <option value="draft">Simpan Sebagai Draf (Draft)</option>
            </Select>
          </div>

          <ImageUpload
            label="Foto Sampul (Cover Image)"
            required
            value={coverImage}
            onChange={(val) => setCoverImage(val)}
            placeholder="https://images.unsplash.com/... atau unggah gambar"
            helperText="Unggah gambar atau masukkan URL gambar sampul beresolusi tinggi."
          />

          <Textarea
            label="Ringkasan Singkat (Excerpt / Lead Paragraf)"
            rows={2}
            placeholder="Ringkasan 1-2 kalimat pengantar artikel..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <Textarea
            label="Isi Konten Lengkap Artikel"
            required
            rows={8}
            placeholder="Tuliskan berita lengkap di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Penulis"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <Input
              label="Tags (Pisahkan dengan koma)"
              placeholder="OSN, Sains, Prestasi"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
