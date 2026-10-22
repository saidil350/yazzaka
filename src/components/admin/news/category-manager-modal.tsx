"use client";

import React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NewsCategory } from "@/lib/news/types";

/**
 * Kelola kategori berita (khusus super_admin): tambah, ubah nama,
 * hapus (ditolak server bila masih dipakai artikel).
 */
export function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onChanged,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: NewsCategory[];
  onChanged: () => void;
}) {
  const [newName, setNewName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const request = async (url: string, method: string, body?: unknown) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Aksi gagal.");
      onChanged();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Aksi gagal.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const ok = await request("/api/categories", "POST", { name: newName.trim() });
    if (ok) setNewName("");
  };

  const handleRename = async () => {
    if (!editingId || !editingName.trim()) return;
    const ok = await request(`/api/categories/${editingId}`, "PUT", {
      name: editingName.trim(),
    });
    if (ok) setEditingId(null);
  };

  const handleDelete = async (category: NewsCategory) => {
    await request(`/api/categories/${category.id}`, "DELETE");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kelola Kategori"
      maxWidth="md"
      footer={
        <Button variant="outline" onClick={onClose}>
          Selesai
        </Button>
      }
    >
      <div className="space-y-4">
        {error ? (
          <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void handleAdd();
          }}
        >
          <Input
            label="Kategori baru"
            placeholder="cth: Kegiatan Ramadhan"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit" isLoading={isSaving} disabled={!newName.trim()}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah
          </Button>
        </form>

        <ul className="divide-y divide-border rounded-md border border-border">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-2 p-2.5">
              {editingId === category.id ? (
                <>
                  <Input
                    aria-label={`Nama baru untuk ${category.name}`}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <Button size="sm" onClick={handleRename} isLoading={isSaving}>
                    Simpan
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                    Batal
                  </Button>
                </>
              ) : (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {category.articleCount} artikel
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Ubah nama ${category.name}`}
                    title="Ubah nama"
                    onClick={() => {
                      setEditingId(category.id);
                      setEditingName(category.name);
                    }}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Hapus ${category.name}`}
                    title="Hapus"
                    className="text-destructive hover:text-destructive"
                    onClick={() => void handleDelete(category)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
