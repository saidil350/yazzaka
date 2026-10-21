"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { ContactMessage } from "@/lib/types";
import {
  Trash2,
  MessageCircle,
  Clock,
  Inbox,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

// Helper status format & config
const STATUS_CONFIG: Record<
  ContactMessage["status"],
  {
    label: string;
    badgeVariant: "default" | "secondary" | "outline";
  }
> = {
  new: {
    label: "Baru",
    badgeVariant: "default",
  },
  read: {
    label: "Sudah Dibaca",
    badgeVariant: "secondary",
  },
  replied: {
    label: "Sudah Dibalas",
    badgeVariant: "default",
  },
  archived: {
    label: "Diarsipkan",
    badgeVariant: "outline",
  },
};

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "-";
  // If format is like '2026-08-22 10:15'
  const parts = dateStr.split(" ");
  if (parts.length === 2) {
    const [d, t] = parts;
    const [year, month, day] = d.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const mName = months[parseInt(month, 10) - 1] || month;
    return `${day} ${mName} ${year}, ${t} WIB`;
  }
  return dateStr;
}

export default function AdminContactInboxPage() {
  const { messages, updateMessageStatus, deleteMessage } = useSchoolData();
  const { toast } = useToast();

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === "new") {
      updateMessageStatus(msg.id, "read");
    }
  };

  const handleStatusChange = (
    id: string,
    status: ContactMessage["status"]
  ) => {
    updateMessageStatus(id, status);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status });
    }
    toast(`Status pesan diperbarui ke "${STATUS_CONFIG[status]?.label || status}"`, "info");
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pesan ini dari kotak masuk?")) {
      deleteMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast("Pesan berhasil dihapus dari kotak masuk.", "info");
    }
  };

  const filtered = messages.filter((m) => {
    if (filterStatus === "all") return true;
    return m.status === filterStatus;
  });

  const countNew = messages.filter((m) => m.status === "new").length;
  const countRead = messages.filter((m) => m.status === "read").length;
  const countReplied = messages.filter((m) => m.status === "replied").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
            Website Settings / Pesan Masuk
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Kotak Pesan &amp; Konsultasi
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Daftar pertanyaan publik dan permohonan konsultasi pendaftaran santri baru dari formulir website.
          </p>
        </div>

        {/* Quick Summary Pill */}
        {countNew > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium self-start sm:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>{countNew} pesan baru butuh respon</span>
          </div>
        )}
      </div>

      {/* ── Filter Tabs Segmented Control ───────────────────────────── */}
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1 w-fit max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
            filterStatus === "all"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Semua Pesan</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
              filterStatus === "all"
                ? "bg-muted text-foreground"
                : "bg-background text-muted-foreground"
            }`}
          >
            {messages.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("new")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
            filterStatus === "new"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Baru</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
              countNew > 0
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground"
            }`}
          >
            {countNew}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("read")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
            filterStatus === "read"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Dibaca</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-background text-muted-foreground">
            {countRead}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("replied")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer whitespace-nowrap ${
            filterStatus === "replied"
              ? "bg-card shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Sudah Dibalas</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-background text-muted-foreground">
            {countReplied}
          </span>
        </button>
      </div>

      {/* ── Messages List Container ─────────────────────────────────── */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Inbox}
              title="Tidak Ada Pesan Masuk"
              description={
                filterStatus !== "all"
                  ? `Tidak ada pesan dengan status "${(STATUS_CONFIG as Record<string, { label: string }>)[filterStatus]?.label || filterStatus}".`
                  : "Kotak pesan masuk konsultasi publik masih kosong."
              }
              action={
                filterStatus !== "all"
                  ? {
                      label: "Tampilkan Semua Pesan",
                      onClick: () => setFilterStatus("all"),
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-border" role="list">
            {filtered.map((msg) => {
              const isNew = msg.status === "new";
              const isReplied = msg.status === "replied";

              return (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => handleOpenDetail(msg)}
                  className={`w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 transition-colors duration-150 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
                    isNew
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  {/* Left Column: Avatar/Indicator & Text Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Status Dot / Unread Indicator */}
                    <div className="pt-1 shrink-0">
                      {isNew ? (
                        <span
                          className="flex h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20"
                          title="Pesan baru belum dibaca"
                        />
                      ) : isReplied ? (
                        <span
                          className="flex h-2.5 w-2.5 rounded-full bg-success"
                          title="Pesan sudah dibalas"
                        />
                      ) : (
                        <span
                          className="flex h-2.5 w-2.5 rounded-full bg-muted-foreground/30"
                          title="Pesan sudah dibaca"
                        />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      {/* Sender Meta */}
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                        <span className="text-sm font-medium truncate text-foreground">
                          {msg.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          • {msg.phone}
                        </span>
                      </div>

                      {/* Subject */}
                      <h3
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isNew
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {msg.subject}
                      </h3>

                      {/* Message Preview */}
                      <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed max-w-3xl">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Time & Status Badge */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{formatDisplayDate(msg.submittedAt)}</span>
                    </div>

                    <Badge
                      variant={STATUS_CONFIG[msg.status]?.badgeVariant || "secondary"}
                    >
                      {STATUS_CONFIG[msg.status]?.label || msg.status}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── Message Detail Modal ────────────────────────────────────── */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={`Detail Pesan dari ${selectedMessage.name}`}
          maxWidth="2xl"
          footer={
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(selectedMessage.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span>Hapus Pesan</span>
              </Button>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                >
                  Tutup
                </Button>
                <a
                  href={`https://wa.me/${selectedMessage.phone.replace(
                    /\D/g,
                    ""
                  )}?text=Assalamu'alaikum%20${encodeURIComponent(
                    selectedMessage.name
                  )},%20kami%20dari%20Sekretariat%20Yazzakka%20menanggapi%20pertanyaan%20Anda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleStatusChange(selectedMessage.id, "replied")}
                >
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Balas via WhatsApp</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </a>
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Meta Grid Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted rounded-lg border border-border">
              <div className="space-y-0.5">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                  Email
                </span>
                <span className="text-foreground font-medium break-all">
                  {selectedMessage.email || "-"}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                  Nomor WhatsApp / Telp
                </span>
                <span className="text-foreground font-mono font-medium">
                  {selectedMessage.phone}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
                  Waktu Pengiriman
                </span>
                <span className="text-foreground font-medium">
                  {formatDisplayDate(selectedMessage.submittedAt)}
                </span>
              </div>

              <div className="space-y-1">
                <Select
                  label="Ubah Status Pesan"
                  value={selectedMessage.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedMessage.id,
                      e.target.value as ContactMessage["status"]
                    )
                  }
                >
                  <option value="new">🔴 Baru (New)</option>
                  <option value="read">⚪ Sudah Dibaca (Read)</option>
                  <option value="replied">🟢 Sudah Dibalas (Replied)</option>
                  <option value="archived">🟡 Diarsipkan (Archived)</option>
                </Select>
              </div>
            </div>

            {/* Subject Section */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
                Subjek Pertanyaan
              </span>
              <p className="text-base font-semibold text-foreground">
                {selectedMessage.subject}
              </p>
            </div>

            {/* Message Body Card */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
                Isi Pesan
              </span>
              <div className="p-4 bg-card rounded-lg border border-border text-foreground whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                {selectedMessage.message}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
