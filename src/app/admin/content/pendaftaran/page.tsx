"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, Save, Sparkles, CreditCard, HelpCircle } from "lucide-react";
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
  const [requirementsText, setRequirementsText] = useState(
    admission.requirements.join("\n")
  );

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

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const reqArray = requirementsText.split("\n").map((r) => r.trim()).filter(Boolean);
    updateAdmission({
      periodName,
      academicYear,
      isOpen,
      requirements: reqArray,
    });
    toast("Pengaturan umum PPDB berhasil disimpan!", "success");
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Periode Pendaftaran"
                value={periodName}
                onChange={(e) => setPeriodName(e.target.value)}
              />
              <Input
                label="Tahun Ajaran"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              />
            </div>

            <Textarea
              label="Daftar Persyaratan Berkas (Satu per baris)"
              rows={6}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
            />

            <div className="flex justify-end pt-4 border-t border-[#E8E2D8]">
              <Button type="submit" variant="default" size="default" className="font-bold h-11 px-6 shadow-sm">
                <Save className="h-4 w-4" />
                Simpan Informasi PPDB
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
