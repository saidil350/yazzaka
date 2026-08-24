"use client";

import React, { useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { formatRupiah } from "@/lib/utils";
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

export default function AdmissionPage() {
  const { admission, profile, addContactMessage } = useSchoolData();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interestProgram, setInterestProgram] = useState("Tahfiz & Sains Terpadu");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast("Nama lengkap dan nomor WhatsApp wajib diisi.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addContactMessage({
        name,
        email: email || "wali@santri.com",
        phone,
        subject: `Permintaan Konsultasi PPDB: ${interestProgram}`,
        message: notes || `Tertarik mendaftar program ${interestProgram}. Mohon informasi alur pendaftaran dan jadwal tes.`,
      });

      setIsSubmitting(false);
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
      toast("Permintaan konsultasi pendaftaran telah diterima! Tim admisi kami akan segera menghubungi Anda.", "success");
    }, 600);
  };

  const steps = [
    {
      step: "01",
      title: "Pengisian Formulir Online",
      desc: "Mengisi data diri calon santri dan mengunggah dokumen persyaratan dasar melalui portal SPMB resmi.",
      badge: "bg-[#FFF0E5] text-[#FA6400] border-[#FED7AA]",
    },
    {
      step: "02",
      title: "Observasi & Ujian Seleksi",
      desc: "Mengikuti tes potensi akademik, tes membaca dan hafalan Al-Qur'an, serta wawancara komitmen orang tua/wali.",
      badge: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
    },
    {
      step: "03",
      title: "Pengumuman Kelulusan",
      desc: "Hasil seleksi diumumkan secara resmi melalui laman SPMB dan notifikasi resmi WhatsApp dari panitia.",
      badge: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]",
    },
    {
      step: "04",
      title: "Daftar Ulang & Orientasi",
      desc: "Penyelesaian administrasi biaya pendidikan dan penyerahan kit santri menjelang masa Orientasi Asrama.",
      badge: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] font-bold text-xs mb-3 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{admission.periodName} ({admission.academicYear})</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Penerimaan Siswa &amp; Santri Baru
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Informasi resmi alur seleksi, berkas persyaratan, transparansi biaya pendidikan, dan formulir konsultasi PPDB online.
            </p>
          </div>
        </section>

        {/* ── Steps to Register ───────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FFF0E5] text-[#FA6400] font-bold text-xs border border-[#FED7AA]">
                Alur &amp; Prosedur
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
                Tahapan Pendaftaran &amp; Seleksi Masuk
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF6EE] p-5 rounded-2xl border-2 border-[#E8E2D8] space-y-3 flex flex-col justify-between shadow-xs hover:border-[#FA6400]/40 transition-all"
                >
                  <div className="space-y-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black border ${s.badge}`}>
                      Tahap {s.step}
                    </span>
                    <h3 className="text-base font-bold text-[#1E2330]">
                      {s.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── Requirements & Transparent Fees Grid ─────── */}
        <section className="py-12 lg:py-14 bg-[#FAF6EE] border-b border-[#E8E2D8]" id="biaya">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Requirements */}
              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold text-xs border border-[#BAE6FD]">
                    Dokumen Berkas
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#1E2330]">
                    Persyaratan Administrasi
                  </h2>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-[#E8E2D8] space-y-2.5 shadow-xs">
                  {admission.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl border-2 border-[#FED7AA] bg-[#FFF0E5] space-y-1.5 shadow-xs">
                  <span className="text-xs font-bold text-[#C2410C] block">
                    Jalur Beasiswa Khusus:
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    Tersedia beasiswa penuh &amp; parsial bagi santri berprestasi: Tahfiz minimal 10 Juz mutqin atau Juara 1-3 OSN tingkat kabupaten/provinsi.
                  </p>
                </div>
              </div>

              {/* Fees Table */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D28D9] font-bold text-xs border border-[#DDD6FE]">
                    Transparansi Biaya
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#1E2330]">
                    Rincian Biaya Pendidikan
                  </h2>
                </div>

                <div className="border-2 border-[#E8E2D8] rounded-2xl overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FAF6EE] border-b border-[#E8E2D8] font-bold uppercase text-[11px] text-stone-500">
                      <tr>
                        <th className="p-3.5 sm:px-5">Komponen</th>
                        <th className="p-3.5 sm:px-5">Kategori</th>
                        <th className="p-3.5 sm:px-5 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
                      {admission.fees.map((fee, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF6EE]/60 transition-colors">
                          <td className="p-3.5 sm:px-5 font-bold text-[#1E2330]">
                            {fee.name}
                            {fee.notes && (
                              <span className="block text-[11px] text-stone-500 font-normal mt-0.5">
                                {fee.notes}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 sm:px-5 text-xs text-stone-500">
                            {fee.category}
                          </td>
                          <td className="p-3.5 sm:px-5 text-right font-bold text-[#FA6400] text-sm sm:text-base">
                            {formatRupiah(fee.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-[#FAF6EE] border-t border-[#E8E2D8] text-[11px] text-stone-500 font-medium">
                    * Biaya sudah mencakup fasilitas asrama, konsumsi 3x sehari, laundry seragam, dan layanan kesehatan pesantren.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQs & Consultation Form ────────────────── */}
        <section className="py-12 lg:py-14 bg-white" id="faq">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* FAQ Accordion */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-xs border border-[#BBF7D0]">
                    Tanya Jawab
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#1E2330]">
                    Pertanyaan Seputar PPDB
                  </h2>
                </div>

                <Accordion className="space-y-2.5">
                  {admission.faqs.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      title={faq.question}
                      className="bg-[#FAF6EE] border border-[#E8E2D8] rounded-xl text-stone-800 font-bold"
                    >
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                        {faq.answer}
                      </p>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Consultation Form */}
              <div className="lg:col-span-5 bg-[#FAF6EE] p-6 rounded-3xl border-2 border-[#E8E2D8] space-y-4 shadow-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
                    Layanan Admisi
                  </span>
                  <h3 className="text-lg font-bold text-[#1E2330]">
                    Formulir Konsultasi Pendaftaran
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5 font-medium">
                    Ajukan pertanyaan seputar tes masuk atau jadwal kunjungan kampus.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <Input
                    label="Nama Calon Santri / Orang Tua"
                    required
                    placeholder="Contoh: Budi Prasetyo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white"
                  />

                  <Input
                    label="Nomor WhatsApp Aktif"
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white"
                  />

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      Program Minat
                    </label>
                    <select
                      value={interestProgram}
                      onChange={(e) => setInterestProgram(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#E8E2D8] px-3 text-xs sm:text-sm bg-white text-[#1E2330] font-medium"
                    >
                      <option value="Tahfiz & Sains Terpadu">Tahfiz &amp; Sains Terpadu</option>
                      <option value="Kelas Bilingual Internasional">Kelas Bilingual Internasional</option>
                      <option value="Program Reguler & Karakter">Program Reguler &amp; Karakter</option>
                    </select>
                  </div>

                  <Textarea
                    label="Pertanyaan / Catatan Khusus"
                    rows={3}
                    placeholder="Pertanyaan Anda seputar PPDB..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-white"
                  />

                  <Button
                    type="submit"
                    variant="default"
                    size="default"
                    disabled={isSubmitting}
                    className="w-full justify-center font-bold text-xs h-10"
                  >
                    {isSubmitting ? "Mengirimkan..." : "Kirim Permohonan Konsultasi"}
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
