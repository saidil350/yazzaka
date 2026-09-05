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
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
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
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Content / Berita &amp; Artikel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
            Manajemen Berita &amp; Publikasi
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Tulis, sunting, jadwalkan, atau arsipkan artikel wawasan dan liputan kegiatan sekolah.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="default" size="default" className="shrink-0 font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all">
          <Plus className="h-4 w-4" />
          <span>Tulis Berita Baru</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 px-4 rounded-lg border border-[#E8E2D8] shadow-xs flex items-center gap-3">
        <Search className="h-4 w-4 text-[#FA6400] shrink-0" />
        <input
          type="text"
          placeholder="Cari judul artikel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm focus:outline-none bg-transparent text-[#1E2330] placeholder:text-stone-400 font-medium"
        />
      </div>

      {/* Articles Table / List */}
      <div className="bg-white rounded-xl border border-[#E8E2D8] overflow-hidden shadow-xs">
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
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6EE] border-b border-[#E8E2D8] text-xs font-bold uppercase text-stone-500">
                <tr>
                  <th className="p-4 sm:px-6">Cover &amp; Judul</th>
                  <th className="p-4 sm:px-6">Kategori</th>
                  <th className="p-4 sm:px-6">Penulis &amp; Tanggal</th>
                  <th className="p-4 sm:px-6">Status</th>
                  <th className="p-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
                {filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="flex items-center gap-3 max-w-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="h-12 w-16 object-cover rounded-xl shrink-0 border border-[#E8E2D8] bg-[#FAF6EE]"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-[#1E2330] line-clamp-1 leading-snug">
                            {art.title}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-medium">
                            {art.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:px-6">
                      <span className="px-3 py-1 rounded-full bg-[#FAF6EE] text-stone-700 border border-[#E8E2D8] text-xs font-bold shadow-2xs">
                        {art.category}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 text-xs space-y-0.5">
                      <span className="font-bold text-[#1E2330] block">{art.author}</span>
                      <span className="text-stone-500">{formatDateIndonesian(art.publishedDate)}</span>
                    </td>
                    <td className="p-4 sm:px-6">
                      <Badge variant={art.status === "published" ? "default" : "secondary"}>
                        {art.status === "published" ? "Terbit" : "Draf"}
                      </Badge>
                    </td>
                    <td className="p-4 sm:px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="p-2 rounded-full text-stone-600 hover:bg-[#FFF0E5] hover:text-[#FA6400] transition-colors cursor-pointer"
                        title="Edit Artikel"
                        aria-label="Edit Artikel"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-2 rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Hapus Artikel"
                        aria-label="Hapus Artikel"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Kategori Berita
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Article["category"])}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] block">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]/25 focus:border-[#FA6400] shadow-xs"
              >
                <option value="published">Terbitkan Langsung (Published)</option>
                <option value="draft">Simpan Sebagai Draf (Draft)</option>
              </select>
            </div>
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
