"use client";

import React, { useState, useEffect } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { formatRupiah, generateId } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  Lock,
  Unlock,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const handleAddFee = async (e: React.FormEvent) => {
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
    try {
      await updateAdmission({ fees: updated });
      setNewFeeName("");
      setNewFeeAmount(0);
      setNewFeeNotes("");
      toast("Komponen biaya berhasil ditambahkan!", "success");
    } catch {
      toast("Gagal menambahkan komponen biaya. Coba lagi.", "error");
    }
  };

  const handleDeleteFee = async (index: number) => {
    const updated = fees.filter((_, i) => i !== index);
    setFees(updated);
    try {
      await updateAdmission({ fees: updated });
      toast("Komponen biaya dihapus.", "info");
    } catch {
      toast("Gagal menghapus komponen biaya. Coba lagi.", "error");
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ || !newFaqA) {
      toast("Pertanyaan dan jawaban FAQ wajib diisi.", "error");
      return;
    }

    const updated = [
      ...faqs,
      {
        id: generateId("faq"),
        question: newFaqQ,
        answer: newFaqA,
        category: "Pendaftaran" as const,
      },
    ];
    setFaqs(updated);
    try {
      await updateAdmission({ faqs: updated });
      setNewFaqQ("");
      setNewFaqA("");
      toast("Pertanyaan FAQ berhasil ditambahkan!", "success");
    } catch {
      toast("Gagal menambahkan FAQ. Coba lagi.", "error");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    try {
      await updateAdmission({ faqs: updated });
      toast("FAQ dihapus.", "info");
    } catch {
      toast("Gagal menghapus FAQ. Coba lagi.", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block mb-1">
          Content / Pendaftaran (PPDB)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Manajemen Penerimaan Santri Baru (PPDB)
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
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
          <form onSubmit={handleSaveGeneral} className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-6">
            
            {/* Status Pendaftaran Banner & Toggle */}
            <div className={`p-4 sm:p-5 rounded-lg border transition-colors ${
              isOpen
                ? "bg-success-bg border-success/20"
                : "bg-muted border-border"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`p-2.5 rounded-md text-white shrink-0 ${
                    isOpen ? "bg-success" : "bg-muted-foreground"
                  }`}>
                    {isOpen ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground">
                        Status Pendaftaran: {isOpen ? "Sedang Dibuka" : "Sedang Ditutup"}
                      </h3>
                      <Badge
                        variant={isOpen ? "outline" : "secondary"}
                        className={isOpen ? "bg-success-bg text-success border-success/20" : undefined}
                      >
                        {isOpen ? "Aktif" : "Tertutup"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isOpen 
                        ? "Pendaftaran dapat diakses oleh publik dan formulir konsultasi aktif menerima pengajuan." 
                        : "Pendaftaran saat ini ditutup. Fitur pendaftaran akan menyesuaikan opsi visibilitas di bawah."}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={isOpen ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  className="shrink-0"
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
                </Button>
              </div>
            </div>

            {/* Informasi Periode & Tanggal Pendaftaran */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-2 pb-1 border-b border-border">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
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
                <div>
                  <Input
                    type="date"
                    label="Tanggal Pembukaan Pendaftaran"
                    icon={<Clock className="h-3.5 w-3.5" />}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    helperText="Tanggal resmi pendaftaran online dan penerimaan berkas dimulai."
                  />
                </div>

                <div>
                  <Input
                    type="date"
                    label="Tanggal Penutupan Pendaftaran"
                    icon={<Clock className="h-3.5 w-3.5" />}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    helperText="Batas akhir pendaftaran online dan penyerahan berkas calon santri."
                  />
                </div>
              </div>
            </div>

            {/* Pengaturan Visibilitas Saat Pendaftaran Ditutup */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 pb-1">
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                  Pengaturan Visibilitas Saat Pendaftaran Ditutup
                </h3>
              </div>

              {/* Toggle Sembunyikan Formulir */}
              <div className="p-4 rounded-lg bg-muted border border-border flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs sm:text-sm text-foreground">
                      Sembunyikan Formulir Pendaftaran / Konsultasi Saat Ditutup
                    </span>
                    {hideFormWhenClosed && (
                      <Badge variant="secondary">
                        Auto-Hide Aktif
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
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
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Pesan Kustom Pengumuman Penutupan */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-foreground block">
                  Pesan Pengumuman Ketika Pendaftaran Ditutup
                </label>
                <Textarea
                  rows={2}
                  value={closedMessage}
                  onChange={(e) => setClosedMessage(e.target.value)}
                  placeholder="Tuliskan pesan penjelasan yang akan tampil kepada wali santri saat pendaftaran ditutup..."
                />
                <p className="text-[11px] text-muted-foreground">
                  Pesan ini akan ditampilkan di halaman informasi PPDB untuk mengarahkan wali santri ke sekretariat atau gelombang pendaftaran berikutnya.
                </p>
              </div>
            </div>

            {/* Daftar Persyaratan Berkas Poin per Poin */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-foreground block">
                    Daftar Persyaratan Berkas (Poin per Poin)
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Kelola butir dokumen administrasi pendaftaran secara terpisah. Setiap poin dapat diedit langsung, diurutkan, atau dihapus.
                  </p>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {requirements.length} Butir Dokumen
                </Badge>
              </div>

              {/* List Poin */}
              <div className="space-y-2.5">
                {requirements.length === 0 ? (
                  <div className="p-6 text-center rounded-lg bg-muted border border-dashed border-border text-muted-foreground text-xs sm:text-sm">
                    Belum ada butir persyaratan berkas. Tulis butir persyaratan di bawah lalu klik tombol Tambah.
                  </div>
                ) : (
                  requirements.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted border border-border transition-colors"
                    >
                      <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <Input
                        type="text"
                        value={req}
                        onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                        className="flex-1"
                        placeholder={`Tulis butir persyaratan ${idx + 1}...`}
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={idx === 0}
                          onClick={() => handleMoveRequirement(idx, "up")}
                          title="Pindah ke Atas"
                          aria-label="Pindah ke Atas"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={idx === requirements.length - 1}
                          onClick={() => handleMoveRequirement(idx, "down")}
                          title="Pindah ke Bawah"
                          aria-label="Pindah ke Bawah"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteRequirement(idx)}
                          className="text-destructive hover:text-destructive"
                          title="Hapus Butir Persyaratan"
                          aria-label="Hapus Butir Persyaratan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form Input Tambah Poin Baru */}
              <div className="flex gap-2 sm:gap-3 pt-2">
                <Input
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
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddRequirement}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Poin
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={isSavingGeneral}
              >
                <Save className={`h-4 w-4 ${isSavingGeneral ? "animate-spin" : ""}`} />
                {isSavingGeneral ? "Menyimpan ke Database..." : "Simpan Informasi PPDB"}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Fees Breakdown */}
        <TabsContent value="fees" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-base text-foreground">
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
              <Select
                label="Kategori"
                value={newFeeCategory}
                onChange={(e) => setNewFeeCategory(e.target.value as AdmissionFeeItem["category"])}
              >
                <option value="Pendaftaran">Pendaftaran</option>
                <option value="Uang Pangkal / Sarpras">Uang Pangkal / Sarpras</option>
                <option value="SPP Bulanan">SPP Bulanan</option>
                <option value="Seragam & Kit Santri">Seragam &amp; Kit Santri</option>
              </Select>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4" />
                Tambah Biaya
              </Button>
            </form>
          </Card>

          <Card className="overflow-hidden">
            <Table className="text-left">
              <TableHeader>
                <tr>
                  <TableHead className="p-4 sm:px-6">Nama Komponen</TableHead>
                  <TableHead className="p-4 sm:px-6">Kategori</TableHead>
                  <TableHead className="p-4 sm:px-6 text-right">Nominal</TableHead>
                  <TableHead className="p-4 sm:px-6 text-right">Aksi</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {fees.map((fee, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="p-4 sm:px-6 font-medium text-foreground">{fee.name}</TableCell>
                    <TableCell className="p-4 sm:px-6">
                      <Badge variant="secondary">{fee.category}</Badge>
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-right font-semibold text-primary">
                      {formatRupiah(fee.amount)}
                    </TableCell>
                    <TableCell className="p-4 sm:px-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteFee(idx)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus Komponen"
                        aria-label="Hapus Komponen"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab 3: FAQs */}
        <TabsContent value="faqs" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-base text-foreground">
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
              <Button type="submit">
                <Plus className="h-4 w-4" />
                Tambah FAQ
              </Button>
            </form>
          </Card>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card
                key={faq.id}
                className="p-5 sm:p-6 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-foreground">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="text-destructive hover:text-destructive shrink-0"
                  title="Hapus FAQ"
                  aria-label="Hapus FAQ"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
