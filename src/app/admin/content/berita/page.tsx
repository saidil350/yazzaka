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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

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
  const [author, setAuthor] = useState("Redaksi Yazzaka");
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
    setTags("Edukasi, Santri, Yazzaka");
    setAuthor("Redaksi Yazzaka");
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
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
            Content / Berita & Artikel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)]">
            Manajemen Berita & Publikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tulis, sunting, jadwalkan, atau arsipkan artikel wawasan dan liputan kegiatan sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="accent" size="default" className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4" />
          <span>Tulis Berita Baru</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari judul artikel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm focus:outline-none bg-transparent"
        />
      </div>

      {/* Articles Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="p-4 sm:px-6">Cover & Judul</th>
                <th className="p-4 sm:px-6">Kategori</th>
                <th className="p-4 sm:px-6">Penulis & Tanggal</th>
                <th className="p-4 sm:px-6">Status</th>
                <th className="p-4 sm:px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div className="flex items-center gap-3 max-w-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="h-12 w-16 object-cover rounded-lg shrink-0 border border-slate-200 bg-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-1 leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      {art.category}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-xs space-y-0.5">
                    <span className="font-semibold text-slate-900 block">{art.author}</span>
                    <span className="text-slate-500">{formatDateIndonesian(art.publishedDate)}</span>
                  </td>
                  <td className="p-4 sm:px-6">
                    <Badge variant={art.status === "published" ? "success" : "secondary"}>
                      {art.status === "published" ? "Terbit" : "Draf"}
                    </Badge>
                  </td>
                  <td className="p-4 sm:px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(art)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Edit Artikel"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(art.id, art.title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
        maxWidth="2xl"
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
            placeholder="Contoh: Santri Yazzaka Raih Medali Emas OSN 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Kategori Berita
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Article["category"])}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="published">Terbitkan Langsung (Published)</option>
                <option value="draft">Simpan Sebagai Draf (Draft)</option>
              </select>
            </div>
          </div>

          <Input
            label="URL Foto Sampul (Cover Image)"
            required
            placeholder="https://images.unsplash.com/..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
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
