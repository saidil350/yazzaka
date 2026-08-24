"use client";

import React, { useState } from "react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="max-w-2xl space-y-6">
      {/* ── Page Header ─────────────────────────────── */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight">
          Informasi Kontak
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola nomor hotline, WhatsApp admisi, dan alamat email resmi sekolah.
        </p>
      </div>

      <Separator />

      {/* ── Form ────────────────────────────────────── */}
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Saluran Komunikasi Publik</CardTitle>
            <CardDescription>
              Pastikan nomor dan email yang dimasukkan aktif dan dapat dihubungi oleh calon santri atau wali santri.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Hotline */}
            <div className="space-y-1.5">
              <label htmlFor="input-phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Nomor Telepon Kantor
              </label>
              <Input
                id="input-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(0285) 123456"
              />
              <p className="text-xs text-muted-foreground">
                Ditampilkan di header dan footer situs publik.
              </p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="input-whatsapp" className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  WhatsApp Admisi SPMB
                </label>
                {cleanWaNumber && (
                  <a
                    href={`https://wa.me/${cleanWaNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Uji link
                    <ExternalLink className="h-3 w-3" />
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
              <p className="text-xs text-muted-foreground">
                Format internasional tanpa + atau spasi, contoh: 628123456789
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="input-email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Alamat Email Resmi
              </label>
              <Input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sekretariat@yazzaka.sch.id"
              />
              <p className="text-xs text-muted-foreground">
                Email utama yang menerima salinan notifikasi pesan masuk.
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              isLoading={isSaving}
              className="ml-auto"
            >
              <Save className="h-4 w-4" />
              Simpan Kontak
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
