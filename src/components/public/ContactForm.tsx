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
 * Validasi inline per-field (aria-invalid + pesan di bawah input).
 */
export function ContactForm() {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot anti-bot: field tersembunyi yang manusia tidak pernah isi.
  const [website, setWebsite] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Nama lengkap wajib diisi.";
    if (!email.trim()) next.email = "Alamat email wajib diisi.";
    if (!phone.trim()) next.phone = "Nomor WhatsApp wajib diisi.";
    if (!subject.trim()) next.subject = "Subjek pesan wajib diisi.";
    if (!message.trim()) next.message = "Isi pesan wajib diisi.";
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast("Mohon lengkapi kolom yang ditandai merah.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Sukses hanya dilaporkan bila pesan benar-benar tersimpan di database.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message, website }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `API Error: ${res.status}`);
      }
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setWebsite("");
      toast("Pesan Anda berhasil dikirim ke sekretariat Yazzakka! Kami akan segera merespons.", "success");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "";
      if (detail.includes("Terlalu banyak pesan")) {
        toast(detail, "error");
      } else {
        toast("Maaf, pesan gagal terkirim. Silakan coba lagi atau hubungi kami via WhatsApp.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (key: string) =>
    errors[key] ? (
      <p id={`contact-error-${key}`} role="alert" className="text-xs text-destructive mt-1">
        {errors[key]}
      </p>
    ) : null;

  const ariaOf = (key: string) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contact-error-${key}` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Nama Lengkap"
            name="name"
            autoComplete="name"
            required
            placeholder="Contoh: Muhammad Irfan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            {...ariaOf("name")}
          />
          {fieldError("name")}
        </div>

        <div>
          <Input
            label="Nomor WhatsApp"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="0812…"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            {...ariaOf("phone")}
          />
          {fieldError("phone")}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Alamat Email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            {...ariaOf("email")}
          />
          {fieldError("email")}
        </div>

        <div>
          <Input
            label="Subjek / Topik Pesan"
            name="subject"
            autoComplete="off"
            required
            placeholder="Contoh: Info Kunjungan / Beasiswa"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            {...ariaOf("subject")}
          />
          {fieldError("subject")}
        </div>
      </div>

      <div>
        <Textarea
          label="Isi Pesan Lengkap"
          name="message"
          required
          rows={4}
          placeholder="Tuliskan pertanyaan atau keperluan Anda secara rinci…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          {...ariaOf("message")}
        />
        {fieldError("message")}
      </div>

      {/* Honeypot anti-bot — tersembunyi dari manusia, terisi oleh bot.
          tabIndex -1 + aria-hidden agar tidak mengganggu navigasi keyboard. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        size="default"
        disabled={isSubmitting}
        className="w-full sm:w-auto px-8 font-bold text-xs h-10"
      >
        <Send className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
        <span>{isSubmitting ? "Mengirimkan…" : "Kirim Pesan Sekarang"}</span>
      </Button>
    </form>
  );
}
