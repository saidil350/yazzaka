"use client";

import React, { useState, useEffect } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { formatRupiah } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  FileText,
  CheckCircle2,
  Calendar,
  Clock,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdmissionFeeItem } from "@/lib/types";

export default function AdminAdmissionPage() {
  const { admission, updateAdmission } = useSchoolData();
  const { toast } = useToast();

  const [periodName, setPeriodName] = useState(admission.periodName);
  const [academicYear, setAcademicYear] = useState(admission.academicYear);
  const [isOpen, setIsOpen] = useState(admission.isOpen);
  const [startDate, setStartDate] = useState(admission.startDate || "");
  const [endDate, setEndDate] = useState(admission.endDate || "");
  const [hideFormWhenClosed, setHideFormWhenClosed] = useState(admission.hideFormWhenClosed ?? true);
  const [closedMessage, setClosedMessage] = useState(
    admission.closedMessage ||
      "Pendaftaran santri baru untuk periode ini sedang ditutup. Untuk informasi jadwal gelombang berikutnya atau konsultasi langsung, silakan hubungi sekretariat PPDB kami melalui WhatsApp."
  );
  const [requirements, setRequirements] = useState<string[]>(admission.requirements || []);
  const [newRequirement, setNewRequirement] = useState("");

  // Sync state ketika data admission termuat atau berubah
  useEffect(() => {
    if (admission) {
      setPeriodName(admission.periodName || "");
      setAcademicYear(admission.academicYear || "");
      setIsOpen(admission.isOpen ?? true);
      setStartDate(admission.startDate || "");
      setEndDate(admission.endDate || "");
      setHideFormWhenClosed(admission.hideFormWhenClosed ?? true);
      setClosedMessage(
        admission.closedMessage ||
          "Pendaftaran santri baru untuk periode ini sedang ditutup. Untuk informasi jadwal gelombang berikutnya atau konsultasi langsung, silakan hubungi sekretariat PPDB kami melalui WhatsApp."
      );
      setRequirements(admission.requirements || []);
      setFees(admission.fees || []);
      setFaqs(admission.faqs || []);
    }
  }, [admission]);

  // Fees state
  const [fees, setFees] = useState(admission.fees);
  const [newFeeName, setNewFeeName] = useState("");
  const [newFeeAmount, setNewFeeAmount] = useState<number>(0);
  const [newFeeCategory, setNewFeeCategory] = useState<AdmissionFeeItem["category"]>("Pendaftaran");
  const [newFeeNotes, setNewFeeNotes] = useState("");

  // FAQs state
  const [faqs, setFaqs] = useState(admission.faqs);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  const [isSavingGeneral, setIsSavingGeneral] = useState(false);

  // Handler Persyaratan Berkas Poin per Poin
  const handleAddRequirement = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newRequirement.trim()) {
      toast("Teks butir persyaratan tidak boleh kosong.", "error");
      return;
    }
    const updated = [...requirements, newRequirement.trim()];
    setRequirements(updated);
    setNewRequirement("");
    try {
      await updateAdmission({ requirements: updated });
      toast("Butir persyaratan berhasil ditambahkan dan disimpan ke database!", "success");
    } catch (err) {
      console.error("Gagal menyimpan butir persyaratan:", err);
      toast("Gagal menyimpan butir persyaratan ke database.", "error");
    }
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    setRequirements((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDeleteRequirement = async (index: number) => {
    const updated = requirements.filter((_, i) => i !== index);
    setRequirements(updated);
    try {
      await updateAdmission({ requirements: updated });
      toast("Butir persyaratan berhasil dihapus dari database.", "info");
    } catch (err) {
      console.error("Gagal menghapus butir persyaratan:", err);
      toast("Gagal menghapus butir persyaratan di database.", "error");
    }
  };

  const handleMoveRequirement = async (index: number, direction: "up" | "down") => {
    const updated = [...requirements];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setRequirements(updated);
    try {
      await updateAdmission({ requirements: updated });
      toast("Urutan persyaratan berhasil diperbarui di database!", "info");
    } catch (err) {
      console.error("Gagal mengubah urutan:", err);
      toast("Gagal menyimpan perubahan urutan di database.", "error");
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGeneral(true);
    try {
      const cleanRequirements = requirements.map((r) => r.trim()).filter(Boolean);
      await updateAdmission({
        periodName,
        academicYear,
        isOpen,
        startDate,
        endDate,
        hideFormWhenClosed,
        closedMessage,
        requirements: cleanRequirements,
      });
      setRequirements(cleanRequirements);
      toast("Pengaturan pendaftaran & butir persyaratan berhasil disimpan ke database!", "success");
    } catch (err) {
      console.error("Gagal menyimpan informasi umum PPDB:", err);
      toast("Gagal menyimpan ke database. Silakan coba lagi.", "error");
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleAddFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeeName || newFeeAmount <= 0) {
      toast("Nama biaya dan nominal harus valid.", "error");
      return;
    }

    const updated = [
      ...fees,
      {
        name: newFeeName,
        amount: Number(newFeeAmount),
        category: newFeeCategory,
        notes: newFeeNotes,
      },
    ];
    setFees(updated);
    updateAdmission({ fees: updated });
    setNewFeeName("");
    setNewFeeAmount(0);
    setNewFeeNotes("");
    toast("Komponen biaya berhasil ditambahkan!", "success");
  };

  const handleDeleteFee = (index: number) => {
    const updated = fees.filter((_, i) => i !== index);
    setFees(updated);
    updateAdmission({ fees: updated });
    toast("Komponen biaya dihapus.", "info");
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ || !newFaqA) {
      toast("Pertanyaan dan jawaban FAQ wajib diisi.", "error");
      return;
    }

    const updated = [
      ...faqs,
      {
        id: `faq-${Date.now()}`,
        question: newFaqQ,
        answer: newFaqA,
        category: "Pendaftaran" as const,
      },
    ];
    setFaqs(updated);
    updateAdmission({ faqs: updated });
    setNewFaqQ("");
    setNewFaqA("");
    toast("Pertanyaan FAQ berhasil ditambahkan!", "success");
  };

  const handleDeleteFaq = (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    updateAdmission({ faqs: updated });
    toast("FAQ dihapus.", "info");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Content / Pendaftaran (PPDB)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Manajemen Penerimaan Santri Baru (PPDB)
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Kelola nama periode gelombang, persyaratan berkas, tabel biaya transparan, dan tanya jawab (FAQ).
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Informasi Umum &amp; Syarat</TabsTrigger>
          <TabsTrigger value="fees">Tabel Biaya Pendidikan</TabsTrigger>
          <TabsTrigger value="faqs">Tanya Jawab (FAQ)</TabsTrigger>
        </TabsList>

        {/* Tab 1: General & Requirements */}
        <TabsContent value="general">
          <form onSubmit={handleSaveGeneral} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
            
            {/* Status Pendaftaran Banner & Toggle */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isOpen 
                ? "bg-emerald-50/70 border-emerald-200" 
                : "bg-stone-100/80 border-stone-300"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`p-2.5 rounded-xl text-white shrink-0 ${
                    isOpen ? "bg-emerald-600 shadow-xs" : "bg-stone-500"
                  }`}>
                    {isOpen ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#1E2330]">
                        Status Pendaftaran: {isOpen ? "Sedang Dibuka" : "Sedang Ditutup"}
                      </h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isOpen 
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                          : "bg-stone-200 text-stone-700 border border-stone-300"
                      }`}>
                        {isOpen ? "Aktif" : "Tertutup"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {isOpen 
                        ? "Pendaftaran dapat diakses oleh publik dan formulir konsultasi aktif menerima pengajuan." 
                        : "Pendaftaran saat ini ditutup. Fitur pendaftaran akan menyesuaikan opsi visibilitas di bawah."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border shrink-0 ${
                    isOpen
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs"
                  }`}
                >
                  {isOpen ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Tutup Pendaftaran
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      Buka Pendaftaran
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Informasi Periode & Tanggal Pendaftaran */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 pb-1 border-b border-[#E8E2D8]">
                <Calendar className="h-4 w-4 text-[#FA6400]" />
                <h3 className="font-bold text-sm text-[#1E2330] uppercase tracking-wider text-xs">
                  Jadwal &amp; Identitas Gelombang PPDB
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Periode Pendaftaran"
                  value={periodName}
                  onChange={(e) => setPeriodName(e.target.value)}
                  placeholder="Contoh: Gelombang 1 (Reguler & Beasiswa)"
                />
                <Input
                  label="Tahun Ajaran"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="Contoh: 2026/2027"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1E2330] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-stone-500" />
                    Tanggal Pembukaan Pendaftaran
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E8E2D8] px-3.5 text-xs sm:text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]"
                  />
                  <p className="text-[11px] text-stone-500">
                    Tanggal resmi pendaftaran online dan penerimaan berkas dimulai.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1E2330] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-stone-500" />
                    Tanggal Penutupan Pendaftaran
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#E8E2D8] px-3.5 text-xs sm:text-sm bg-white text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400]"
                  />
                  <p className="text-[11px] text-stone-500">
                    Batas akhir pendaftaran online dan penyerahan berkas calon santri.
                  </p>
                </div>
              </div>
            </div>

            {/* Pengaturan Visibilitas Saat Pendaftaran Ditutup */}
            <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
              <div className="flex items-center gap-2 pb-1">
                <EyeOff className="h-4 w-4 text-stone-600" />
                <h3 className="font-bold text-sm text-[#1E2330] uppercase tracking-wider text-xs">
                  Pengaturan Visibilitas Saat Pendaftaran Ditutup
                </h3>
              </div>

              {/* Toggle Sembunyikan Formulir */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#1E2330]">
                      Sembunyikan Formulir Pendaftaran / Konsultasi Saat Ditutup
                    </span>
                    {hideFormWhenClosed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF0E5] text-[#FA6400] border border-[#FED7AA]">
                        Auto-Hide Aktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600">
                    Jika diaktifkan dan pendaftaran ditutup, formulir pengajuan di halaman publik akan disembunyikan dan digantikan dengan kartu pemberitahuan pendaftaran ditutup.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={hideFormWhenClosed}
                    onChange={(e) => setHideFormWhenClosed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FA6400]"></div>
                </label>
              </div>

              {/* Pesan Kustom Pengumuman Penutupan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E2330] block">
                  Pesan Pengumuman Ketika Pendaftaran Ditutup
                </label>
                <Textarea
                  rows={2}
                  value={closedMessage}
                  onChange={(e) => setClosedMessage(e.target.value)}
                  placeholder="Tuliskan pesan penjelasan yang akan tampil kepada wali santri saat pendaftaran ditutup..."
                />
                <p className="text-[11px] text-stone-500">
                  Pesan ini akan ditampilkan di halaman informasi PPDB untuk mengarahkan wali santri ke sekretariat atau gelombang pendaftaran berikutnya.
                </p>
              </div>
            </div>

            {/* Daftar Persyaratan Berkas Poin per Poin */}
            <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1E2330] block">
                    Daftar Persyaratan Berkas (Poin per Poin)
                  </label>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Kelola butir dokumen administrasi pendaftaran secara terpisah. Setiap poin dapat diedit langsung, diurutkan, atau dihapus.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF6EE] border border-[#E8E2D8] text-stone-700 w-fit">
                  {requirements.length} Butir Dokumen
                </span>
              </div>

              {/* List Poin */}
              <div className="space-y-2.5">
                {requirements.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-[#FAF6EE] border border-dashed border-[#E8E2D8] text-stone-500 text-xs sm:text-sm">
                    Belum ada butir persyaratan berkas. Tulis butir persyaratan di bawah lalu klik tombol Tambah.
                  </div>
                ) : (
                  requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#FAF6EE] border border-[#E8E2D8] group hover:border-[#FA6400]/40 transition-colors"
                    >
                      <span className="h-7 w-7 rounded-xl bg-[#FA6400] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                        className="flex-1 bg-white border border-[#E8E2D8] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#1E2330] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6400] focus:border-transparent"
                        placeholder={`Tulis butir persyaratan ${idx + 1}...`}
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveRequirement(idx, "up")}
                          className="p-1.5 text-stone-400 hover:text-[#1E2330] hover:bg-stone-200/60 rounded-lg disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-stone-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Pindah ke Atas"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === requirements.length - 1}
                          onClick={() => handleMoveRequirement(idx, "down")}
                          className="p-1.5 text-stone-400 hover:text-[#1E2330] hover:bg-stone-200/60 rounded-lg disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-stone-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Pindah ke Bawah"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRequirement(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Butir Persyaratan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form Input Tambah Poin Baru */}
              <div className="flex gap-2 sm:gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Ketik butir persyaratan baru (misal: Pasfoto 3x4 latar biru 4 lembar)..."
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                  className="flex-1 h-11 rounded-xl border border-[#E8E2D8] px-4 text-xs sm:text-sm bg-white text-[#1E2330] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FA6400]"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="default"
                  onClick={handleAddRequirement}
                  className="shrink-0 font-bold h-11 px-4 sm:px-5 border border-[#E8E2D8] hover:bg-[#FAF6EE]"
                >
                  <Plus className="h-4 w-4 mr-1 text-[#FA6400]" />
                  Tambah Poin
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E8E2D8]">
              <Button
                type="submit"
                variant="default"
                size="default"
                disabled={isSavingGeneral}
                className="font-bold h-11 px-6 shadow-sm disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              >
                <Save className={`h-4 w-4 ${isSavingGeneral ? "animate-spin" : ""}`} />
                {isSavingGeneral ? "Menyimpan ke Database..." : "Simpan Informasi PPDB"}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Fees Breakdown */}
        <TabsContent value="fees" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#1E2330]">
              Tambah Komponen Biaya Baru
            </h3>
            <form onSubmit={handleAddFee} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <Input
                label="Nama Komponen Biaya"
                required
                placeholder="Contoh: Infaq Gedung"
                value={newFeeName}
                onChange={(e) => setNewFeeName(e.target.value)}
              />
              <Input
                label="Nominal (Rp)"
                type="number"
                required
                placeholder="1500000"
                value={newFeeAmount || ""}
                onChange={(e) => setNewFeeAmount(Number(e.target.value))}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E2330] block">
                  Kategori
                </label>
                <select
                  value={newFeeCategory}
                  onChange={(e) => setNewFeeCategory(e.target.value as AdmissionFeeItem["category"])}
                  className="w-full h-11 rounded-xl border border-[#E8E2D8] px-3 text-xs sm:text-sm bg-white text-[#1E2330] focus:outline-none focus:ring-2 focus:ring-[#FA6400] font-medium"
                >
                  <option value="Pendaftaran">Pendaftaran</option>
                  <option value="Uang Pangkal / Sarpras">Uang Pangkal / Sarpras</option>
                  <option value="SPP Bulanan">SPP Bulanan</option>
                  <option value="Seragam & Kit Santri">Seragam &amp; Kit Santri</option>
                </select>
              </div>
              <Button type="submit" variant="default" size="default" className="w-full font-bold h-11 shadow-sm">
                <Plus className="h-4 w-4" />
                Tambah Biaya
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6EE] border-b border-[#E8E2D8] text-xs font-bold uppercase text-stone-500">
                <tr>
                  <th className="p-4 sm:px-6">Nama Komponen</th>
                  <th className="p-4 sm:px-6">Kategori</th>
                  <th className="p-4 sm:px-6 text-right">Nominal</th>
                  <th className="p-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-stone-700 bg-white">
                {fees.map((fee, idx) => (
                  <tr key={idx} className="hover:bg-[#FFF9F2] transition-colors">
                    <td className="p-4 sm:px-6 font-bold text-[#1E2330]">{fee.name}</td>
                    <td className="p-4 sm:px-6 text-xs font-semibold text-stone-600">
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF6EE] border border-[#E8E2D8] text-stone-700">
                        {fee.category}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6 text-right font-extrabold text-[#FA6400]">
                      {formatRupiah(fee.amount)}
                    </td>
                    <td className="p-4 sm:px-6 text-right">
                      <button
                        onClick={() => handleDeleteFee(idx)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Hapus Komponen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Tab 3: FAQs */}
        <TabsContent value="faqs" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#1E2330]">
              Tambah Tanya Jawab (FAQ) Baru
            </h3>
            <form onSubmit={handleAddFaq} className="space-y-4">
              <Input
                label="Pertanyaan"
                required
                placeholder="Contoh: Kapan waktu kunjungan orang tua ke asrama?"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
              />
              <Textarea
                label="Jawaban Lengkap"
                rows={3}
                required
                placeholder="Tuliskan jawaban yang ramah dan jelas bagi wali santri..."
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
              />
              <Button type="submit" variant="default" size="default" className="font-bold h-11 px-6 shadow-sm">
                <Plus className="h-4 w-4" />
                Tambah FAQ
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E2D8] shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-[#1E2330]">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl shrink-0 transition-colors cursor-pointer"
                  title="Hapus FAQ"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
