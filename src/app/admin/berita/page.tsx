"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  Eye,
  FileEdit,
  MoreHorizontal,
  Newspaper,
  Plus,
  RotateCcw,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import { formatDateIndonesian } from "@/lib/utils";
import type { Article, NewsCategory, NewsStatus } from "@/lib/news/types";
import { NEWS_STATUS_LABEL } from "@/lib/news/types";

type StatusFilter = "all" | NewsStatus;

const TAB_STATUSES: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "draft", label: "Draf" },
  { value: "pending_review", label: "Menunggu Tinjau" },
  { value: "published", label: "Terbit" },
  { value: "archived", label: "Arsip" },
];

const PAGE_SIZE = 15;

export default function AdminBeritaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { role, currentUser } = useAuth();
  const isSuperAdmin = role === "super_admin";

  const [items, setItems] = React.useState<Article[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [categorySlug, setCategorySlug] = React.useState("");
  const [categories, setCategories] = React.useState<NewsCategory[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [reloadTick, setReloadTick] = React.useState(0);

  // Debounce pencarian
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  React.useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = (await res.json()) as { items: NewsCategory[] };
          setCategories(data.items);
        }
      } catch {
        // filter kategori tetap kosong
      }
    })();
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams({
      scope: "admin",
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    if (search) params.set("q", search);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (categorySlug) params.set("category", categorySlug);

    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/articles?${params.toString()}`);
        if (!active) return;
        if (!res.ok) throw new Error("gagal memuat");
        const data = (await res.json()) as {
          items: Article[];
          total: number;
          page: number;
          totalPages: number;
        };
        if (!active) return;
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {
        if (active) toast("Gagal memuat daftar berita.", "error");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [page, search, statusFilter, categorySlug, toast, reloadTick]);

  const reload = () => setReloadTick((tick) => tick + 1);

  const transition = async (article: Article, action: string, successMessage: string) => {
    try {
      const res = await fetch(`/api/articles/${article.id}/transition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Aksi gagal.");
      toast(successMessage, "success");
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Aksi gagal.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Gagal menghapus berita.");
      toast(`Berita "${deleteTarget.title}" dihapus.`, "success");
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Gagal menghapus berita.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = (article: Article) =>
    Boolean(currentUser?.id) && article.authorId === currentUser?.id;

  const canEdit = (article: Article) => isSuperAdmin || isOwner(article);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Konten</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Berita &amp; Artikel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola berita: tulis, tinjau, terbitkan, dan arsipkan. Total{" "}
            {total} berita.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/berita/baru")}>
          <Plus className="size-4" aria-hidden="true" />
          Tulis Berita
        </Button>
      </div>

      {/* Filter */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as StatusFilter);
            setPage(1);
          }}
        >
          <TabsList>
            {TAB_STATUSES.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="w-full sm:w-64">
            <Select
              aria-label="Filter kategori"
              value={categorySlug}
              onChange={(e) => {
                setCategorySlug(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Cari judul berita..."
              aria-label="Cari judul berita"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="size-4 text-muted-foreground" aria-hidden="true" />}
            />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Newspaper}
              title="Belum Ada Berita"
              description="Belum ada berita pada filter ini. Mulai dengan menulis berita pertama."
              action={{
                label: "Tulis Berita",
                href: "/admin/berita/baru",
              }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Judul</TableHead>
                <TableHead className="text-left">Kategori</TableHead>
                <TableHead className="text-left">Penulis</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-64 p-4 sm:px-6">
                    <Link
                      href={`/admin/berita/${article.id}/edit`}
                      className="block truncate font-medium text-foreground hover:text-primary"
                      title={article.title}
                    >
                      {article.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">/berita/{article.slug}</span>
                  </TableCell>
                  <TableCell className="p-4 text-sm sm:px-6">
                    {article.category || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="p-4 text-sm sm:px-6">{article.author || "—"}</TableCell>
                  <TableCell className="p-4 sm:px-6">
                    <Badge
                      variant={
                        article.status === "published"
                          ? "default"
                          : article.status === "pending_review"
                            ? "outline"
                            : article.status === "archived"
                              ? "secondary"
                              : "secondary"
                      }
                    >
                      {NEWS_STATUS_LABEL[article.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground sm:px-6">
                    {formatDateIndonesian(article.publishedDate)}
                  </TableCell>
                  <TableCell className="p-4 text-right sm:px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Aksi untuk ${article.title}`}
                        >
                          <MoreHorizontal className="size-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a
                            href={`/admin/berita/${article.id}/pratinjau`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="size-4" aria-hidden="true" />
                            Pratinjau
                          </a>
                        </DropdownMenuItem>
                        {canEdit(article) ? (
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/berita/${article.id}/edit`}>
                              <FileEdit className="size-4" aria-hidden="true" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        ) : null}

                        <DropdownMenuSeparator />

                        {article.status === "draft" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              void transition(article, "submit", "Berita dikirim untuk ditinjau.")
                            }
                          >
                            <Send className="size-4" aria-hidden="true" />
                            Kirim untuk Ditinjau
                          </DropdownMenuItem>
                        ) : null}
                        {isSuperAdmin && article.status !== "published" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              void transition(article, "publish", "Berita diterbitkan.")
                            }
                          >
                            <Send className="size-4" aria-hidden="true" />
                            Terbitkan
                          </DropdownMenuItem>
                        ) : null}
                        {(isSuperAdmin && article.status !== "draft") ||
                        (!isSuperAdmin && isOwner(article) && article.status === "pending_review") ? (
                          <DropdownMenuItem
                            onClick={() =>
                              void transition(article, "revert_to_draft", "Berita dikembalikan ke draf.")
                            }
                          >
                            <RotateCcw className="size-4" aria-hidden="true" />
                            Kembalikan ke Draf
                          </DropdownMenuItem>
                        ) : null}
                        {isSuperAdmin && article.status !== "archived" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              void transition(article, "archive", "Berita diarsipkan.")
                            }
                          >
                            <Archive className="size-4" aria-hidden="true" />
                            Arsipkan
                          </DropdownMenuItem>
                        ) : null}

                        {(isSuperAdmin || (isOwner(article) && article.status === "draft")) ? (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(article)}
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                              Hapus
                            </DropdownMenuItem>
                          </>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Paginasi */}
      {totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      ) : null}

      {/* Konfirmasi hapus */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Berita"
        description={`Tindakan ini tidak dapat dibatalkan. Berita "${deleteTarget?.title ?? ""}" akan dihapus permanen.`}
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={isDeleting}>
              Hapus Berita
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Berkas lampiran dan gambar tidak ikut terhapus — tetap tersedia di
          library media dan dapat dihapus manual.
        </p>
      </Modal>
    </div>
  );
}
