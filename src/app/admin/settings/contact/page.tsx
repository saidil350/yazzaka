"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  Save,
  MessageCircle,
  Mail,
  ExternalLink,
} from "lucide-react";

export default function AdminContactSettingsPage() {
  const { profile, updateProfile } = useSchoolData();
  const { toast } = useToast();

  const [phone, setPhone] = useState(profile.phone);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [email, setEmail] = useState(profile.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({ phone, whatsapp, email });
      setIsSaving(false);
      toast("Informasi kontak berhasil disimpan.", "success");
    }, 200);
  };

  const cleanWaNumber = whatsapp.replace(/\D/g, "");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Page Header ─────────────────────────────── */}
      <div>
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#FA6400] block mb-1">
          Website Settings / Kontak Resmi
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2330]">
          Informasi Kontak Lembaga
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Kelola nomor hotline, WhatsApp admisi, dan alamat email resmi sekolah.
        </p>
      </div>

      {/* ── Form ────────────────────────────────────── */}
      <form onSubmit={handleSave}>
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-base text-[#1E2330]">Saluran Komunikasi Publik</h3>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Pastikan nomor dan email yang dimasukkan aktif dan dapat dihubungi oleh calon santri atau wali santri.
            </p>
          </div>

          <div className="space-y-5">
            {/* Hotline */}
            <div className="space-y-1.5">
              <label htmlFor="input-phone" className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] flex items-center gap-2 block">
                <Phone className="h-3.5 w-3.5 text-[#FA6400]" aria-hidden="true" />
                Nomor Telepon Kantor
              </label>
              <Input
                id="input-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(0285) 123456"
              />
              <p className="text-xs text-stone-500 font-medium">
                Ditampilkan di header dan footer situs publik.
              </p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="input-whatsapp" className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-[#FA6400]" aria-hidden="true" />
                  WhatsApp Admisi SPMB
                </label>
                {cleanWaNumber && (
                  <a
                    href={`https://wa.me/${cleanWaNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#FA6400] hover:text-[#C2410C] font-bold transition-colors"
                  >
                    Uji link
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
              <Input
                id="input-whatsapp"
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="6281234567890"
              />
              <p className="text-xs text-stone-500 font-medium">
                Format internasional tanpa + atau spasi, contoh: 628123456789
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="input-email" className="text-xs font-extrabold uppercase tracking-wider text-[#1E2330] flex items-center gap-2 block">
                <Mail className="h-3.5 w-3.5 text-[#FA6400]" aria-hidden="true" />
                Alamat Email Resmi
              </label>
              <Input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sekretariat@yazzakka.sch.id"
              />
              <p className="text-xs text-stone-500 font-medium">
                Email utama yang menerima salinan notifikasi pesan masuk.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E8E2D8]">
            <Button
              type="submit"
              disabled={isSaving}
              variant="default"
              className="font-extrabold h-11 px-6 rounded-full shadow-[0_3px_0_#cc5000] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Simpan Kontak
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
