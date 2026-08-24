"use client";

import React, { useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { useSchoolData } from "@/context/SchoolDataContext";
import { useToast } from "@/components/ui/toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import {
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
} from "@/components/public/SocialIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const { profile, settings, addContactMessage } = useSchoolData();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !subject || !message) {
      toast("Mohon lengkapi semua kolom formulir.", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addContactMessage({
        name,
        email,
        phone,
        subject,
        message,
      });

      setIsSubmitting(false);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      toast("Pesan Anda berhasil dikirim ke sekretariat Yazzaka! Kami akan segera merespons.", "success");
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCF8F1]">
      <Header />
      <main className="flex-1">

        {/* ── Headspace Warm Page Hero Banner ─────────── */}
        <section className="relative overflow-hidden bg-[#FCF8F1] py-10 lg:py-14 border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0E5] border border-[#FED7AA] text-[#FA6400] font-bold text-xs mb-3 shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Layanan Informasi &amp; Sekretariat</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E2330] tracking-tight leading-tight">
              Hubungi Pesantren Yazzaka
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed font-medium">
              Kami siap melayani pertanyaan seputar pendaftaran santri, kunjungan kampus, kemitraan akademik, dan konsultasi pendidikan.
            </p>
          </div>
        </section>

        {/* ── Content ─────────────────────────────────── */}
        <section className="py-12 lg:py-14 bg-white border-b border-[#E8E2D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Left Column: Contact Details (5 cols) */}
              <div className="lg:col-span-5 space-y-6">

                <div className="bg-[#FAF6EE] rounded-3xl p-6 border-2 border-[#E8E2D8] shadow-xs space-y-5">
                  <h2 className="text-lg font-bold text-[#1E2330]">
                    Informasi Kontak Resmi
                  </h2>

                  <div className="space-y-3.5 text-xs sm:text-sm text-stone-700">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#FFF0E5] text-[#FA6400] shrink-0 border border-[#FED7AA]">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1E2330] block">Alamat Kampus:</span>
                        <p className="mt-0.5 leading-relaxed text-stone-600 font-medium">
                          {profile.address}, {profile.city}, {profile.province}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#FFF0E5] text-[#FA6400] shrink-0 border border-[#FED7AA]">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1E2330] block">Telepon Kantor:</span>
                        <p className="mt-0.5 text-stone-600 font-medium">{profile.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#15803D] shrink-0 border border-[#BBF7D0]">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1E2330] block">WhatsApp Admisi:</span>
                        <a
                          href={`https://wa.me/${profile.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline mt-0.5 block"
                        >
                          +{profile.whatsapp}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#E0F2FE] text-[#0369A1] shrink-0 border border-[#BAE6FD]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1E2330] block">Email Resmi:</span>
                        <p className="mt-0.5 text-stone-600 font-medium">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#EDE9FE] text-[#6D28D9] shrink-0 border border-[#DDD6FE]">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#1E2330] block">Jam Pelayanan:</span>
                        <p className="mt-0.5 text-stone-600 font-medium">Senin - Sabtu: 08:00 - 15:30 WIB</p>
                        <p className="text-[11px] text-stone-500 font-medium">Ahad / Hari Libur Nasional: Tutup</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="pt-4 border-t border-[#E8E2D8] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      Media Sosial Resmi:
                    </span>
                    <div className="flex items-center gap-2.5">
                      <a
                        href={settings.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] text-stone-700 hover:text-pink-600 hover:border-pink-200 transition-colors shadow-xs"
                      >
                        <InstagramIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={settings.socialMedia.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] text-stone-700 hover:text-red-600 hover:border-red-200 transition-colors shadow-xs"
                      >
                        <YoutubeIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={settings.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white border border-[#E8E2D8] text-stone-700 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-xs"
                      >
                        <FacebookIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Google Maps Card */}
                <div className="bg-white rounded-3xl overflow-hidden border-2 border-[#E8E2D8] shadow-xs h-64">
                  <iframe
                    src={profile.mapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Peta Lokasi Pesantren Yazzaka"
                  />
                </div>

              </div>

              {/* Right Column: Interactive Contact Form (7 cols) */}
              <div className="lg:col-span-7 bg-[#FAF6EE] rounded-3xl p-6 sm:p-8 border-2 border-[#E8E2D8] shadow-xs space-y-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FA6400] block mb-1">
                    Kirim Pesan
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E2330]">
                    Sampaikan Pertanyaan &amp; Saran Anda
                  </h2>
                  <p className="text-xs text-stone-600 mt-1 font-medium">
                    Isi formulir di bawah ini, tim sekretariat kami akan merespons melalui email atau WhatsApp.
                  </p>
                </div>

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
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
