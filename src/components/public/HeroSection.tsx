"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronDown } from "lucide-react";
import { useSchoolData } from "@/context/SchoolDataContext";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { profile, admission } = useSchoolData();
  return (
    <section id="beranda" aria-labelledby="hero-heading" className="landing-section border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[1.08fr_.92fr]">
        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <p className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.24em] text-accent">
            <span className="h-px w-10 bg-accent" /> Yayasan Bina Iman Akhlak Yazzakka
          </p>
          <h1 id="hero-heading" className="max-w-3xl font-editorial text-5xl font-medium leading-[.98] tracking-[-.045em] text-primary-foreground sm:text-7xl lg:text-[5.9rem]">
            Membina iman.<br /><em className="text-accent">Mencetak</em> peradaban.
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-primary-foreground/70 sm:text-lg">
            {profile.tagline} Kami menumbuhkan generasi yang kokoh akidahnya, luas ilmunya, dan siap memberi manfaat bagi umat.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 rounded-sm bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent/90">
              <Link href="/pendaftaran">{admission.isOpen ? "Mulai pendaftaran" : "Lihat informasi"}<ArrowUpRight data-icon="inline-end" /></Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-12 justify-start rounded-sm px-4 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/tentang-kami"><BookOpen data-icon="inline-start" /> Mengenal Yazzakka</Link>
            </Button>
          </div>
          <div className="mt-16 flex items-center gap-6 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60">
            <span className="font-semibold text-primary-foreground">Sigli, Aceh</span><span className="h-1 w-1 rounded-full bg-accent" /><span>Est. 2022</span><span className="h-1 w-1 rounded-full bg-accent" /><span>Terdaftar resmi</span>
          </div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden border-t border-primary-foreground/10 lg:min-h-[700px] lg:border-l lg:border-t-0">
          <img src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1400&q=85" alt="Santri belajar Al-Qur'an bersama" className="absolute inset-0 h-full w-full object-cover grayscale-[.12]" />
          <div className="absolute inset-0 bg-primary/15" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-5 bg-gradient-to-t from-primary/90 to-transparent px-6 pb-8 pt-32 sm:px-10">
            <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-accent">Ruang tumbuh</p><p className="mt-2 max-w-xs font-editorial text-2xl leading-tight text-primary-foreground">Tradisi ilmu untuk masa depan yang lebih baik.</p></div>
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-primary-foreground/40 text-primary-foreground sm:flex"><ChevronDown /></span>
          </div>
        </div>
      </div>
    </section>
  );
}
