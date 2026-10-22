import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan className Tailwind dengan dukungan conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ke format standar Bahasa Indonesia (contoh: 24 Agustus 2026).
 * String tanggal-only ("2026-08-24") diparse sebagai UTC dan diformat dengan
 * timeZone UTC agar hasilnya identik di server maupun browser di zona waktu
 * mana pun (tanpa ini tanggal bisa bergeser satu hari di offset negatif).
 */
export function formatDateIndonesian(dateString: string): string {
  if (!dateString) return "-";
  try {
    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    const date = isDateOnly ? new Date(`${dateString}T00:00:00Z`) : new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: isDateOnly ? "UTC" : undefined,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format angka ke format mata uang Rupiah (contoh: Rp 4.500.000)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Membuat slug teks yang aman untuk URL
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Menghasilkan ID acak unik
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}
