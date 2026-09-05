"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { ContactMessage } from "@/lib/types";
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  ExternalLink,
  MessageCircle,
  Clock,
  Inbox,
  Filter,
  Eye,
  Check,
  Archive,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

// Helper status format & config
const STATUS_CONFIG: Record<
  ContactMessage["status"],
  {
    label: string;
    badgeVariant: "destructive" | "default" | "secondary" | "outline";
    chipClass: string;
  }
> = {
  new: {
    label: "Baru",
    badgeVariant: "destructive",
    chipClass: "bg-rose-500/10 text-rose-600 border-rose-200",
  },
  read: {
    label: "Sudah Dibaca",
    badgeVariant: "secondary",
    chipClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
  replied: {
    label: "Sudah Dibalas",
    badgeVariant: "default",
    chipClass: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  archived: {
    label: "Diarsipkan",
    badgeVariant: "outline",
    chipClass: "bg-amber-500/10 text-amber-700 border-amber-200",
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
            Website Settings / Pesan Masuk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E2330]">
            Kotak Pesan &amp; Konsultasi
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed font-medium">
            Daftar pertanyaan publik dan permohonan konsultasi pendaftaran santri baru dari formulir website.
          </p>
        </div>

        {/* Quick Summary Pill */}
        {countNew > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] text-xs font-bold self-start sm:self-auto shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA6400] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FA6400]"></span>
            </span>
            <span>{countNew} pesan baru butuh respon</span>
          </div>
        )}
      </div>

      {/* ── Filter Tabs Segmented Control ───────────────────────────── */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF6EE] rounded-lg w-fit max-w-full overflow-x-auto border border-[#E8E2D8]">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
            filterStatus === "all"
              ? "bg-white text-[#1E2330] shadow-xs border border-[#E8E2D8]"
              : "text-stone-600 hover:text-[#1E2330] hover:bg-white/60"
          }`}
        >
          <span>Semua Pesan</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              filterStatus === "all"
                ? "bg-[#FAF6EE] text-[#1E2330]"
                : "bg-stone-200/80 text-stone-600"
            }`}
          >
            {messages.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("new")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
            filterStatus === "new"
              ? "bg-white text-[#FA6400] shadow-xs border border-[#FED7AA]"
              : "text-stone-600 hover:text-[#FA6400] hover:bg-white/60"
          }`}
        >
          <span>Baru</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              countNew > 0
                ? "bg-[#FA6400] text-white shadow-xs"
                : "bg-stone-200/80 text-stone-600"
            }`}
          >
            {countNew}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("read")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
            filterStatus === "read"
              ? "bg-white text-[#1E2330] shadow-xs border border-[#E8E2D8]"
              : "text-stone-600 hover:text-[#1E2330] hover:bg-white/60"
          }`}
        >
          <span>Dibaca</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF6EE] text-stone-700">
            {countRead}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus("replied")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
            filterStatus === "replied"
              ? "bg-white text-emerald-800 shadow-xs border border-emerald-200"
              : "text-stone-600 hover:text-emerald-800 hover:bg-white/60"
          }`}
        >
          <span>Sudah Dibalas</span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
            {countReplied}
          </span>
        </button>
      </div>

      {/* ── Messages List Container ─────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-[#E8E2D8] shadow-xs overflow-hidden">
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
          <div className="divide-y divide-[#E8E2D8]" role="list">
            {filtered.map((msg) => {
              const isNew = msg.status === "new";
              const isReplied = msg.status === "replied";

              return (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => handleOpenDetail(msg)}
                  className={`w-full text-left p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 transition-all duration-150 ease-out cursor-pointer active:scale-[0.998] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FA6400] ${
                    isNew
                      ? "bg-[#FFF0E5]/50 hover:bg-[#FFF0E5]/80"
                      : "bg-white hover:bg-[#FFF9F2]"
                  }`}
                >
                  {/* Left Column: Avatar/Indicator & Text Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Status Dot / Unread Indicator */}
                    <div className="pt-1 shrink-0">
                      {isNew ? (
                        <span
                          className="flex h-2.5 w-2.5 rounded-full bg-[#FA6400] ring-4 ring-[#FED7AA]"
                          title="Pesan baru belum dibaca"
                        />
                      ) : isReplied ? (
                        <span
                          className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"
                          title="Pesan sudah dibalas"
                        />
                      ) : (
                        <span
                          className="flex h-2.5 w-2.5 rounded-full bg-stone-300"
                          title="Pesan sudah dibaca"
                        />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      {/* Sender Meta */}
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                        <span
                          className={`text-sm font-bold truncate ${
                            isNew ? "text-[#1E2330]" : "text-stone-800"
                          }`}
                        >
                          {msg.name}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          • {msg.phone}
                        </span>
                      </div>

                      {/* Subject */}
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isNew
                            ? "text-[#FA6400]"
                            : "text-[#1E2330]"
                        }`}
                      >
                        {msg.subject}
                      </h3>

                      {/* Message Preview */}
                      <p className="text-xs text-stone-500 line-clamp-1 leading-relaxed max-w-3xl font-medium">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Time & Status Badge */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E2D8]">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{formatDisplayDate(msg.submittedAt)}</span>
                    </div>

                    <Badge
                      variant={STATUS_CONFIG[msg.status]?.badgeVariant || "secondary"}
                      className="text-[10px] font-bold tracking-wide"
                    >
                      {STATUS_CONFIG[msg.status]?.label || msg.status}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Message Detail Modal ────────────────────────────────────── */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title={`Detail Pesan dari ${selectedMessage.name}`}
          maxWidth="2xl"
          footer={
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage.id)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span>Hapus Pesan</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-full"
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
                    className="font-bold shadow-xs rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAF6EE] rounded-lg border border-[#E8E2D8]">
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  Email
                </span>
                <span className="text-[#1E2330] font-bold break-all">
                  {selectedMessage.email || "-"}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  Nomor WhatsApp / Telp
                </span>
                <span className="text-[#1E2330] font-mono font-bold">
                  {selectedMessage.phone}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  Waktu Pengiriman
                </span>
                <span className="text-stone-700 font-medium">
                  {formatDisplayDate(selectedMessage.submittedAt)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  Ubah Status Pesan
                </span>
                <select
                  value={selectedMessage.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedMessage.id,
                      e.target.value as ContactMessage["status"]
                    )
                  }
                  className="w-full bg-white text-xs font-bold rounded-xl px-2.5 py-1.5 border border-[#E8E2D8] text-[#1E2330] focus:outline-none focus:ring-2 focus:ring-[#FA6400]"
                >
                  <option value="new">🔴 Baru (New)</option>
                  <option value="read">⚪ Sudah Dibaca (Read)</option>
                  <option value="replied">🟢 Sudah Dibalas (Replied)</option>
                  <option value="archived">🟡 Diarsipkan (Archived)</option>
                </select>
              </div>
            </div>

            {/* Subject Section */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FA6400] block">
                Subjek Pertanyaan
              </span>
              <p className="text-base font-bold text-[#1E2330]">
                {selectedMessage.subject}
              </p>
            </div>

            {/* Message Body Card */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500 block">
                Isi Pesan
              </span>
              <div className="p-4 bg-white rounded-lg border border-[#E8E2D8] text-[#1E2330] whitespace-pre-line leading-relaxed text-xs sm:text-sm font-medium">
                {selectedMessage.message}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
