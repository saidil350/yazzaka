"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Island formulir kontak halaman /kontak — satu-satunya bagian interaktif.
 * POST langsung ke /api/contact (tanpa SchoolDataProvider; publik anonim).
 */
export function ContactForm() {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !subject || !message) {
      toast("Mohon lengkapi semua kolom formulir.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Sukses hanya dilaporkan bila pesan benar-benar tersimpan di database.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      toast("Pesan Anda berhasil dikirim ke sekretariat Yazzakka! Kami akan segera merespons.", "success");
    } catch {
      toast("Maaf, pesan gagal terkirim. Silakan coba lagi atau hubungi kami via WhatsApp.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap"
          required
          placeholder="Contoh: Muhammad Irfan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white"
        />

        <Input
          label="Nomor WhatsApp"
          type="tel"
          required
          placeholder="081234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Alamat Email"
          type="email"
          required
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white"
        />

        <Input
          label="Subjek / Topik Pesan"
          required
          placeholder="Contoh: Info Kunjungan / Beasiswa"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-white"
        />
      </div>

      <Textarea
        label="Isi Pesan Lengkap"
        required
        rows={4}
        placeholder="Tuliskan pertanyaan atau keperluan Anda secara rinci..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="bg-white"
      />

      <Button
        type="submit"
        variant="default"
        size="default"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-8 font-bold text-xs h-10"
      >
        <Send className="h-3.5 w-3.5 mr-1" />
        <span>{isSubmitting ? "Mengirimkan..." : "Kirim Pesan Sekarang"}</span>
      </Button>
    </form>
  );
}
